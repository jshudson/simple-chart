import data from './data.js'

const xyToObject = (data) => {
    return { x: data.map(x => x[0]), y: data.map(y => y[1]) }
}

const scalePoints = (points, plotMin, plotMax, scaleMin, scaleMax) => {
    return points.map(point => ((point - plotMin) * (scaleMax - scaleMin) / (plotMax - plotMin) + scaleMin))
}

const scaleDataToSVG = (points, limits, svgDimensions) => {

    // svgDimensions.height = svgDimensions.height
    let yMin = svgDimensions.height - svgDimensions.yMin
    let yMax = svgDimensions.height - svgDimensions.yMax
    const scaleX = scalePoints(points.x, limits.x1, limits.x2, svgDimensions.xMin, svgDimensions.xMax);
    const scaleY = scalePoints(points.y, limits.y1, limits.y2, yMin, yMax);

    return { x: scaleX, y: scaleY }
}

const convertToPath = (points, svgDimensions) => {

    let prevInGraph = false, curInGraph, nextInGraph = true;

    let command, x, y, ny;

    let i = points.x.findIndex(e => e >= 0);
    x = points.x[i];
    let path = `M${points.x[i]},${points.y[i]}`;
    i++;
    while (i < points.x.length && x <= svgDimensions.width && x >= 0) {
        // while (i < 110 && x < svgDimensions.width) {
        x = points.x[i]
        y = points.y[i]
        ny = points.y[i + 1]
        curInGraph = inGraph(y, svgDimensions)
        nextInGraph = inGraph(ny, svgDimensions)
        command = getCommand(x, y, prevInGraph, curInGraph, nextInGraph)
        path += command;
        prevInGraph = curInGraph
        i++;
    }
    // console.log(path);
    return path
}
const inGraph = (y, svgDimensions) => {
    return !(
        y < 0 ||
        y > svgDimensions.height
    )
}
const getCommand = (x, y, prevInGraph, curInGraph, nextInGraph) => {
    if (!curInGraph && nextInGraph) return `M${x},${y}`
    if (curInGraph || prevInGraph || nextInGraph) return `L${x},${y}`
    return ``
}
const SVGString = (points, limits, svgDimensions) => {
    return `
        <path
    d = ${convertToPath(scaleDataToSVG(points, limits, svgDimensions), svgDimensions)}
    clip-path="url(#plot-clip)"/>
        `
}
const getLimits = (points) => {
    const x1 = Math.min(...points.x)
    const x2 = Math.max(...points.x)
    const y1 = Math.min(...points.y)
    const y2 = Math.max(...points.y)
    const limits = { x1, x2, y1, y2 }
    return limits
}

const svg = document.getElementById('test');

const rectBox = {
    active: false,
    x1: 0,
    x2: 0,
    y1: 0,
    y2: 0
}

const points = xyToObject(data)
const limits = getLimits(points)
// limits.y2 /= 4;
// limits.x2 = 26;
const resizeDiv = document.getElementById('graph')


let oldSize = { width: 0, height: 0 }

const resizeObserver = new ResizeObserver((entries) => {
    for (const entry of entries) {
        if (!entry.contentBoxSize) return
        const newSize = {
            width: Math.floor(entry.contentBoxSize[0].inlineSize),
            height: Math.floor(entry.contentBoxSize[0].blockSize)
        }

        updateSVGDimensions(newSize)

    };
})
const pad = 10;

const updateSVGDimensions = (newSize) => {
    if (
        Math.abs(newSize.width - oldSize.width) < 2 &&
        Math.abs(newSize.height - oldSize.height) < 2) return;


    const plotDimensions = {
        width: newSize.width - pad,
        height: newSize.height,
        xMin: pad,
        xMax: newSize.width - pad,
        yMin: pad,
        yMax: newSize.height - pad
    }

    svg.style.width = newSize.width + "px"
    svg.style.height = newSize.height + "px"

    const plot = document.getElementById('plot');

    plot.innerHTML = SVGString(points, limits, plotDimensions)

    oldSize = { ...newSize }


}


resizeObserver.observe(resizeDiv);



svg.oncontextmenu = e => {
    e.preventDefault();
}

svg.onmousedown = e => {
    e.preventDefault()
    console.log(e);
    if (e.buttons === 1) {
        rectBox.active = true
        rectBox.x1 = rectBox.x2 = e.offsetX
        rectBox.y1 = rectBox.y2 = e.offsetY
    }
}

const getLimitsFromRect = (plotDimensions) => {

}
svg.onmouseup = e => {
    e.preventDefault()
    rectBox.active = false
    console.log('hi"')
    const rect = document.getElementById('rect');
    rect.innerHTML = '';

    console.log(svg.getBBox());
    // limits = getLimitsFromRect(plotDimensions)
    let { active: _, ...limits } = rectBox
    console.log(limits);
}
const drawRect = (element, rectBox) => {
    const width = Math.abs(rectBox.x2 - rectBox.x1)
    const height = Math.abs(rectBox.y2 - rectBox.y1)
    const x = Math.min(rectBox.x1, rectBox.x2);
    const y = Math.min(rectBox.y1, rectBox.y2);
    const rect = `
    <rect
        x = "${x}"
        y = "${y}"
        width = "${width}"
        height = "${height}"
    /> `
    element.innerHTML = rect
    console.log(rect);
}
svg.onmouseleave = e => {
    e.preventDefault()
    rectBox.active = false
    console.log('out')
    const rect = document.getElementById('rect');
    rect.innerHTML = '';
}
svg.onmousemove = ev => {
    if (rectBox.active) {
        rectBox.x2 = ev.offsetX
        rectBox.y2 = ev.offsetY
        const rect = document.getElementById('rect');
        drawRect(rect, rectBox)
    }
}
