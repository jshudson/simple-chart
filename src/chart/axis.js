// @ts-check
import * as svg from '../svgUtils/svgUtils.js';
import * as xform from './coordinateTransfer.js';
import { getScientific, superscript } from '../utils/utils.js';
/**
 * @typedef {Object} Rect
 * @property {[number, number]} x The x coordinates
 * @property {[number, number]} y The y coordinates
 */

/**
 * @typedef {Object} ScreenDimensions
 * @property {number} left
 * @property {number} top
 * @property {number} width
 * @property {number} height
 */
class Axis {

    /**
     * Constructor
     * @param {SVGElement} parent Root of chart
     * @param {String} id Id from the parent
     * @param {String} direction Axis direction 'x' or 'y'
     * @param {Object} options 
     */
    constructor(parent, id, direction, options) {
        this.parent = parent;
        this.direction = direction;
        this.id = `${id}-${this.direction}-axis`


        this.format = options.format;
        this.label = options.label;
    }
    /**
     * 
     * @param {Rect} range 
     * @returns {number}
     */
    getDimension(range) {
        const temp = this.parent.appendChild(svg.newElement('g', { visibility: 'hidden' }))
        this.drawAxis(temp, {
            top: 0,
            left: 0,
            width: 100,
            height: 100
        }, range)
        const bBox = temp.getBBox()
        temp.remove()

        return this.direction == 'x' ? bBox.height : bBox.width
    }
    /**
     * 
     * @param {SVGElement} parent 
     * @param {ScreenDimensions} plotDimensions 
     * @param {Rect} range 
     */
    drawAxis(parent, plotDimensions, range) {

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

    addTicks(screenRange, dataRange, parent) {

        const range = dataRange[1] - dataRange[0];
        const targetTicks = Math.max(Math.ceil(Math.abs(screenRange[this.direction][1] - screenRange[this.direction][0]) / 90), 5)

        const trueInterval = range / targetTicks

        const { interval, extraDigits } = this.findRoundedInterval(trueInterval);

        const firstTick = this.findFirstTick(dataRange[0], interval);

        const tickCount = Math.ceil((dataRange[1] - firstTick) / interval)
        const values = Array.from({ length: tickCount }, (e, i) => i * interval + firstTick)
        const coords = xform.transform1DArray(values, dataRange[0], dataRange[1], screenRange[this.direction][0], screenRange[this.direction][1])


        const [minExponent, maxExponent] = this.getExponentRange(values)

        const axisLabelGroup = parent.appendChild(svg.newElement('g', {}))
        const axisLabel = this.addAxisLabel(this.label, axisLabelGroup, {
            x: screenRange.x[1],
            y: screenRange.y[1]
        }).getBBox()
        if (this.format == 'scientific') {
            this.addAxisLabel(` ×10${superscript(maxExponent)}`, axisLabelGroup, {
                x: screenRange.x[1],
                y: screenRange.y[1] + axisLabel.height
            })
        }
        const yAxisLabelBox = axisLabelGroup.getBBox()


        const ticks = parent.appendChild(svg.newElement('g', {}))

        values.forEach((e, i) => {
            this.addTickLine(ticks, coords[i], 5)

            const tickLabelText = this.getFormattedText(e, extraDigits, minExponent, maxExponent)
            const newTickLabel = this.addTickLabel(tickLabelText, ticks, coords[i], screenRange[this.direction == 'x' ? 'y' : 'x'][1])

            const labelBox = newTickLabel.getBBox();
            if (this.direction == 'x') {
                if (labelBox.x + labelBox.width >= yAxisLabelBox.x) newTickLabel.remove()
            } else {
                if (labelBox.y <= yAxisLabelBox.y + yAxisLabelBox.height) newTickLabel.remove()
            }
        })
    }
    getExponentRange(values) {
        const exponents = values.map((e) => {
            const [, exponent] = getScientific(e);
            return exponent;
        }).filter(e => Number.isFinite(e));

        const minExponent = Math.min(...exponents);
        const maxExponent = Math.max(...exponents);
        return [minExponent, maxExponent]
    }

    getFormattedText(value, extraDigits, minExponent, maxExponent) {
        if (this.format == 'scientific') {
            return this.getScientificText(value, extraDigits, minExponent, maxExponent)
        }
        console.log(this.direction, minExponent, maxExponent)
        const absMax = Math.max(Math.abs(minExponent), Math.abs(maxExponent))
        const digits = (maxExponent || minExponent) < 0 ? absMax + extraDigits : 0
        return value.toFixed(digits)
    }
    getScientificText(value, extraDigits, minExponent, maxExponent) {
        const divisor = 10 ** maxExponent
        const mantissa = value / divisor
        return mantissa.toFixed((maxExponent - minExponent) + extraDigits)
    }
    addTickLine(parent, coord, size) {
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

    findRoundedInterval(value) {

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

    render(plotDimensions, range) {
        if (this.group) this.group.remove()
        this.group = this.parent.appendChild(svg.newElement('g', { id: `${this.id}` }))
        this.drawAxis(this.group, plotDimensions, range)
    }
}

export default Axis;