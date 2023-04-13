function ShortUnit(x: number, space: boolean, suf: string) {
    if (x < 1000) {
        return x + (space ? " " : "") + suf
    } else if (x < 1000000) {
        return x / 1000 + (space ? " " : "") + "k" + suf
    } else {
        return x / 1000000 + (space ? " " : "") + "M" + suf
    }
}

class Range<Type> {
    private m_Min: Type
    private m_Max: Type

    constructor(min: Type, max: Type) {
        this.m_Min = min
        this.m_Max = max
    }

    GetMin() { return this.m_Min }
    GetMax() { return this.m_Max }
    GetLow() { return this.m_Min }
    GetHigh() { return this.m_Max }

    Contains(value: Type) {
        return value >= this.m_Min && value <= this.m_Max
    }
}

export {
    ShortUnit,
    Range
}