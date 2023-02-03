const SVGNS = 'http://www.w3.org/2000/svg'
// #region Utils
/**
 * The base implementation of `_.clamp` which doesn't coerce arguments.
 *
 * @private
 * @param {number} number The number to clamp.
 * @param {number} [lower] The lower bound.
 * @param {number} upper The upper bound.
 * @returns {number} Returns the clamped number.
 */
function baseClamp(number, lower, upper) {
    if (number === number) {
        if (upper !== undefined) {
            number = number <= upper ? number : upper;
        }
        if (lower !== undefined) {
            number = number >= lower ? number : lower;
        }
    }
    return number;
}
/**
 * Clamps `number` within the inclusive `lower` and `upper` bounds.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Number
 * @param {number} number The number to clamp.
 * @param {number} [lower] The lower bound.
 * @param {number} upper The upper bound.
 * @returns {number} Returns the clamped number.
 * @example
 *
 * _.clamp(-10, -5, 5);
 * // => -5
 *
 * _.clamp(10, -5, 5);
 * // => 5
 */
function clamp(number, lower, upper) {
    if (upper === undefined) {
        upper = lower;
        lower = undefined;
    }
    if (upper !== undefined) {
        upper = toNumber(upper);
        upper = upper === upper ? upper : 0;
    }
    if (lower !== undefined) {
        lower = toNumber(lower);
        lower = lower === lower ? lower : 0;
    }
    return baseClamp(toNumber(number), lower, upper);
}
/**
 * Converts `value` to a number.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to process.
 * @returns {number} Returns the number.
 * @example
 *
 * _.toNumber(3.2);
 * // => 3.2
 *
 * _.toNumber(Number.MIN_VALUE);
 * // => 5e-324
 *
 * _.toNumber(Infinity);
 * // => Infinity
 *
 * _.toNumber('3.2');
 * // => 3.2
 */
function toNumber(value) {
    if (typeof value == 'number') {
        return value;
    }
    if (isSymbol(value)) {
        return NAN;
    }
    if (isObject(value)) {
        var other = typeof value.valueOf == 'function' ? value.valueOf() : value;
        value = isObject(other) ? (other + '') : other;
    }
    if (typeof value != 'string') {
        return value === 0 ? value : +value;
    }
    value = value.replace(reTrim, '');
    var isBinary = reIsBinary.test(value);
    return (isBinary || reIsOctal.test(value))
        ? freeParseInt(value.slice(2), isBinary ? 2 : 8)
        : (reIsBadHex.test(value) ? NAN : +value);
}
// #endregion
const spanx = document.getElementById('x')
const spany = document.getElementById('y')
const objectOut = document.getElementById('object')
class Chart {
    constructor(div) {

        this.element = div

        this.initializePlotVariables();

        this.createChart();
        this.createClip();
        this.createPlotGroup();
        this.createZoomGroup();

        this.bindEvents();
    }

    // #region Constructor Helpers
    /**
     * Set initial plot state
     */
    initializePlotVariables() {
        this.plotRange = {
            x1: 0,
            x2: 0,
            y1: 0,
            y2: 0
        }

        this.plotScreenDimensions = {
            pad: 10,
            width: this.element.offsetWidth,
            height: this.element.offsetHeight,
        }

        this.data = [];
        this.strokeWidth = 3;
    }

    /**
     * Create SVG element for drawing the chart
     */
    createChart() {
        this.chart = this.element.appendChild(document.createElementNS(SVGNS, 'svg'));
        this.chart.setAttribute('width', this.plotScreenDimensions.width)
        this.chart.setAttribute('height', this.plotScreenDimensions.height)
    }

    /**
     * Create clip rectangle for constraining plots
     */
    createClip() {
        this.plotClip = this.appendNewElement(this.chart, 'clipPath', { id: 'plot-clip' }, SVGNS)

        this.clipRect = this.plotClip.appendChild(
            this.createRectangle(
                this.plotScreenCoordinates.x1 - this.strokeWidth,
                this.plotScreenCoordinates.y1 - this.strokeWidth,
                this.plotScreenCoordinates.x2 - this.plotScreenDimensions.pad + this.strokeWidth,
                this.plotScreenCoordinates.y2 - this.plotScreenDimensions.pad + this.strokeWidth,
                'clip-rect'))
    }

    /**
     * Create plot group for path elements
     */
    createPlotGroup() {
        this.plot = this.appendNewElement(this.chart, 'g', { id: 'plot' }, SVGNS)
    }
    /**
     * Create zoom group for the zoom rectangle
     */
    createZoomGroup() {
        this.zoomRect = {
            group: this.appendNewElement(this.chart, 'g', { id: 'zoom-rect' }, SVGNS),
            rectangle: undefined,
            active: false,
            x1: 0,
            x2: 0,
            y1: 0,
            y2: 0
        }

        //temporary for debuging
        this.appendNewElement(this.zoomRect.group, 'g', { id: 'moose' }, SVGNS)
    }

    /**
     * Bind event handlers
     */
    bindEvents() {
        //resizing
        this.initializeResizeObserver();
        this.resizeObserver.observe(this.element);

        //mouse handlers
        window.onmousedown = this.handleClick.bind(this);
        // this.chart.onmousedown = this.handleClick.bind(this);
        //this.chart.onmouseup = this.handleMouseUp.bind(this);
        window.onmouseup = this.handleMouseUp.bind(this);
        window.onmousemove = this.handleMouseMove.bind(this);
        // this.chart.onmousemove = this.handleMouseMove.bind(this);
        // this.chart.onmouseleave = this.handleMouseLeave.bind(this);
        this.chart.ondblclick = this.handleDoubleClick.bind(this);
    }
    // #endregion

    // #region Chart Update Functions

    /**
     * Update the plot
     */
    updatePlot() {
        if (!this.hasData) return;
        this.updatePlotLimits();
        this.plot.innerHTML = ''
        let i = 0;
        this.data.forEach(e => {
            this.appendNewElement(this.plot, 'path', { d: this.pointsToSVGPath(e), 'clip-path': 'url(#plot-clip)', class: `plot${i++}` }, SVGNS)
        })
    }
    resetPlot() {
        console.log(this.plotRange);
        this.updatePlotLimits();
        this.plotRange = { ...this.plotLimits }
        console.log(this.plotRange);
    }
    resize() {
        this.updatePlotScreenDimensions();
        this.resizeChart();
        this.resizeClip();
        if (this.hasData) this.updatePlot();
        return true
    }

    updatePlotScreenDimensions() {
        this.plotScreenDimensions = {
            ...this.plotScreenDimensions,
            width: this.element.offsetWidth,
            height: this.element.offsetHeight,
        }
    }

    resizeChart() {
        this.chart.setAttribute('width', this.plotScreenDimensions.width)
        this.chart.setAttribute('height', this.plotScreenDimensions.height)
    }

    resizeClip() {
        this.clipRect.setAttribute('width', Math.max(0, this.plotScreenCoordinates.x2 - this.plotScreenDimensions.pad + this.strokeWidth))
        this.clipRect.setAttribute('height', Math.max(0, this.plotScreenCoordinates.y2 - this.plotScreenDimensions.pad + this.strokeWidth))
    }

    //#endregion

    // #region DOM utilities
    appendNewElement(parent, tagName, attributes, NS) {
        const child = NS ? document.createElementNS(NS, tagName) : document.createElement(tagName)
        Object.keys(attributes).forEach(key => {
            child.setAttribute(key, attributes[key])
        })
        parent.appendChild(child);
        return child;
    }
    createRectangle(x, y, width, height, id) {
        const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
        rect.setAttribute('x', x);
        rect.setAttribute('y', y);
        rect.setAttribute('width', width);
        rect.setAttribute('height', height);
        if (id) rect.setAttribute('id', id)
        return rect;
    }
    // #endregion

    // #region Plot Data Management
    /**
     * Add a plot to the chart
     * @param {Object} points - collection of xy data
     * @param {Array} points.x - list of x values
     * @param {Array} points.y - list of y values
     * @param {Object} options - display options for the plot
     */
    addPlot(points, options) {
        this.hasData = true;
        this.data = [...this.data, points];
    }

    /**
     * Gets the total data range of a point collection
     * @param {Object} points - collection of xy data
     * @param {Array} points.x - list of x values
     * @param {Array} points.y - list of y values
     * @returns {Object} Max and min values of x and y lists
     */
    getDataRange(points) {
        const x1 = Math.min(...points.x)
        const x2 = Math.max(...points.x)
        const y1 = Math.min(...points.y)
        const y2 = Math.max(...points.y)
        const range = { x1, x2, y1, y2 }
        return range
    }

    updatePlotLimits() {
        const plotLimits = this.data.reduce((acc, cur) => {
            const curRange = this.getDataRange(cur)
            const x1 = Math.min(acc.x1, curRange.x1)
            const x2 = Math.max(acc.x2, curRange.x2)
            const y1 = Math.min(acc.y1, curRange.y1)
            const y2 = Math.max(acc.y2, curRange.y2)
            return { x1, x2, y1, y2 }
        }, this.getDataRange(this.data[0]))
        this.plotLimits = { ...plotLimits }
    }

    // #endregion

    // #region Plot Data Scaling
    /**
     * Get screen coordinates for plot region
     */
    get plotScreenCoordinates() {
        return {
            x1: this.plotScreenDimensions.pad,
            x2: this.plotScreenDimensions.width - this.plotScreenDimensions.pad,
            y1: this.plotScreenDimensions.pad,
            y2: this.plotScreenDimensions.height - this.plotScreenDimensions.pad
        }
    }

    /**
     * Get SVG path command from points
     * @param {Object} points - collection of xy data
     * @param {number[]} points.x - list of x values
     * @param {number[]} points.y - list of y values
     * @returns
     */
    pointsToSVGPath(points) {
        const scaledPoints = this.scalePointsToScreen(points);
        const screenCoords = this.plotScreenCoordinates

        let prevInGraph = false, curInGraph, nextInGraph = true;

        let command, x, y, ny;

        //first point is an M
        let i = scaledPoints.x.findIndex(e => e >= 0);
        x = scaledPoints.x[i]
        let path = `M${scaledPoints.x[i]},${scaledPoints.y[i]}`;
        i++;

        while (i < scaledPoints.x.length && x <= screenCoords.x2 && x >= 0) {
            x = scaledPoints.x[i]
            y = scaledPoints.y[i]
            ny = scaledPoints.y[i + 1]

            curInGraph = this.pointInGraph(y)
            nextInGraph = this.pointInGraph(ny)

            command = this.getPathCommand(x, y, prevInGraph, curInGraph, nextInGraph)

            path += command;

            prevInGraph = curInGraph

            i++;
        }
        return path
    }

    /**
     * Scale array values to a new coordinate system
     * @param {Array} array - 1D array of values
     * @param {number} originalMin - Minimum value of the original scale
     * @param {number} originalMax - Maximum value of the original scale
     * @param {number} scaledMin - Minimum value of the target scale
     * @param {number} scaledMax - Maximum value of the target scale
     * @returns {Array} Array values scaled to the provided coordinate system
     */
    scaleArray(array, originalMin, originalMax, scaledMin, scaledMax) {
        return array.map(e => this.scalePoint(e, originalMin, originalMax, scaledMin, scaledMax))
    }
    scalePoint(point, originalMin, originalMax, scaledMin, scaledMax) {
        return (point - originalMin) * (scaledMax - scaledMin) / (originalMax - originalMin) + scaledMin
    }
    scaleRectange(rectangle, originalCoords, scaledCoords) {
        return {
            x1: this.scalePoint(rectangle.x1, originalCoords.x1, originalCoords.x2, scaledCoords.x1, scaledCoords.x2),
            x2: this.scalePoint(rectangle.x2, originalCoords.x1, originalCoords.x2, scaledCoords.x1, scaledCoords.x2),
            y1: this.scalePoint(rectangle.y2, originalCoords.y2, originalCoords.y1, scaledCoords.y1, scaledCoords.y2),
            y2: this.scalePoint(rectangle.y1, originalCoords.y2, originalCoords.y1, scaledCoords.y1, scaledCoords.y2),
        }
    }
    /**
     * Scale points object to SVG screen coordinates
     * @param {Object} points - collection of xy data
     * @param {number[]} points.x - list of x values
     * @param {number[]} points.y - list of y values
     * @returns {Object} Scaled Points
     */
    scalePointsToScreen(points) {
        const screenCoords = this.plotScreenCoordinates

        const scaleX = this.scaleArray(points.x, this.plotRange.x1, this.plotRange.x2, screenCoords.x1, screenCoords.x2);
        const scaleY = this.scaleArray(points.y, this.plotRange.y1, this.plotRange.y2, screenCoords.y2, screenCoords.y1);

        return { x: scaleX, y: scaleY }
    }
    sortCoords({ x1, x2, y1, y2 }) {
        return {
            x1: Math.min(x1, x2),
            x2: Math.max(x1, x2),
            y1: Math.min(y1, y2),
            y2: Math.max(y1, y2)
        }
    }
    //#endregion

    // #region SVG Utilities
    /**
     * Check if a y point is within the vertical scale of the plot
     * @param {number} y Value
     * @returns {boolean} Point is in graph?
     */
    pointInGraph(y) {
        return !(
            y < 0 ||
            y > this.plotScreenCoordinates.y2
        )
    }

    /**
     * Gives a path command string based on surrounding points visibility in the plot
     * @param {number} x x-coordinate
     * @param {number} y y-coordinate
     * @param {boolean} prevInGraph Previous point was displayed
     * @param {boolean} curInGraph Current point should be displayed
     * @param {boolean} nextInGraph Next point will be displayed
     * @returns {string} Path command
     */
    getPathCommand(x, y, prevInGraph, curInGraph, nextInGraph) {
        if (!curInGraph && nextInGraph) return `M${x},${y}`
        if (curInGraph || prevInGraph || nextInGraph) return `L${x},${y}`
        return ``
    }

    /**
     * Converts x and y lists to an SVG path element string
     * @param {Object} points - collection of xy data
     * @param {Array} points.x - list of x values
     * @param {Array} points.y - list of y values
     * @returns {String} Path element string
     */
    getPathString(points) {
        return `
        <path
            d = ${this.pointsToSVGPath(points)}
            clip-path="url(#plot-clip)"
        />`
    }
    //#endregion

    // #region Zoom Rectangle Handling
    updateZoomRectangle() {
        console.log(this.zoomRect.rectangle);
        const x = Math.min(this.zoomRect.x1, this.zoomRect.x2);
        const y = Math.min(this.zoomRect.y1, this.zoomRect.y2);
        const width = Math.abs(this.zoomRect.x2 - this.zoomRect.x1)
        const height = Math.abs(this.zoomRect.y2 - this.zoomRect.y1)
        this.zoomRect.rectangle.setAttribute('width', width)
        this.zoomRect.rectangle.setAttribute('height', height)
        this.zoomRect.rectangle.setAttribute('x', x)
        this.zoomRect.rectangle.setAttribute('y', y)
    }
    // #endregion

    // #region Events
    initializeResizeObserver() {
        this.resizeObserver = new ResizeObserver((entries) => {
            for (const entry of entries) {
                if (!entry.contentBoxSize) return
                this.resize();
            };
        })
    }

    handleClick(e) {
        if (this.chart.contains(e.target)) {
            console.log(e.offsetX)
            console.log('in chart');
            const loc = { x: e.offsetX, y: e.offsetY }

            this.zoomRect.active = true;
            this.zoomRect.x1 = this.zoomRect.x2 = loc.x;
            this.zoomRect.y1 = this.zoomRect.y2 = loc.y;
            this.zoomRect.rectangle = this.zoomRect.group.appendChild(this.createRectangle(loc.x, loc.y, 0, 0))
            this.zoomRect.rectangle.setAttribute('id', 'rect')
        }
    }

    handleMouseMove(e) {

        //get relative position to the div
        const relX = e.clientX - this.element.getBoundingClientRect().left;
        const relY = e.clientY - this.element.getBoundingClientRect().top;

        e.preventDefault()
        if (this.zoomRect.active) {
            const { pad, width, height } = this.plotScreenDimensions
            this.zoomRect.x2 = clamp(relX, pad, width - pad) //Math.max(pad, Math.min(e.offsetX, width - pad))
            this.zoomRect.y2 = clamp(relY, pad, height - pad) //Math.max(pad, Math.min(e.offsetY, height - pad))
            this.updateZoomRectangle();
        }

    }

    handleMouseLeave(e) {
        e.preventDefault()
        if (this.zoomRect.active) {
            this.zoomRect.rectangle.remove();
            this.zoomRect.active = false;
        }
    }

    handleMouseUp(e) {
        // if (!this.chart.contains(e.target)) return

        e.preventDefault()

        const width = Number(this.zoomRect.rectangle.getAttribute('width'))
        const height = Number(this.zoomRect.rectangle.getAttribute('height'))
        console.log(width, height);
        this.zoomRect.rectangle.remove()

        if (width === 0 || height === 0) {
            this.zoomRect.active = false;
            return;
        }


        if (this.zoomRect.active) {
            this.zoomRect.active = false;
            
            const screenCoords = this.plotScreenCoordinates
            const sortedCoords = this.sortCoords(this.zoomRect)

            const scaledZoom = this.scaleRectange(sortedCoords, screenCoords, this.plotRange)

            this.plotRange = { ...scaledZoom }
            this.updatePlot();
        }
    }

    handleDoubleClick(e) {
        e.preventDefault();
        this.plotRange = { ...this.plotLimits }
        this.updatePlot();
    }
    // #endregion
}


export default Chart;
