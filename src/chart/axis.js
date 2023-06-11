import * as svg from '../svgUtils/svgUtils.js';

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
        this.dimensions = plotDimensions;

        this.range = options.range;

        this.group = this.parent.appendChild(svg.newElement('g', {
            transform: `translate(0,${this.axisCoords.y[0]})`
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
        this.line = this.group.appendChild(svg.newElement('line', {
            x1: this.axisCoords.x[0],
            y1: 0,
            x2: this.axisCoords.x[1],
            y2: 0,
            stroke: 'black'
        }));
    }
    addTicks() {
        const range = this.range[1] - this.range[0];
        const fullInterval = range / this.ticks.targetCount;
        const targetInterval = this.findInterval(fullInterval);
        const firstTick = this.findFirstTick(this.range[0], targetInterval);
        const tickCount = range/targetInterval
        const values = [];

    }

    findInterval(value) {
        const exponent = Math.floor(Math.log10(value));
        const mantissa = value / (10 ** exponent);

        const orders = [1, 2, 2.5, 5];

        const order = this.findNearestIndexSorted(mantissa, orders);

        return order * 10 ** exponent
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