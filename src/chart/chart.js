
import * as svg from '../svgUtils/svgUtils.js'
import Plot from './plot.js'
import Axis from './axis.js'
import ZoomRectangle from './zoomRectangle.js'

import * as xform from './coordinateTransfer.js';

const DEFAULT_OPTIONS = {
    data: { x: [], y: [] },
    limits: { x: [0, 0], y: [] },
    pad: { top: 10, right: 10, bottom: 10, left: 0 }
}

const ZOOM_FACTOR = 1.5

class Chart {
    /**
     *
     * @param {String} id
     * @param {HTMLElement} parent
     * @param {Object} options
     */
    constructor(id, parent, options) {
        this.handleClick = this.handleClick.bind(this)
        this.id = id

        this.parent = parent
        this.width = parent.offsetWidth
        this.height = parent.offsetHeight

        /**@type {SVGGraphicsElement} */
        this.chart = this.parent.appendChild(
            svg.newElement('svg', {
                id: this.id,
                width: this.width,
                height: this.height,
                'pointer-events': 'bounding-box',
                xmlns: 'http://www.w3.org/2000/svg'
            })
        )

        this.chart.onmousedown = this.handleMouseDown.bind(this)
        this.chart.onmousemove = this.handleMouseMove.bind(this)
        this.chart.onmouseleave = this.handleMouseLeave.bind(this)
        this.chart.ondblclick = this.handleDoubleClick.bind(this)
        this.chart.onwheel = this.handleWheel.bind(this)

        this.handleMouseUp = this.handleMouseUp.bind(this)

        if (options?.data) {
            this.data = { ...options.data }
            /**@type Rectangle */
            this.limits = {
                x: [this.data[0].x[0], this.data[0].x[this.data[0].x.length - 1]],
                y: [Math.min(...this.data[0].y), Math.max(...this.data[0].y)]
            }
        }
        else {
            this.data = { x: [], y: [] }
            this.limits = { x: [0, 0], y: [0, 0] }
        }

        this.pad = {
            top: 20,
            right: 20,
            bottom: 10,
            left: 0,
        }

        this.axes = {
            x: new Axis(
                this.chart,
                this.id,
                'x',
                {
                    label: 'Time[min]',
                    format: 'standard'
                }
            ),
            y: new Axis(
                this.chart,
                this.id,
                'y',
                {
                    label: 'mAU',
                    format: 'scientific'
                }
            )
        }
        this.plot = new Plot(
            this.chart,
            this.id + 'plot',
        )
        this.integrals = []
        this.zoomRectangle = new ZoomRectangle(this.chart)
        this.render();
        this.interactionMode = 'zoom';
    }
    setMode(mode) {
        this.interactionMode = mode
    }
    resetLimits() {
        this.limits = {
            x: [this.data[0].x[0], this.data[0].x[this.data[0].x.length - 1]],
            y: [Math.min(...this.data[0].y), Math.max(...this.data[0].y)]
        }
    }
    handleDoubleClick(event) {
        this.resetLimits()
        this.render()
    }
    /**
     *
     * @param {PointerEvent} event
     */
    handleMouseDown(event) {
        event.preventDefault()
        //@ts-ignore
        if (this.axes.x.boundary.contains(event.target)) { this.handleMouseDown_Axis(event, 'x') }
        switch (this.interactionMode) {
            case 'zoom':
                this.handleMouseDown_Zoom(event)
                return;
            case 'integrate':
                this.handleMouseDown_Integrate(event)
                return;
            default:
                return;
        }
    }
    handleMouseDown_Axis(event, direction) {
        console.log(this.getMouseEventAxisCoordinate1D(event))
    }
    /**
     * 
     * @param {PointerEvent} event 
     */
    handleMouseDown_Zoom(event) {
        /**@type Point */
        const point = { x: event.offsetX, y: event.offsetY }
        if (this.plot.element().contains(event.target)) {
            this.zoomRectangle.activate(point, this.plotDimensions)

            document.addEventListener(
                "mouseup",
                this.handleMouseUp_Zoom.bind(this),
                { once: true }
            );
        }
    }
    handleMouseDown_Integrate(event) {
        console.log(this)
        console.log(event)
        console.log(event.offsetX, event.offsetY);
        const click = xform.transform2D(
            { x: event.offsetX - this.plotDimensions.left, y: event.offsetY - this.plotDimensions.top },
            { x: [0, this.plotDimensions.width], y: [this.plotDimensions.height, 0] },
            this.limits
        )
        this.integrals.push({ x: [click.x, click.x + 0.5], y: [click.y, click.y + 1] })
        this.render()
    }
    handleMouseMove(event) {
        event.preventDefault()
        switch (this.interactionMode) {
            case 'zoom':
                this.handleMouseMove_Zoom(event)
                return;
            case 'integrate':
                //this.handleMouseDown_Integrate(event)
                return;
            default:
                return;
        }
    }
    handleMouseMove_Zoom(event) {
        /**@type Point */
        const point = { x: event.offsetX, y: event.offsetY }
        if (this.zoomRectangle.active) {
            this.zoomRectangle.update(point)
        }
    }
    handleMouseUp(event) {
        event.preventDefault()
    }
    handleMouseUp_Zoom() {
        if (this.zoomRectangle.active) {
            const zoomCoords = this.zoomRectangle.coordinates
            if (zoomCoords.x[0] == zoomCoords.x[1] && zoomCoords.y[0] == zoomCoords.y[1]) {
                this.zoomRectangle.deactivate()
                return

            }
            const rectPlotCoords = {
                x: [
                    zoomCoords.x[0] - this.plotDimensions.left,
                    zoomCoords.x[1] - this.plotDimensions.left,
                ],
                y: [
                    zoomCoords.y[0] - this.plotDimensions.top,
                    zoomCoords.y[1] - this.plotDimensions.top,
                ]
            }
            const newLimits = xform.transformXYObj(rectPlotCoords,
                { x: [0, this.plotDimensions.width], y: [this.plotDimensions.height, 0] },
                this.limits,
            )
            newLimits.y = newLimits.y.toSorted((a, b) => a - b)
            this.limits = { ...newLimits }
            this.zoomRectangle.deactivate();
            this.render()
        }

    }
    /**
     * 
     * @param {PointerEvent} event 
     */
    handleMouseLeave(event) {
        switch (this.interactionMode) {
            case 'zoom':
                this.handleMouseLeave_Zoom(event)
                return;
            case 'integrate':
                //this.handleMouseDown_Integrate(event)
                return;
            default:
                return;
        }
    }
    /**
     * 
     * @param {PointerEvent} event 
     */
    handleMouseLeave_Zoom(event) {
        /**@type Point */
        const point = { x: event.offsetX, y: event.offsetY }
        if (this.zoomRectangle.active) {
            this.zoomRectangle.update(point)
        }
    }
    handleWheel(event) {
        event.preventDefault()
        this.handleWheel_Axis(event)
    }
    /**
     * 
     * @param {PointerEvent} event
     * @returns {Object}
     */
    getMouseEventAxisCoordinate1D(event) {
        let axis = ''
        //@ts-ignore
        if (this.axes.x.boundary.contains(event.target)) { axis = 'x' }
        //@ts-ignore
        if (this.axes.y.boundary.contains(event.target)) { axis = 'y' }
        if (!axis) return undefined

        const offsetPlotCoords = {
            x: event.offsetX - this.plotDimensions.left,
            y: event.offsetY - this.plotDimensions.top,
        }

        const source = []
        if (axis == 'x') {
            source[0] = 0
            source[1] = this.plotDimensions.width
        }
        if (axis == 'y') {
            source[0] = this.plotDimensions.height
            source[1] = 0
        }

        return {
            axis,
            coordinate: xform.transform1D(offsetPlotCoords[axis], source[0], source[1], this.limits[axis][0], this.limits[axis][1])
        }
    }
    getMouseEventPlotCoorinate(event){
        const offsetPlotCoords = {
            x: event.offsetX - this.plotDimensions.left,
            y: event.offsetY - this.plotDimensions.top,
        }

        const source = []
        if (axis == 'x') {
            source[0] = 0
            source[1] = this.plotDimensions.width
        }
        if (axis == 'y') {
            source[0] = this.plotDimensions.height
            source[1] = 0
        }

        return {
            axis,
            coordinate: xform.transform1D(offsetPlotCoords[axis], source[0], source[1], this.limits[axis][0], this.limits[axis][1])
        }
    }
    handleWheel_Axis(event) {

        const scrollDirection = Math.sign(event.deltaY)

        const axisPlotCoord = this.getMouseEventAxisCoordinate1D(event)
        if(!(axisPlotCoord?.axis)) return
        console.log('past')
        const scrollFactor = scrollDirection < 0 ? ZOOM_FACTOR : 1 / ZOOM_FACTOR

        const newCoords = [
            (this.limits[axisPlotCoord.axis][0] - axisPlotCoord.coordinate * (1 - scrollFactor)) / scrollFactor,
            (this.limits[axisPlotCoord.axis][1] - axisPlotCoord.coordinate * (1 - scrollFactor)) / scrollFactor
        ]
        this.limits[axisPlotCoord.axis] = [...newCoords]
        this.render()
    }
    /**
     *
     * @param {PointerEvent} event
     */
    handleClick(event) {

    }

    /**
     * Render the Chart
     */
    render() {
        console.time('render')
        const xAxisPad = this.axes.x.getDimension(this.limits.x)
        const yAxisPad = this.axes.y.getDimension(this.limits.y)
        this.plotDimensions = {
            top: this.pad.top,
            left: this.pad.left + yAxisPad,
            width: this.width - this.pad.left - yAxisPad - this.pad.right,
            height: this.height - this.pad.top - xAxisPad - this.pad.bottom
        }
        this.plot.render(this.limits, this.plotDimensions, this.data[0], this.integrals)
        this.axes.x.render(this.plotDimensions, this.limits.x)
        this.axes.y.render(this.plotDimensions, this.limits.y)
        console.timeEnd('render')
    }
    /**
     * Save the SVG Plot
     * @param {*} svgEl
     * @param {*} name
     */
    saveSvg(svgEl, name) {
        var svgData = svgEl.outerHTML;
        var preface = '<?xml version="1.0" standalone="no"?>\r\n';
        var svgBlob = new Blob([preface, svgData], { type: "image/svg+xml;charset=utf-8" });
        var svgUrl = URL.createObjectURL(svgBlob);
        var downloadLink = document.createElement("a");
        downloadLink.href = svgUrl;
        downloadLink.download = name;
        document.body.appendChild(downloadLink);
        downloadLink.click();
        document.body.removeChild(downloadLink);
    }
    /**
     *
     * @param {*} callback
     */
    bindEvent(callback) {
        this.chart.onclick = callback
    }
}

export default Chart
