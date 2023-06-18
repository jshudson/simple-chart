import * as svg from '../svgUtils/svgUtils.js';
import * as xform from './coordinateTransfer.js';
import { getScientific, superscript } from '../utils/utils.js';

class Axis {
    constructor(parent, id, direction, options) {
        this.parent = parent;
        this.direction = direction;
        this.id = `${id}-${this.direction}-axis`

        console.log('axis options', options)

        this.format = options.format;
        this.range = options.range;
        this.label = options.label;

        this.ticks = {
            targetCount: 5,
        }

    }

    getDimension(range) {
        console.log('getting dimension', this.direction)
        range = this.range
        const tempDimensions = {
            top: 0,
            left: 0,
            width: 100,
            height: 100
        }
        const temp = this.parent.appendChild(svg.newElement('g', { visibility: 'hidden' }))
        this.drawAxis(temp, tempDimensions, range)
        const bBox = temp.getBBox()
        temp.remove()

        return this.direction == 'x' ? bBox.height : bBox.width
    }
    drawAxis(parent, plotDimensions, range) {
        console.log('drawing ', this.direction)
        let axisScreenCoords = {}
        let offset = {}

        if (this.direction == 'x') {
            offset = {
                x: 0,
                y: plotDimensions.top + plotDimensions.height
            }
            axisScreenCoords = {
                x: [plotDimensions.left, plotDimensions.width + plotDimensions.left],
                y: [0, 10]
            }
        } else {
            offset = {
                x: plotDimensions.left,
                y: 0
            }
            axisScreenCoords = {
                x: [0, -10],
                y: [plotDimensions.top + plotDimensions.height, plotDimensions.top]
            }
        }

        parent.setAttribute('transform', `translate(${offset.x},${offset.y})`)

        // this.line = parent.appendChild(svg.newElement('line', {
        //     x1: lineCoords.x[0],
        //     x2: lineCoords.x[1],
        //     y1: lineCoords.y[0],
        //     y2: lineCoords.y[1],
        //     stroke: 'black'
        // }));
        this.addTicks(axisScreenCoords, range, parent);

    }
    redrawAxis(plotDimensions, range) {
        range = this.range
        if (this.group) this.group.remove()
        this.group = this.parent.appendChild(svg.newElement('g', { id: `${this.id}-${this.direction}-axis` }))
        this.drawAxis(this.group, plotDimensions, range)
    }
    addTicks(screenRange, dataRange, parent) {
        console.log('screenRange', screenRange)

        const range = dataRange[1] - dataRange[0];

        const trueInterval = range / this.ticks.targetCount;

        const { interval, extraDigits } = this.findInterval(trueInterval);

        const firstTick = this.findFirstTick(dataRange[0], interval);

        const tickCount = Math.ceil((dataRange[1] - firstTick) / interval)
        const values = Array.from({ length: tickCount }, (e, i) => i * interval + firstTick)
        const coords = xform.transform1DArray(values, dataRange[0], dataRange[1], screenRange[this.direction][0], screenRange[this.direction][1])

        const exponents = values.map((e) => {
            const [, exponent] = getScientific(e)
            return exponent
        }).filter(e => Number.isFinite(e))

        const maxExponent = Math.max(...exponents);
        const minExponent = Math.min(...exponents);

        const labelText = this.label + (this.format == 'scientific' ? ` ×10${superscript(maxExponent)}` : '')
        const axisLabel = this.addAxisLabel(labelText, parent, {
            x: screenRange.x[1],
            y: screenRange.y[1]
        }).getBBox()


        const ticks = parent.appendChild(svg.newElement('g', {}))

        values.forEach((e, i) => {
            this.addTick(ticks, coords[i], 5)

            const tickLabelText = this.getFormattedText(e, extraDigits, minExponent, maxExponent)
            const newTickLabel = this.addTickLabel(tickLabelText, ticks, coords[i], screenRange[this.direction == 'x' ? 'y' : 'x'][1])

            const labelBox = newTickLabel.getBBox();
            if (this.direction == 'x') {
                if (labelBox.x + labelBox.width >= axisLabel.x) newTickLabel.remove()
            } else {
                if (labelBox.y <= axisLabel.y + axisLabel.height) newTickLabel.remove()
            }
        })

    }
    getFormattedText(value, extraDigits, minExponent, maxExponent) {
        if (this.format == 'scientific') {
            return this.getScientificText(value, extraDigits, minExponent, maxExponent)
        }
        console.log(this.direction, minExponent, maxExponent)
        const absMax = Math.max(Math.abs(minExponent), Math.abs(maxExponent))
        const digits = (maxExponent || minExponent) < 0 ? absMax + extraDigits : 0
        console.log(this.direction, 'digits', digits, value)
        return value.toFixed(digits)
    }
    getScientificText(value, extraDigits, minExponent, maxExponent) {
        const divisor = 10 ** maxExponent
        const mantissa = value / divisor
        return mantissa.toFixed((maxExponent - minExponent) + extraDigits)
    }
    addTick(parent, coord, size) {
        const perpendicular = this.direction === 'x' ? 'y' : 'x'
        if (this.direction == 'y') size *= -1
        return parent.appendChild(svg.newElement('line', {
            [`${this.direction}1`]: coord,
            [`${this.direction}2`]: coord,
            [`${perpendicular}1`]: 0,
            [`${perpendicular}2`]: size,
            stroke: 'black'
        }))
    }
    addTickLabel(text, parent, coord, spacing) {
        const perpendicular = this.direction === 'x' ? 'y' : 'x'
        const baseline = this.direction === 'x' ? 'hanging' : 'middle'
        const anchor = this.direction === 'x' ? 'middle' : 'end'
        const label = parent.appendChild(svg.newElement('text', {
            [this.direction]: coord,
            [perpendicular]: spacing,
            'dominant-baseline': baseline,
            'text-anchor': anchor,
        }))
        label.innerHTML = text
        return label
    }
    addAxisLabel(text, parent, coordinates) {

        const label = parent.appendChild(svg.newElement('text', {
            'text-anchor': 'end',
            'dominant-baseline': 'hanging',
            x: coordinates.x,
            y: coordinates.y
        }))
        label.innerHTML = text
        return label
    }


    findInterval(value) {

        const [mantissa, exponent] = getScientific(value)

        const orders = [1, 2, 2.5, 5];

        const order = orders[this.findNearestIndexSorted(mantissa, orders)];

        const digits = order == 2.5 ? 1 : 0//exponent < 0 ? (Math.abs(exponent) + (order == 2.5 ? 1 : 0)) : 0

        return {
            interval: order * 10 ** exponent,
            extraDigits: digits
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