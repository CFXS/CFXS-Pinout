import "./Styles/style.css"
import "./Styles/ui.css"

import * as Utils from "./Utils"
import { DrawSurfacePointerData } from "./Components/DrawSurface"
import { DrawSurface } from "./Components/DrawSurface"
import { MathUtils } from "./Math"
import { Range } from "./Utils"
import { Tree } from "./Components/Tree"

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
    "STMicroelectronics/STM32H7/STM32H753ZI",
    "STMicroelectronics/STM32H7/STM32H7A3ZIQ",
    "Nuvoton/M48x/M487KMCAN",
]

for (const p of PART_LIST) {
    g_DeviceTree.Insert(p)
}

const PERIPHERALS = [
    "Debug/SWD",
    "Debug/Trace",
    "GPIO/Port A",
    "GPIO/Port B",
    "GPIO/Port C",
    "GPIO/Port D",
    "GPIO/Port E",
    "GPIO/Port F",
    "GPIO/Port G",
    "GPIO/Port H",
    "Timer/Timer 0",
    "Timer/Timer 1",
    "Timer/Timer 2",
    "Timer/Timer 3",
    "Basic PWM/BPWM 0",
    "Basic PWM/BPWM 1",
    "Enhanced PWM/EPWM 0",
    "Enhanced PWM/EPWM 1",
    "QEI/QEI 0",
    "QEI/QEI 1",
    "CAN/CAN 0",
    "CAN/CAN 1",
    "UART/UART 0",
    "UART/UART 1",
    "UART/UART 2",
    "UART/UART 3",
    "UART/UART 4",
    "UART/UART 5",
    "Ethernet/EMAC 0",
]

for (const p of PERIPHERALS) {
    g_PeripheralTree.Insert(p)
}