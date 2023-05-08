const SVGNS = 'http://www.w3.org/2000/svg';
import { clamp, appendNewElement } from '../utils/utils.js';
import * as svg from '../svgUtils/svgUtils.js';
import defaultState from './defaultState.js';
import _ from 'lodash'

console.log(_.clamp(10,0,5))
class Chart {

    /**
     * Constructor
     * @param {element} parent HTML element that will host the chart.
     * @param {object} options list of options for the chart.
     */
    constructor(parent, options) {

        this.setState(defaultState);
        this.setState({ parent, id: 'testing' })

        this.copyParentDimensions();
        this.buildChart();
        console.log(this.state);
    }
    setState(newState) {
        console.log('current state', this.state);
        console.log(newState);
        this.state = {
            ...this.state,
            ...newState
        }
    }
    copyParentDimensions() {
        const parent = this.state.parent;
        this.setState({
            chart: {
                width: parent.offsetWidth - 10, height: parent.offsetHeight - 10
            }
        })
    }

    // #region Generate SVG Elements
    buildChart() {
        this.addChartRoot();
        this.addTitle();
        // this.addBorder();
        // this.addLegend();
        this.addAxes();
        // this.addPlotArea();
        // this.addInterative();
    }

    addChartRoot() {
        const chart = this.state.chart;
        const element = this.state.parent.appendChild(
            svg.newSVGElement('svg', {
                id: this.state.id + '-chart',
                width: chart.width,
                height: chart.height
            })
        )
        this.setState({
            chart: {
                e: element
            }
        })
    }

    addTitle() {
        const chartElement = this.state.chart.e;
        const element = chartElement.appendChild(
            svg.newSVGElement('text', {
                id: this.state.id + '-title',
                y: 35
            })
        )

        element.innerHTML = "test"

        this.setState({
            chart: {
                title: {
                    e: element
                }
            }
        })
    }

    addAxes() {
        const chartElement = this.state.chart.e;
        console.log(this.state.chart.e)
        const element = chartElement.appendChild(
            svg.newSVGElement('g', {
                id: `${this.state.id}-axes`
            })
        )

        this.setState({
            chart: {
                axes: {
                    e: element
                }
            }
        })

        this.addAxis('x');
        this.addAxis('y');
    }

    addAxis(direction) {
        const chartElement = this.state.chart.e;
        const element = chartElement.appendChild(
            svg.newSVGElement('g', {
                id: `${this.state.id}-${direction}-axis`
            })
        )
        this.setState({
            chart: {
                axes: {
                    [`${direction}Axis`]: element
                }
            }
        })

    }


    /**
     * Create clip rectangle for constraining plots
     */
    createClipPath() {
        this.plotClip = appendNewElement(this.chart, 'clipPath', { id: 'plot-clip' }, SVGNS)

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
        this.plot = appendNewElement(this.chart, 'g', { id: 'plot' }, SVGNS)
    }
    /**
     * Create zoom group for the zoom rectangle
     */
    createZoomGroup() {
        this.zoomRect = {
            group: appendNewElement(this.chart, 'g', { id: 'zoom-rect' }, SVGNS),
            rectangle: undefined,
            active: false,
            x1: 0,
            x2: 0,
            y1: 0,
            y2: 0
        }

        //temporary for debuging
        appendNewElement(this.zoomRect.group, 'g', { id: 'temp' }, SVGNS)
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
        window.onmouseup = this.handleMouseUp.bind(this);
        window.onmousemove = this.handleMouseMove.bind(this);
        this.chart.ondblclick = this.handleDoubleClick.bind(this);

    }
    // #endregion

    // #region Chart Update Functions

    /**
     * Update the plot
     */
    updatePlot() {
        if (!this.hasData) return;
        // this.updatePlotLimits();
        this.plot.innerHTML = ''
        let i = 0;
        this.data.forEach(e => {
            appendNewElement(this.plot, 'path', { d: this.pointsToSVGPath(e), 'clip-path': 'url(plot-clip)', class: `plot${i++}` }, SVGNS)
        })
        console.log('drawing plot');
    }
    resetPlot() {
        this.updatePlotLimits();
        this.plotRange = [{ ...this.plotLimits }]
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
     * Get screen coordinates for plot #region
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

        // let prevInGraph = false, curInGraph, nextInGraph = true;


        let x, y //, ny;
        let i = Math.max(scaledPoints.x.findIndex(e => e >= 0) - 1, 0); //goes to point offscreen to the left
        x = scaledPoints.x[i]

        //first point is an M
        let path = `M${x},${scaledPoints.y[i]}`;
        i++;

        while (i < scaledPoints.x.length && x <= screenCoords.x2) { //<= is offscreen to right
            x = scaledPoints.x[i]
            y = scaledPoints.y[i]
            // ny = scaledPoints.y[i + 1]
            // curInGraph = this.pointInGraph(y)
            // nextInGraph = this.pointInGraph(ny)
            path += `L${x},${y}` //this.getPathCommand(x, y, prevInGraph, curInGraph, nextInGraph)
            // prevInGraph = curInGraph
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
        const { x1: sx1, x2: sx2, y1: sy1, y2: sy2 } = this.plotScreenCoordinates
        const { x1: px1, x2: px2, y1: py1, y2: py2 } = this.plotRange.at(-1);
        const scaleX = this.scaleArray(points.x, px1, px2, sx1, sx2);
        const scaleY = this.scaleArray(points.y, py1, py2, sy2, sy1);

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
            clip-path="url(plot-clip)"
        />`
    }
    //#endregion

    // #region Zoom Rectangle Handling
    updateZoomRectangle() {
        // console.log(this.zoomRect.rectangle);
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
            // console.log(e.offsetX)
            // console.log('in chart');
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

        e.preventDefault()

        if (!this.zoomRect.active) return

        this.zoomRect.active = false;

        const width = Number(this.zoomRect.rectangle.getAttribute('width'))
        const height = Number(this.zoomRect.rectangle.getAttribute('height'))

        this.zoomRect.rectangle.remove()

        if (width === 0 || height === 0) return;

        const screenCoords = this.plotScreenCoordinates
        const sortedCoords = this.sortCoords(this.zoomRect)

        const scaledZoom = this.scaleRectange(sortedCoords, screenCoords, this.plotRange.at(-1))

        this.plotRange.push({ ...scaledZoom });
        this.updatePlot();

    }

    handleDoubleClick(e) {
        console.log('double clicking');
        e.preventDefault();

        console.log(this.plotRange);
        if (this.plotRange.length <= 1 || e.shiftKey) {
            this.resetPlot();
        } else {
            this.plotRange.pop();
        }
        this.updatePlot();
    }
    // #endregion
}


export default Chart;
