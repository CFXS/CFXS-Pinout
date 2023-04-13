function GetAbsoluteCorner(el: HTMLElement) {
    const rect = el.getBoundingClientRect();
    return {
        left: rect.left + window.scrollX,
        top: rect.top + window.scrollY
    }
}

export { GetAbsoluteCorner }