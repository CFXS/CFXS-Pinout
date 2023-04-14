const width = 9.8
const height = 9.8
const pin_length = 0.75
const pins_per_side = 16
const pin_width = 0.35
const pin_spacing = 0.5
const corner = 0.3

export class Footprint_LQFP64 {
    GetCorner() {
        return { x: -width / 2, y: -height / 2 }
    }

    GenerateOutline() {
        var data: Array<any> = []
        data.push({ x: corner, y: 0 })
        data.push({ x: width - corner, y: 0 })
        data.push({ x: width, y: corner })
        data.push({ x: width, y: height - corner })
        data.push({ x: width - corner, y: height })
        data.push({ x: corner, y: height })
        data.push({ x: 0, y: height - corner })
        data.push({ x: 0, y: corner })
        data.push({ x: corner, y: 0 })

        for (var d of data) {
            d.x -= width / 2
            d.y -= height / 2
        }

        return data
    }

    GeneratePins() {
        var data: Array<any> = []

        for (var i = 0; i < pins_per_side; i++) {
            const mid_x = i * pin_spacing - pin_spacing * pins_per_side / 2 - pin_width / 2 + pin_spacing / 2
            data.push({ x: mid_x, y: -height / 2 - pin_length, width: pin_width, height: pin_length, index: pins_per_side * 4 - i, writing_mode: "vertical-lr" })
        }

        for (var i = 0; i < pins_per_side; i++) {
            const mid_x = i * pin_spacing - pin_spacing * pins_per_side / 2 - pin_width / 2 + pin_spacing / 2
            data.push({ x: mid_x, y: height / 2, width: pin_width, height: pin_length, index: pins_per_side + 1 + i, writing_mode: "vertical-lr" })
        }

        for (var i = 0; i < pins_per_side; i++) {
            const mid_y = i * pin_spacing - pin_spacing * pins_per_side / 2 - pin_width / 2 + pin_spacing / 2
            data.push({ x: -pin_length - width / 2, y: mid_y, width: pin_length, height: pin_width, index: 1 + i, writing_mode: "horizontal-lr" })
        }

        for (var i = 0; i < pins_per_side; i++) {
            const mid_y = i * pin_spacing - pin_spacing * pins_per_side / 2 - pin_width / 2 + pin_spacing / 2
            data.push({ x: width / 2, y: mid_y, width: pin_length, height: pin_width, index: pins_per_side * 3 - i, writing_mode: "horizontal-lr" })
        }

        return data
    }
}