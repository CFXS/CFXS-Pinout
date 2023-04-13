import "./Styles/style.css"
import "./Styles/ui.css"

import * as Utils from "./Utils"
import { DrawSurfacePointerData } from "./Components/DrawSurface"
import { DrawSurface } from "./Components/DrawSurface"
import { MathUtils } from "./Math"
import { Range } from "./Utils"


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