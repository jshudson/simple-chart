import Plot from './plot.js'
import * as svg from '../svgUtils/svgUtils.js'

class Chart {
    constructor(id, parent, options) {
        this.id = id
        this.width = parent.offsetWidth
        this.height = parent.offsetHeight

        //parent is a div
        this.parent = parent

        //chart is the root SVG element
        this.chart = this.parent.appendChild(
            svg.newElement('svg', {
                id: this.id,
                width: this.width,
                height: this.height
            })
        )
        this.data = { ...options.data }
    
        this.plot = new Plot(
            this.chart,
            this.data[0],
            this.id + 'plot',
            {
                limits: {
                    x: [this.data[0].x[0], this.data[0].x[this.data[0].x.length - 1]],
                    y: [Math.min(...this.data[0].y), Math.max(...this.data[0].y)]
                },
                top: 10,
                left: 40,
                width: this.width-60,
                height: this.height-40
            }
        )
    }
}

export default Chart
