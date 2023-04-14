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