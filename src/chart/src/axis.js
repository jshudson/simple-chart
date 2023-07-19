/// <reference types="user">
// @ts-check
import * as svg from './svgUtils.js';
import * as xform from './coordinateTransfer.js';
import { getScientific, superscript } from '../../utils/utils.js';

class Axis {
  /**
   * Constructor
   * @param {SVGGraphicsElement} parent Root of chart
   * @param {String} id Id from the parent
   * @param {String} direction Axis direction 'x' or 'y'
   * @param {Object} options
   */
  constructor(parent, id, direction, options) {
    this.parent = parent;
    this.direction = direction;
    this.id = `${id}-${this.direction}-axis`;

    this.format = options?.format || 'standard';
    this.label = options?.label || 'Units';
    this.visible = options?.visible == undefined ? true : options.visible;
  }
  /**
   * Get the margin dimensions taken up by the axis for a certain range
   * @param {ScreenDimensions} plotDimensions
   * @param {NumberRange} range
   * @returns {number}
   */
  getDimension(plotDimensions, range) {
    if (!this.visible) return 0;
    const temp = this.parent.appendChild(
      svg.newElement('g', {
        visibility: 'hidden',
        id: `${this.direction}${range[0]}-${range[1]}`,
      })
    );
    this.drawAxis(temp, plotDimensions, range);
    const bBox = temp.getBBox();
    temp.remove();

    return this.direction == 'x' ? bBox.height : bBox.width;
  }
  /**
   * Draw the axis
   * @param {SVGGraphicsElement} parent
   * @param {ScreenDimensions} plotDimensions
   * @param {NumberRange} range
   */
  drawAxis(parent, plotDimensions, range) {
    /**@type {Rectangle} */
    let axisScreenCoords = { x: [0, 0], y: [0, 0] };

    /**@type {Point} */
    let offset = { x: 0, y: 0 };

    if (this.direction == 'x') {
      offset = {
        x: 0,
        y: plotDimensions.top + plotDimensions.height,
      };
      axisScreenCoords = {
        x: [plotDimensions.left, plotDimensions.width + plotDimensions.left],
        y: [0, 10],
      };
    } else {
      offset = {
        x: plotDimensions.left,
        y: 0,
      };
      axisScreenCoords = {
        x: [0, -10],
        y: [plotDimensions.top + plotDimensions.height, plotDimensions.top],
      };
    }

    parent.setAttribute('transform', `translate(${offset.x},${offset.y})`);

    this.labelAxis(axisScreenCoords, range, parent);
    this.addBoundingRectangle(parent, axisScreenCoords);
  }
  /**
   *
   * @param {SVGGraphicsElement} parent
   * @param {Rectangle} axisScreenCoords
   */
  addBoundingRectangle(parent, axisScreenCoords) {
    const dimension =
      this.direction == 'x' ? parent.getBBox().height : parent.getBBox().width;
    let attributes = { fill: 'none' };
    if (this.direction == 'x') {
      attributes = {
        ...attributes,
        x: axisScreenCoords.x[0],
        y: 0,
        width: Math.max(axisScreenCoords.x[1] - axisScreenCoords.x[0]),
        height: Math.max(dimension),
        class: 'scroll-drag-horiz',
      };
    } else {
      attributes = {
        ...attributes,
        x: -dimension,
        y: axisScreenCoords.y[1],
        width: Math.max(0,dimension),
        height: Math.max(0,axisScreenCoords.y[0] - axisScreenCoords.y[1]),
        class: 'scroll-drag-vert',
      };
    }
    this.rect = parent.appendChild(svg.newElement('rect', attributes));
  }
  /**
   * Get the bounding rectangle for the axis
   * @returns {SVGElement}
   */
  get boundary() {
    return this.rect;
  }

  /**
   * Label the axis with tick marks, tick labels, and axis labels
   * @param {Rectangle} screenRange Screen coodinates for location of the axis
   * @param {NumberRange} range Axis limits in plot coordinates
   * @param {SVGGraphicsElement} parent SVG Parent
   */
  labelAxis(screenRange, range, parent) {
    const dataWidth = range[1] - range[0];

    //minimum of 5 ticks for math to work
    const targetTickCount = Math.max(
      Math.ceil(
        Math.abs(
          screenRange[this.direction][1] - screenRange[this.direction][0]
        ) / 90
      ),
      5
    );

    const decimalInterval = dataWidth / targetTickCount;

    //rounded interval with an extra digits needed from axis order
    const { roundedInterval, extraDigits } =
      this.findRoundedInterval(decimalInterval);

    const firstTick = Math.ceil(range[0] / roundedInterval) * roundedInterval;

    const tickCount = Math.ceil((range[1] - firstTick) / roundedInterval);

    const tickPlotCoordinates = Array.from(
      { length: tickCount },
      (e, i) => i * roundedInterval + firstTick
    );

    const tickScreenCoordinates = xform.transform1DArray(
      tickPlotCoordinates,
      range[0],
      range[1],
      screenRange[this.direction][0],
      screenRange[this.direction][1]
    );

    const exponentRange = this.getExponentRange([
      ...tickPlotCoordinates,
      roundedInterval,
    ]);

    const axisLabelGroup = parent.appendChild(svg.newElement('g', {}));
    const axisLabel = this.addAxisLabel(this.label, axisLabelGroup, {
      x: screenRange.x[1],
      y: screenRange.y[1],
    });

    //add notation for scientific scaling
    if (this.format == 'scientific') {
      this.addAxisLabel(
        ` ×10${superscript(exponentRange[1])}`,
        axisLabelGroup,
        {
          x: screenRange.x[1],
          y: screenRange.y[1] + axisLabel.getBBox().height,
        }
      );
    }
    const axisLabelBox = axisLabelGroup.getBBox();

    const ticks = parent.appendChild(svg.newElement('g', {}));

    let prevTickLabelBox;

    tickPlotCoordinates.forEach((e, i) => {
      this.addTickLine(ticks, tickScreenCoordinates[i], 5);

      const tickLabelText = this.getFormattedText(
        e,
        extraDigits,
        exponentRange,
        roundedInterval
      );
      const newTickLabel = this.addTickLabel(
        tickLabelText,
        ticks,
        tickScreenCoordinates[i],
        screenRange[this.direction == 'x' ? 'y' : 'x'][1]
      );
      //remove tick labels that overlap with stuff
      const tickLabelBox = newTickLabel.getBBox();

      if (this.direction == 'x') {
        if (
          tickLabelBox.x + tickLabelBox.width >= axisLabelBox.x ||
          tickLabelBox.x <= prevTickLabelBox?.x + prevTickLabelBox?.width
        ) {
          newTickLabel.remove();
          return;
        }
      } else {
        if (
          tickLabelBox.y <= axisLabelBox.y + axisLabelBox.height ||
          tickLabelBox.y >= prevTickLabelBox?.y + prevTickLabelBox?.height
        ) {
          newTickLabel.remove();
          return;
        }
      }
      prevTickLabelBox = newTickLabel.getBBox();
    });
  }
  /**
   *
   * @param {Array<number>} values
   * @returns {NumberRange}
   */
  getExponentRange(values) {
    //get exponents for all values, and filter errors from 0
    const exponents = values
      .map((e) => {
        const [, exponent] = getScientific(e);
        return exponent;
      })
      .filter((e) => Number.isFinite(e));

    const minExponent = Math.min(...exponents);
    const maxExponent = Math.max(...exponents);
    return [minExponent, maxExponent];
  }
  /**
   *
   * @param {number} value
   * @param {number} extraDigits
   * @param {NumberRange} exponentRange
   * @param {number} interval
   * @returns
   */
  getFormattedText(value, extraDigits, exponentRange, interval) {
    if (this.format == 'scientific') {
      return this.getScientificText(value, extraDigits, exponentRange);
    }
    //min and max exponent define how many decimals are displayed
    const [, exponent] = getScientific(interval);

    const digits = Math.abs(exponent) + extraDigits;
    return value.toFixed(digits);
  }
  /**
   *
   * @param {number} value
   * @param {number} extraDigits
   * @param {NumberRange} exponentRange
   * @returns
   */
  getScientificText(value, extraDigits, exponentRange) {
    const divisor = 10 ** exponentRange[1];
    const mantissa = value / divisor;
    return mantissa.toFixed(exponentRange[1] - exponentRange[0] + extraDigits);
  }

  /**
   * Add a tick line and return a reference
   * @param {SVGGraphicsElement} parent SVG parent
   * @param {number} coord 1 dimensional coordinate of the tick mark
   * @param {number} size Size of the tick in pixels
   * @returns {SVGGraphicsElement}
   */
  addTickLine(parent, coord, size) {
    const perpendicular = this.direction === 'x' ? 'y' : 'x';
    if (this.direction == 'y') size *= -1;
    return parent.appendChild(
      svg.newElement('line', {
        [`${this.direction}1`]: coord,
        [`${this.direction}2`]: coord,
        [`${perpendicular}1`]: 0,
        [`${perpendicular}2`]: size,
        stroke: 'black',
      })
    );
  }
  /**
   * Add a tick label and return a reference
   * @param {String} text Tick label text
   * @param {SVGGraphicsElement} parent SVG Parent
   * @param {number} coord 1 dimensional coordinate of the label
   * @param {number} spacing How far from the axis to draw text
   * @returns {SVGGraphicsElement}
   */
  addTickLabel(text, parent, coord, spacing) {
    const perpendicular = this.direction === 'x' ? 'y' : 'x';
    const baseline = this.direction === 'x' ? 'hanging' : 'middle';
    const anchor = this.direction === 'x' ? 'middle' : 'end';
    const label = parent.appendChild(
      svg.newElement('text', {
        [this.direction]: coord,
        [perpendicular]: spacing,
        'dominant-baseline': baseline,
        'text-anchor': anchor,
      })
    );
    label.innerHTML = text;
    return label;
  }
  /**
   * Add an axis label and return a reference
   * @param {String} text
   * @param {SVGGraphicsElement} parent
   * @param {Point} coordinates
   * @returns {SVGGraphicsElement}
   */
  addAxisLabel(text, parent, coordinates) {
    const label = parent.appendChild(
      svg.newElement('text', {
        'text-anchor': 'end',
        'dominant-baseline': 'hanging',
        x: coordinates.x,
        y: coordinates.y,
      })
    );
    label.innerHTML = text;
    return label;
  }

  /**
   * Find the interval closest to a predefined mantissa
   * @param {number} value
   * @returns {Object}
   */
  findRoundedInterval(value) {
    const [mantissa, exponent] = getScientific(value);

    const orders = [1, 2, 2.5, 5];

    const order = orders[this.findNearestIndex(mantissa, orders)];

    const digits = order == 2.5 ? 1 : 0;

    return {
      roundedInterval: order * 10 ** exponent,
      extraDigits: digits,
    };
  }
  /**
   * Gets the closest number in array to value
   * @param {number} value
   * @param {Array<number>} array
   * @returns {number}
   */
  findNearestIndex(value, array) {
    //only use for small arrays!
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
  /**
   *
   * @param {ScreenDimensions} plotDimensions
   * @param {NumberRange} range
   */
  render(plotDimensions, range) {
    if (this.group) this.group.remove();
    if (!this.visible) return;
    this.group = this.parent.appendChild(
      svg.newElement('g', { id: `${this.id}` })
    );
    this.drawAxis(this.group, plotDimensions, range);
  }
}

export default Axis;
