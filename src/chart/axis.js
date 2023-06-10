import * as svg from '../svgUtils/svgUtils.js';

class Axis {
    constructor(parent, id, offset,  options) {
        this.parent = parent
        this.offset = offset

        this.range = options.range
        this.group = this.parent.appendChild(svg.newElement('g', {
            transform: `translate(0,${this.offset.y})`
        }))
        this.ticks = {
            targetCount: 7,
            labels: {
                enable: true,
                values: []
            }
        }
        this.format = 'standard'
        this.buildAxis()

    }
    buildAxis() {
        this.group.appendChild(svg.newElement('line', {
            x1:this.offset.x,
            y1:0,
            x2:this.offset.x+100,
            y2:0,
            stroke: 'black'
        }))
    }

    findInterval(value) {
        const exponent = Math.floor(Math.log10(value));
        const mantissa = value / (10 ** exponent)

        const orders = [1, 2, 2.5, 5];

        const order = this.findNearestIndexSorted(mantissa, orders)

        return order * 10 ** exponent
    }

    findNearestIndexSorted(value, array) {
        //only use for small arrays!  I'm lazy
        let difference = Math.abs(value - array[0]);
        let index = 0
        for (let i = 1; i < array.length; i++) {
            let newDiff = Math.abs(value - array[i])
            if (newDiff < difference) {
                difference = newDiff
                index = i;
            }
        }
        return index;
    }

}

export default Axis;