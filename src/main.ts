import "./Styles/style.css"
import "./Styles/ui.css"

import * as Utils from "./Utils"
import { DrawSurfacePointerData } from "./Components/DrawSurface"
import { DrawSurface } from "./Components/DrawSurface"
import { MathUtils } from "./Math"
import { Range } from "./Utils"
import { Tree } from "./Components/Tree"

import * as d3 from "d3-zoom"
import { select, Selection } from "d3-selection"
import { transition, Transition } from "d3-transition"
import { Footprint_LQFP48 } from "./Footprints/LQFP48"
import { Footprint_LQFP64 } from "./Footprints/LQFP64"
import { Footprint_LQFP128 } from "./Footprints/LQFP128"
import { Footprint_LQFP144 } from "./Footprints/LQFP144"

// function Draw(surface: DrawSurface, ctx: CanvasRenderingContext2D, pointer_data: DrawSurfacePointerData) {
// }

// var response_surface = new DrawSurface({
//     canvas: <HTMLCanvasElement>document.getElementById("plot"),
//     scale: 1,
//     dpi_scaling: true,
//     draw_function: Draw,
//     pointer_move_callback: (surface: DrawSurface, pdat: DrawSurfacePointerData) => { surface.Draw(pdat); },
//     pointer_target: document.getElementById("plot").parentElement
// })

var g_DeviceTree = new Tree(document.getElementById("device_list_frame").querySelector("div"))
var g_PeripheralTree = new Tree(document.getElementById("peripheral_list_frame").querySelector("div"))

const PART_LIST = [
    "Texas Instruments/Tiva/TM4C1294NCPDT",
    "Texas Instruments/Tiva/TM4C129ENCPDT",
    "Texas Instruments/Development Board/EK-TM4C129EXL",
    "STMicroelectronics/STM32H7/STM32H753ZI",
    "STMicroelectronics/STM32H7/STM32H7A3ZIQ",
    "STMicroelectronics/Development Board/NUCLEO-H753ZI",
    "STMicroelectronics/Development Board/NUCLEO-H7A3ZI-Q",
    "Nuvoton/M48x/M487KMCAN",
    "Nuvoton/Development Board/NuMaker-M487KM",
]

for (const p of PART_LIST) {
    g_DeviceTree.Insert(p)
}

const PERIPHERALS = [
    "Debug/SWD",
    "Debug/TRACE",
    "GPIO/PORT_A",
    "GPIO/PORT_B",
    "GPIO/PORT_C",
    "GPIO/PORT_D",
    "GPIO/PORT_E",
    "GPIO/PORT_F",
    "GPIO/PORT_G",
    "GPIO/PORT_H",
    "Timer/TIMER0",
    "Timer/TIMER1",
    "Timer/TIMER2",
    "Timer/TIMER3",
    "Basic PWM/BPWM0",
    "Basic PWM/BPWM1",
    "Enhanced PWM/EPWM0",
    "Enhanced PWM/EPWM1",
    "QEI/QEI0",
    "QEI/QEI1",
    "CAN/CAN0",
    "CAN/CAN1",
    "UART/UART0",
    "UART/UART1",
    "UART/UART2",
    "UART/UART3",
    "UART/UART4",
    "UART/UART5",
    "Ethernet/EMAC0",
]

for (const p of PERIPHERALS) {
    g_PeripheralTree.Insert(p)
}

function GetWidth() {
    return document.getElementById("device_area").clientWidth
}

function GetHeight() {
    return document.getElementById("device_area").clientHeight
}

let data: any = []
let numPoints = 100

let zoom = d3.zoom()
    .scaleExtent([1, Infinity])
    .translateExtent([[-GetWidth() / 2, -GetHeight() / 2], [GetWidth() / 2, GetHeight() / 2]])
    .filter(function (e: any) {
        if (e.constructor === MouseEvent) {
            return (e.button === 0 && e.ctrlKey);
        } else if (e.constructor === WheelEvent) {
            return true;
        }

        return false;
    })
    .on('zoom', handleZoom)

function handleZoom(e: any) {
    select('svg g')
        .attr('transform', e.transform)
        .attr('stroke-width', 1 / e.transform.k)
}

function initZoom() {
    select('svg')
        .call(zoom)
}

initZoom();

var svg = select('svg g')

function CenterXY(arr: any) {
    arr.forEach((e: any) => { e.x += GetWidth() / 2; e.y += GetHeight() / 2 })
    return arr
}

var g = select("svg g")
function Draw_LQFP(name: string, fp: any, x_offset: number) {
    // outline
    var pts = []
    for (const d of CenterXY(fp.GenerateOutline())) {
        pts.push([d.x + x_offset, d.y].join(" "))
    }
    g.append("polygon")
        .attr("points", pts.join(","))
        .attr("stroke", "#555")
        .attr("stroke-width", "0.05")
        .attr("fill", "#111")

    // pins
    for (const d of CenterXY(fp.GeneratePins())) {
        g.append("rect")
            .attr("x", d.x + x_offset)
            .attr("y", d.y)
            .attr("width", d.width)
            .attr("height", d.height)
            .attr("stroke", "#555")
            .attr("stroke-width", "0.035")
            .attr("fill", "#111")
    }

    // first pin indicator
    g.append("circle")
        .attr("cx", fp.GetCorner().x + 0.5 + GetWidth() / 2 + x_offset)
        .attr("cy", fp.GetCorner().y + 0.5 + GetHeight() / 2)
        .attr("r", 0.25)
        .attr("stroke", "none")
        .attr("fill", "#555")

    // pin numbers
    for (const d of CenterXY(fp.GeneratePins())) {
        g.append("text")
            .attr("x", d.x + d.width / 2 + x_offset)
            .attr("y", d.y + d.height / 2)
            .text(d.index)
            .style("writing-mode", d.writing_mode)
            .style("font-size", "0.225")
            .style("text-anchor", "middle")
            .style("dominant-baseline", "central")
            .attr("stroke", "none")
            .attr("fill", "#AAA")
            .style("font-family", "monospace")
    }

    // label
    g.append("text")
        .text(name)
        .attr("x", GetWidth() / 2 + x_offset)
        .attr("y", GetHeight() / 2)
        .style("font-family", "monospace")
        .style("font-size", "1")
        .style("text-anchor", "middle")
        .style("dominant-baseline", "central")
        .attr("stroke", "none")
        .attr("fill", "#FFF")
}

function Draw_NuMaker_M487KM() {
    const fp = new Footprint_LQFP128
    const name = "M487KMCAN"
    const x_offset = 0
    const y_offset = 0
    const mcu_rot = "rotate(135)"

    // board
    g.append("rect")
        .attr("x", -66 + x_offset)
        .attr("y", -31 + y_offset)
        .attr("width", 140)
        .attr("height", 62)
        .attr("stroke", "none")
        .attr("fill", "#200")

    // outline
    var pts = []
    for (const d of fp.GenerateOutline()) {
        pts.push([d.x + x_offset, d.y + y_offset].join(" "))
    }
    g.append("polygon")
        .attr("points", pts.join(","))
        .attr("stroke", "#555")
        .attr("stroke-width", "0.05")
        .attr("fill", "#111")
        .attr("transform", mcu_rot)

    // pins
    for (const d of fp.GeneratePins()) {
        g.append("rect")
            .attr("x", d.x + x_offset)
            .attr("y", d.y + y_offset)
            .attr("width", d.width)
            .attr("height", d.height)
            .attr("stroke", "none")
            .attr("fill", "#555")
            .attr("transform", mcu_rot)
    }

    // first pin indicator
    g.append("circle")
        .attr("cx", fp.GetCorner().x + 0.5 + x_offset)
        .attr("cy", fp.GetCorner().y + 0.5 + y_offset)
        .attr("r", 0.25)
        .attr("stroke", "none")
        .attr("fill", "#555")
        .attr("transform", mcu_rot)

    // pin numbers
    // for (const d of fp.GeneratePins()) {
    //     g.append("text")
    //         .attr("x", d.x + d.width / 2 + x_offset)
    //         .attr("y", d.y + d.height / 2 + y_offset)
    //         .text(d.index)
    //         .style("writing-mode", d.writing_mode)
    //         .style("font-size", "0.225")
    //         .style("text-anchor", "middle")
    //         .style("dominant-baseline", "central")
    //         .attr("stroke", "none")
    //         .attr("fill", "#AAA")
    //         .style("font-family", "monospace")
    //         .attr("transform", mcu_rot)
    // }

    // label
    g.append("text")
        .text(name)
        .attr("x", x_offset)
        .attr("y", y_offset)
        .style("font-family", "monospace")
        .style("font-size", "2")
        .style("text-anchor", "middle")
        .style("dominant-baseline", "central")
        .attr("stroke", "none")
        .attr("fill", "#FFF")


    g.append("text")
        .text("NuMaker-M487KM V1.0")
        .attr("x", 24 + x_offset)
        .attr("y", 11 + y_offset)
        .style("font-size", "2.5")
        .style("text-anchor", "middle")
        .style("dominant-baseline", "central")
        .attr("stroke", "none")
        .attr("fill", "#999")

    // pads
    var pads: any = []
    const pad_spacing = 2.54

    var idx = 64
    for (var x = 0; x < 32; x++) {
        for (var y = 1; y >= 0; y--) {
            const px = pad_spacing * x - (pad_spacing * 31) / 2
            const py = pad_spacing * y - pad_spacing / 2 - 35 / 2
            pads.push({
                x: px,
                y: py,
                tx: px,
                ty: y == 0 ? py - 1.75 : py + 1.75,
                index: idx
            })
            idx--
        }
    }

    idx = 65
    for (var x = 0; x < 32; x++) {
        for (var y = 1; y >= 0; y--) {
            const px = pad_spacing * x - (pad_spacing * 31) / 2
            const py = pad_spacing * y - pad_spacing / 2 + 35 / 2
            pads.push({
                x: px,
                y: py,
                tx: px,
                ty: y == 0 ? py - 1.75 : py + 1.75,
                index: idx
            })
            idx++
        }
    }

    for (const d of pads) {
        g.append("circle")
            .attr("cx", d.x + x_offset)
            .attr("cy", d.y + y_offset)
            .attr("r", 0.6)
            .attr("stroke", "none")
            .attr("fill", "#555")

        g.append("text")
            .attr("x", d.tx + x_offset)
            .attr("y", d.ty + y_offset)
            .text(d.index)
            .style("font-size", "1")
            .style("text-anchor", "middle")
            .style("dominant-baseline", "central")
            .attr("stroke", "none")
            .attr("fill", "#999")
            .style("font-family", "monospace")
    }
}

// Draw_LQFP("LQFP144", new Footprint_LQFP144, 0)
// Draw_LQFP("LQFP128", new Footprint_LQFP128, 0)
// Draw_LQFP("LQFP64", new Footprint_LQFP64, 0)
// Draw_LQFP("LQFP48", new Footprint_LQFP48, 0)

Draw_NuMaker_M487KM()

var device_footprint = <SVGGraphicsElement>select('svg g').node()

var center_transform: d3.ZoomTransform

function UpdateCenterTransform() {
    const bb = device_footprint.getBBox()
    const x0 = bb.x
    const y0 = bb.y
    const x1 = x0 + bb.width
    const y1 = y0 + bb.height

    center_transform = d3.zoomIdentity
        .translate(GetWidth() / 2, GetHeight() / 2)
        .scale(Math.min(1000, 0.95 / Math.max((x1 - x0) / GetWidth(), (y1 - y0) / GetHeight())))
        .translate(-(x0 + x1) / 2, -(y0 + y1) / 2)
}

window.onresize = () => { UpdateCenterTransform() }
UpdateCenterTransform()
select('svg').call(<any>zoom.transform, center_transform)

document.getElementById("device_area").onauxclick = (e) => {
    if (e.button === 1) {
        UpdateCenterTransform()
        select('svg').call(<any>zoom.transform, center_transform)
    }
}