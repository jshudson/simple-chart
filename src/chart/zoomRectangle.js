import * as svg from '../svgUtils/svgUtils.js'

export default class ZoomRectangle {
    /**
     * @param {SVGElement} parent
     */
    constructor(parent) {
        this.parent = parent
        /**@type Rectangle */
        this.rectangle = {
            x: [0, 0],
            y: [0, 0]
        }
        /**@type Point */
        this.firstPoint = {
            x: 0,
            y: 0
        }
        this.element = undefined
        this.enabled = false
    }
    get active() {
        return this.enabled
    }
    get coordinates() {
        return this.rectangle
    }
    /**
     * 
     * @param {Point} point 
     */
    activate(point, plotDimensions) {
        this.rectLimits = { ...plotDimensions }
        this.enabled = true;
        this.firstPoint = { ...point }
        this.rectangle = {
            x: [point.x, point.x],
            y: [point.y, point.y]
        }
        this.render()
    }
    /**
     * 
     * @param {Point} point 
     */
    update(point) {
        this.rectangle = {
            x: [
                Math.max(this.rectLimits.left, Math.min(this.firstPoint.x, point.x)),
                Math.min(this.rectLimits.width + this.rectLimits.left, Math.max(this.firstPoint.x, point.x))
            ],
            y: [
                Math.max(this.rectLimits.top, Math.min(this.firstPoint.y, point.y)),
                Math.min(this.rectLimits.height + this.rectLimits.top, Math.max(this.firstPoint.y, point.y))
            ]
        }
        this.render()
    }

    deactivate() {
        if (this.element) this.element.remove()
        this.enabled = false
    }
    render() {
        if (this.element) this.element.remove()
        this.element = this.parent.appendChild(svg.rect(
            this.rectangle.x[0],
            this.rectangle.y[0],
            this.rectangle.x[1] - this.rectangle.x[0],
            this.rectangle.y[1] - this.rectangle.y[0],
            { class: 'zoom' }
        ))
    }
}