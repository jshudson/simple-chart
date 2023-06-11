import * as svg from '../svgUtils/svgUtils.js';
import * as xform from './coordinateTransfer.js';

class Axis {
    constructor(parent, id, direction, plotDimensions, options) {
        this.parent = parent;
        this.direction = direction;
        if (this.direction = 'x') {
            this.axisCoords = {
                x: [plotDimensions.x[0], plotDimensions.x[1] + plotDimensions.x[0]],
                y: [plotDimensions.y[0] + plotDimensions.y[1], plotDimensions.y[0] + plotDimensions.y[1]]
            }
        } else {
            this.axisCoords = {
                x: [plotDimensions.x[0], plotDimensions.x[0]],
                y: [plotDimensions.y[0], plotDimensions.y[1]]
            }
        }
        this.range = options.range;

        this.group = this.parent.appendChild(svg.newElement('g', {
            transform: `translate(0,${this.axisCoords.y[0]})`
        }))
        this.ticks = {
            targetCount: 7,
        }
        this.format = 'standard'
        this.buildAxis()

    }
    buildAxis() {
        this.line = this.group.appendChild(svg.newElement('line', {
            x1: this.axisCoords.x[0],
            y1: 0,
            x2: this.axisCoords.x[1],
            y2: 0,
            stroke: 'black'
        }));
        this.addTicks();
    }
    addTicks() {
        const range = this.range[1] - this.range[0];
        console.log(range);
        const fullInterval = range / this.ticks.targetCount;
        console.log(fullInterval);
        const targetInterval = this.findInterval(fullInterval);
        console.log(targetInterval);
        const firstTick = this.findFirstTick(this.range[0], targetInterval.interval);
        const tickCount = Math.ceil((this.range[1] - firstTick) / targetInterval.interval)
        const values = Array.from({ length: tickCount }, (e, i) => i * targetInterval.interval + firstTick)
        const coords = xform.transform1DArray(values, this.range[0], this.range[1], this.axisCoords.x[0], this.axisCoords.x[1])
        const ticks = this.group.appendChild(svg.newElement('g', {}))
        const label = this.group.appendChild(svg.newElement('text', {
            'text-anchor': 'end',
            'dominant-baseline': 'hanging',
            x: this.axisCoords.x[1],
            y: 10
        }))
        label.innerHTML = 'Time[min]'
        const labelLeft = label.getBBox().x
        values.forEach((e, i) => {

            ticks.appendChild(svg.newElement('line', {
                x1: coords[i],
                x2: coords[i],
                y1: 0,
                y2: 5,
                stroke: 'black'

            }))
            const newLabel = this.group.appendChild(svg.newElement('text', {
                x: coords[i],
                y: 10,
                'text-anchor': 'middle',
                'dominant-baseline': 'hanging'
            }))
            newLabel.innerHTML = e.toFixed(targetInterval.digits)
            const labelBox = newLabel.getBBox();
            if(labelBox.x+labelBox.width >= labelLeft){
                newLabel.remove()
            }
        })
        console.log(ticks.getBBox().width)
    }

    findInterval(value) {
        const exponent = Math.floor(Math.log10(value));
        const mantissa = value / (10 ** exponent);

        const orders = [1, 2, 2.5, 5];
        console.log(mantissa)
        const order = orders[this.findNearestIndexSorted(mantissa, orders)];
        console.log(order)
        const digits = exponent < 0 ? (Math.abs(exponent) + (order == 2.5 ? 1 : 0)) : 0

        return {
            interval: order * 10 ** exponent,
            digits: digits
        }
    }

    findNearestIndexSorted(value, array) {
        //only use for small arrays!  I'm lazy
        let difference = Math.abs(value - array[0]);
        let index = 0;
        for (let i = 1; i < array.length; i++) {
            let newDiff = Math.abs(value - array[i]);
            if (newDiff < difference) {
                difference = newDiff;
                index = i;
            }
        }
        return index;
    }
    findFirstTick(start, interval) {
        return Math.ceil(start / interval) * interval
    }
}

export default Axis;