import Plot from './plot.js'
import * as svg from '../svgUtils/svgUtils.js'
import Axis from './axis.js'
class Chart {
    constructor(id, parent, options) {
        this.id = id

        //parent is a div
        this.parent = parent
        this.width = parent.offsetWidth
        this.height = parent.offsetHeight

        //chart is the root SVG element
        this.chart = this.parent.appendChild(
            svg.newElement('svg', {
                id: this.id,
                width: this.width,
                height: this.height
            })
        )
        this.data = { ...options.data }
        this.limits = {
            x: [this.data[0].x[0], this.data[0].x[this.data[0].x.length - 1]],
            y: [Math.min(...this.data[0].y), Math.max(...this.data[0].y)]
        }
        this.limits = {
            x: [-15,10],
            y: [-0.2,14]
        }

        this.pad = {
            top: 10,
            right: 10,
            bottom: 10,
            left: 0,
        }

        this.axes = {
            x: new Axis(
                this.chart,
                this.id,
                'x',
                {
                    range: this.limits.x,
                    label: 'Time[min]',
                    format: 'standard'
                }
            ),
            y: new Axis(
                this.chart,
                this.id,
                'y',
                {
                    range: this.limits.y,
                    label: 'Moose Cakes Are Awful',
                    format: 'scientific'
                }
            )
        }
        console.time('draw')
        const xDimension = this.axes.x.getDimension()
        const yDimension = this.axes.y.getDimension()
        const plotDimensions = {
            top: this.pad.top,
            left: this.pad.left + yDimension,
            width: this.width - this.pad.left - yDimension - this.pad.right,
            height: this.height - this.pad.top - xDimension - this.pad.bottom
        }

        this.plot = new Plot(
            this.chart,
            this.data[0],
            this.id + 'plot',
            {
                limits: this.limits,
                ...plotDimensions
            }
        )

        this.axes.x.redrawAxis(plotDimensions)
        this.axes.y.redrawAxis(plotDimensions)
        console.timeEnd('draw')
    }
    addAxis(direction) {
        if (direction = 'x') {

        }
    }
    moveAxis(direction, offset) {
        this.xAxis
    }
    update() {
    }
}

export default Chart
