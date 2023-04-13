
import * as UI from "./../UI"

type DrawFunction = (surface: DrawSurface, ctx: CanvasRenderingContext2D, pointer_data: DrawSurfacePointerData) => void
type PointerFunction = (surface: DrawSurface, pointer_data: DrawSurfacePointerData) => void
type ResizeFunction = (surface: DrawSurface) => void
type FontsLoadedFunction = (surface: DrawSurface) => void

export interface SurfaceConfig {
    canvas: HTMLCanvasElement
    scale?: number
    dpi_scaling?: boolean
    draw_function?: DrawFunction
    pointer_move_callback?: PointerFunction
    pointer_state_callback?: PointerFunction
    resize_callback?: ResizeFunction
    pointer_target?: HTMLElement
    fonts_loaded?: FontsLoadedFunction
    user_data?: any
    wait_for_fonts?: Array<string>
}

export interface DrawSurfacePointerData {
    x: number
    y: number
    move?: boolean
    state?: boolean
}

export class DrawSurface {
    m_DS_Config: SurfaceConfig
    m_Context: CanvasRenderingContext2D
    m_DrawRequest: boolean
    m_ActualScale: number

    constructor(cfg: SurfaceConfig, draw_on_constructor: boolean = true) {
        this.m_DS_Config = cfg
        if (this.m_DS_Config.dpi_scaling === undefined)
            this.m_DS_Config.dpi_scaling = true
        this.m_Context = cfg.canvas.getContext("2d")
        this.m_DS_Config.scale = this.m_DS_Config.scale || 1
        this.m_DS_Config.pointer_target = this.m_DS_Config.pointer_target || cfg.canvas

        this.m_DrawRequest = true

        this.m_ActualScale = (this.m_DS_Config.dpi_scaling ? window.devicePixelRatio : 1) * this.m_DS_Config.scale
        this.m_DS_Config.canvas.width = this.m_DS_Config.canvas.clientWidth * this.m_ActualScale
        this.m_DS_Config.canvas.height = this.m_DS_Config.canvas.clientHeight * this.m_ActualScale
        if (this.m_DS_Config.resize_callback)
            this.m_DS_Config.resize_callback(this)

        // Initialize events
        window.addEventListener("resize", (e) => {
            this.m_ActualScale = (this.m_DS_Config.dpi_scaling ? window.devicePixelRatio : 1) * this.m_DS_Config.scale
            this.m_DS_Config.canvas.width = this.m_DS_Config.canvas.clientWidth * this.m_ActualScale
            this.m_DS_Config.canvas.height = this.m_DS_Config.canvas.clientHeight * this.m_ActualScale
            if (this.m_DS_Config.resize_callback)
                this.m_DS_Config.resize_callback(this)
            this.Draw()
        })

        this.m_DS_Config.pointer_target.addEventListener("mousemove", (e) => { DrawSurface._ProcessPointerMove(this, e) })
        this.m_DS_Config.pointer_target.addEventListener("touchmove", (e) => { DrawSurface._ProcessPointerMove(this, e) })
        this.m_DS_Config.pointer_target.addEventListener("mousedown", (e) => { DrawSurface._ProcessPointerState(this, e, true) })
        this.m_DS_Config.pointer_target.addEventListener("touchstart", (e) => { DrawSurface._ProcessPointerState(this, e, false) })
        this.m_DS_Config.pointer_target.addEventListener("mouseup", (e) => { DrawSurface._ProcessPointerState(this, e, true) })
        this.m_DS_Config.pointer_target.addEventListener("touchend", (e) => { DrawSurface._ProcessPointerState(this, e, false) })

        if (this.m_DS_Config.wait_for_fonts) {
            let checkFontInterval = setInterval(() => {
                var available: boolean = true
                for (const f of this.m_DS_Config.wait_for_fonts) {
                    if (!document.fonts.check(f)) {
                        available = false
                        break
                    }
                }
                if (available) {
                    if (this.m_DS_Config.fonts_loaded) {
                        this.m_DS_Config.fonts_loaded(this)
                    }
                    clearInterval(checkFontInterval)
                }
            }, 50)
        }

        if (draw_on_constructor)
            this.Draw()
    }

    Draw(pointer_data: DrawSurfacePointerData = null) {
        if (this.m_DS_Config.draw_function)
            this.m_DS_Config.draw_function(this, this.m_Context, pointer_data)
        this.m_DrawRequest = false
    }

    RequestDraw() {
        this.m_DrawRequest = true
        this.Draw()
    }

    ///////////////////////////////////////////////////////

    static _ProcessPointerMove(surface: DrawSurface, e: any) {
        if (e.touches) {
            var touch = e.touches[0] || e.changedTouches[0];
            e.pageX = touch.pageX
            e.pageY = touch.pageY
        }

        const targetCorner = UI.GetAbsoluteCorner(surface.m_DS_Config.pointer_target)
        const pointerData: DrawSurfacePointerData = {
            x: (e.pageX - targetCorner.left) * surface.m_ActualScale,
            y: (e.pageY - targetCorner.top) * surface.m_ActualScale,
            move: true,
        }

        if (surface.m_DS_Config.pointer_move_callback)
            surface.m_DS_Config.pointer_move_callback(surface, pointerData)

        if (surface.m_DrawRequest)
            surface.Draw(pointerData)
    }

    static _ProcessPointerState(surface: DrawSurface, e: any, state: boolean) {
        if (e.touches) {
            var touch = e.touches[0] || e.changedTouches[0];
            e.pageX = touch.pageX
            e.pageY = touch.pageY
        }

        const targetCorner = UI.GetAbsoluteCorner(surface.m_DS_Config.pointer_target)
        const pointerData: DrawSurfacePointerData = {
            x: (e.pageX - targetCorner.left) * surface.m_ActualScale,
            y: (e.pageY - targetCorner.top) * surface.m_ActualScale,
            state: state,
        }

        if (surface.m_DS_Config.pointer_state_callback)
            surface.m_DS_Config.pointer_state_callback(surface, pointerData)

        if (surface.m_DrawRequest)
            surface.Draw(pointerData)
    }
}