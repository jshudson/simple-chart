const SVGNS = 'http://www.w3.org/2000/svg'
class Chart {
    constructor(div) {

        this.element = div

        this.plotRange = {
            x1: 0,
            x2: 6,
            y1: -3,
            y2: 20
        }

        this.plotScreenDimensions = {
            pad: 10,
            width: this.element.offsetWidth,
            height: this.element.offsetHeight,
        }

        this.data = [];
        this.strokeWidth = 3;

        this.initializeResizeObserver();
        this.resizeObserver.observe(this.element);

        this.chart = this.element.appendChild(document.createElementNS(SVGNS, 'svg'));
        this.chart.setAttribute('width', this.plotScreenDimensions.width)
        this.chart.setAttribute('height', this.plotScreenDimensions.height)

        this.plotClip = this.appendNewElement(this.chart, 'clipPath', { id: 'plot-clip' }, SVGNS)

        this.clipRect = this.plotClip.appendChild(
            this.createRectangle(
                this.plotScreenCoordinates.x1 - this.strokeWidth,
                this.plotScreenCoordinates.y1 - this.strokeWidth,
                this.plotScreenCoordinates.x2 - this.plotScreenDimensions.pad + this.strokeWidth,
                this.plotScreenCoordinates.y2 - this.plotScreenDimensions.pad + this.strokeWidth,
                'clip-rect'))

        this.plot = this.appendNewElement(this.chart, 'g', { id: 'plot' }, SVGNS)

        this.zoomRect = {
            group: this.appendNewElement(this.chart, 'g', { id: 'zoom-rect' }, SVGNS),
            rectangle: undefined,
            active: false,
            x1: 0,
            x2: 0,
            y1: 0,
            y2: 0
        }

        this.appendNewElement(this.zoomRect.group, 'g', { id: 'moose' }, SVGNS)

        //event handlers
        this.chart.onmousedown = this.handleClick.bind(this);
        this.chart.onmouseup = this.handleMouseUp.bind(this);
        this.chart.onmousemove = this.handleMouseMove.bind(this);
        this.chart.onmouseleave = this.handleMouseLeave.bind(this);
        this.chart.ondblclick = this.handleDoubleClick.bind(this);
    }

    // #region Chart Update Functions

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

    /**
     * Update the plot
     */
    updatePlot() {
        if (!this.hasData) return;
        // this.plotRange = this.getDataRange(this.data[0]);
        this.plot.innerHTML = this.getPathString(this.data[0]);
    }
    //#endregion

    // #region DOM utilities
    appendNewElement(parent, tagName, attributes, NS) {
        const child = NS ? document.createElementNS(NS, tagName) : document.createElement(tagName)
        console.log(child);
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
        console.log(this.data);
        console.log(this.getDataRange(this.data[0]));
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
        const limits = { x1, x2, y1, y2 }
        return limits
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
        const width = Math.abs(this.zoomRect.x2 - this.zoomRect.x1)
        const height = Math.abs(this.zoomRect.y2 - this.zoomRect.y1)
        const x = Math.min(this.zoomRect.x1, this.zoomRect.x2);
        const y = Math.min(this.zoomRect.y1, this.zoomRect.y2);
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
        const loc = { x: e.offsetX, y: e.offsetY }

        this.zoomRect.active = true;
        this.zoomRect.x1 = this.zoomRect.x2 = loc.x;
        this.zoomRect.y1 = this.zoomRect.y2 = loc.y;
        this.zoomRect.rectangle = this.zoomRect.group.appendChild(this.createRectangle(loc.x, loc.y, 0, 0))
        this.zoomRect.rectangle.setAttribute('id', 'rect')
    }

    handleMouseMove(e) {
        e.preventDefault()
        if (this.zoomRect.active) {
            this.zoomRect.x2 = e.offsetX
            this.zoomRect.y2 = e.offsetY
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
        e.preventDefault()

        const width = Number(this.zoomRect.rectangle.getAttribute('width'))
        const height = Number(this.zoomRect.rectangle.getAttribute('height'))
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
        this.plotRange = this.getDataRange(this.data[0]);
        this.updatePlot();
    }
    // #endregion
}


export default Chart;
