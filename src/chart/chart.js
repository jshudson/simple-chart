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
                    label: 'mAU',
                    format: 'scientific'
                }
            )
        }
        console.time('draw')
        const xDimension = this.axes.x.getDimension(this.limits.x)
        const yDimension = this.axes.y.getDimension(this.limits.y)
        const plotDimensions = {
            top: this.pad.top,
            left: this.pad.left + yDimension,
            width: this.width - this.pad.left - yDimension - this.pad.right,
            height: this.height - this.pad.top - xDimension - this.pad.bottom
        }

        this.plot = new Plot(
            this.chart,
            this.id + 'plot',
        )
        this.plot.redraw(this.limits,plotDimensions,this.data[0])
        this.axes.x.redrawAxis(plotDimensions,this.limits.x)
        this.axes.y.redrawAxis(plotDimensions,this.limits.y)
        console.timeEnd('draw')
        setTimeout(()=>{
            this.limits = {
                x: [-1,10],
                y: [-0.2,125]
            }
            this.plot.redraw(this.limits,plotDimensions,this.data[0])
            this.axes.x.redrawAxis(plotDimensions,this.limits.x)
            this.axes.y.redrawAxis(plotDimensions,this.limits.y)
        },1000)

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
