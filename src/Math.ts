export const SQRT_2 = Math.sqrt(2)
export const SQRT_3 = Math.sqrt(3)

export class MathUtils {

    static lerp(a: number, b: number, delta: number) {
        delta = delta < 0 ? 0 : delta
        delta = delta > 1 ? 1 : delta
        return a + (b - a) * delta
    }

    static map(x: number, in_min: number, in_max: number, out_min: number, out_max: number) {
        return (x - in_min) * (out_max - out_min) / (in_max - in_min) + out_min
    }

    static clamp(x: number, min: number, max: number) {
        return Math.min(Math.max(x, min), max)
    }

    static map_clamp(x: number, in_min: number, in_max: number, out_min: number, out_max: number) {
        return MathUtils.clamp(MathUtils.map(x, in_min, in_max, out_min, out_max), out_min, out_max)
    }

    static map_custom_clamp(x: number, in_min: number, in_max: number, out_min: number, out_max: number, clamp_min: number, clamp_max: number) {
        return MathUtils.clamp(MathUtils.map(x, in_min, in_max, out_min, out_max), clamp_min, clamp_max)
    }

}