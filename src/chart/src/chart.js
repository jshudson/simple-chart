import * as svg from './svgUtils.js';
import * as xform from './coordinateTransfer.js';
import { getScientific } from '../../utils/utils.js';

import Plot from './plot.js';
import Axis from './axis.js';
import ZoomRectangle from './zoomRectangle.js';

import * as axisMouseHandlers from './chartAxisMouseHandlers.js';
import * as zoomMouseHandlers from './chartZoomMouseHandlers.js';

const DEFAULT_OPTIONS = {
  data: { x: [], y: [] },
  limits: { x: [0, 0], y: [] },
  pad: { top: 10, right: 10, bottom: 10, left: 0 },
};

const sideStyleStringToObject = (style) => {
  const array = style
    .replace(/px/g, '')
    .split(' ')
    .map((e) => Number(e));
  switch (array.length) {
    case 1:
      return {
        top: array[0],
        right: array[0],
        bottom: array[0],
        left: array[0],
      };
    case 2:
      return {
        top: array[0],
        right: array[1],
        bottom: array[0],
        left: array[1],
      };
    case 3:
      return {
        top: array[0],
        right: array[1],
        bottom: array[2],
        left: array[1],
      };
    default:
      return {
        top: array[0],
        right: array[1],
        bottom: array[2],
        left: array[3],
      };
  }
};

class Chart {
  /**
   *
   * @param {String} id
   * @param {HTMLElement} parent
   * @param {Object} options
   */
  constructor(id, parent, options) {
    this.id = id;

    this.parent = parent;

    /**@type {SVGGraphicsElement} */
    this.chart = this.parent.appendChild(
      svg.newElement('svg', {
        id: this.id,
        'pointer-events': 'bounding-box',
        xmlns: 'http://www.w3.org/2000/svg',
      })
    );

    this.bindListenersAndHandlers();

    if (options?.data) {
      this.data = [...options.data];
    } else {
      this.data = { x: [], y: [] };
      /**@type {Rectangle} */
      this.limits = { x: [0, 0], y: [0, 0] };
    }
    this.cull = options?.cull ? options.cull : false;
    console.log(this.cull);
    this.axes = {
      x: new Axis(this.chart, this.id, 'x', {
        label: 'Time[min]',
        format: 'standard',
        visible: true,
      }),
      y: new Axis(this.chart, this.id, 'y', {
        label: 'mAU',
        format: 'scientific',
        visible: true,
      }),
    };

    this.plot = new Plot(this.chart, this.id);
    this.integrals = [];
    this.zoomRectangle = new ZoomRectangle(this.chart);
    this.interactionMode = 'zoom';

    this.readyForAnimationFrame = true;
    if (this.data) this.resetLimits();
  }
  bindListenersAndHandlers() {
    this.chart.oncontextmenu = (e) => {
      return false;
    };

    this.chart.onmousedown = this.handleMouseDown.bind(this);
    this.chart.ondblclick = this.handleDoubleClick.bind(this);
    this.chart.onwheel = this.handleWheel.bind(this);

    this.handleMouseDown_Zoom =
      zoomMouseHandlers.handleMouseDown_Zoom.bind(this);
    this.handleMouseMove_Zoom =
      zoomMouseHandlers.handleMouseMove_Zoom.bind(this);
    this.handleMouseUp_Zoom = zoomMouseHandlers.handleMouseUp_Zoom.bind(this);

    this.handleMouseDown_Axis =
      axisMouseHandlers.handleMouseDown_Axis.bind(this);
    this.handleMouseMove_Axis =
      axisMouseHandlers.handleMouseMove_Axis.bind(this);
    this.handleMouseUp_Axis = axisMouseHandlers.handleMouseUp_Axis.bind(this);
    this.handleWheel_Axis = axisMouseHandlers.handleWheel_Axis.bind(this);

    this.render = this.render.bind(this);
    window.addEventListener('focus', this.render);

    const parentResizeObserver = new ResizeObserver(this.render);
    parentResizeObserver.observe(this.parent);
  }
  updateDimensions() {
    const style = window.getComputedStyle(this.chart);
    this.margin = sideStyleStringToObject(style.margin);
    this.padding = sideStyleStringToObject(style.padding);
    this.width = this.parent.offsetWidth;
    this.height = this.parent.offsetHeight;
    this.chart.setAttribute(
      'width',
      String(
        this.width -
          (this.margin.right +
            this.padding.right +
            this.margin.left +
            this.padding.left)
      )
    );
    this.chart.setAttribute(
      'height',
      String(
        this.height -
          (this.margin.top +
            this.padding.top +
            this.margin.bottom +
            this.padding.bottom)
      )
    );

    this.frame = {
      top: 0,
      right:
        this.margin.right +
        this.padding.right +
        this.margin.left +
        this.padding.left,
      bottom:
        this.margin.bottom +
        this.padding.bottom +
        this.margin.top +
        this.padding.top,
      left: 0,
    };
    this.plotDimensions = {
      top: this.frame.top,
      left: this.frame.left,
      width: this.width - this.frame.left - this.frame.right,
      height: this.height - this.frame.top - this.frame.bottom,
    };
  }
  setMode(mode) {
    this.interactionMode = mode;
  }
  /**
   *
   * @param {Rectangle} newLimits
   * @returns
   */
  setLimits(newLimits, animate = false) {
    const [, xExponent] = getScientific(newLimits.y[1] - newLimits.y[0]);
    const [, yExponent] = getScientific(newLimits.y[1] - newLimits.y[0]);
    if (xExponent < -10 || yExponent < -10) return;
    /**@type {Rectangle} */
    this.limits = { ...newLimits };
    if (!animate) {
      this.render();
      return;
    }
    if (this.readyForAnimationFrame) {
      window.requestAnimationFrame(this.render);
    }
  }
  resetLimits() {
    const baseLimits = {
      x: [this.data[0].x[0], this.data[0].x[this.data[0].x.length - 1]],
      y: [Math.min(...this.data[0].y), Math.max(...this.data[0].y)],
    };
    const pads = {
      x: (baseLimits.x[1] - baseLimits.x[0]) * 0.01,
      y: (baseLimits.y[1] - baseLimits.y[0]) * 0.01,
    };
    this.setLimits({
      x: [baseLimits.x[0] - pads.x, baseLimits.x[1] + pads.x],
      y: [baseLimits.y[0] - pads.y, baseLimits.y[1] + pads.y],
    });
  }
  /**
   *
   * @returns {Rectangle}
   */
  fullYScale() {
    const start = this.data[0].x.findIndex((e) => e >= this.limits.x[0]);
    const end = this.data[0].x.findIndex((e) => e > this.limits.x[1]);

    if (start == end) return;
    const filter = this.data[0].y.slice(start, end);
    const baseLimits = [Math.min(...filter), Math.max(...filter)];
    const pad = (baseLimits[1] - baseLimits[0]) * 0.01;
    return {
      x: [...this.limits.x],
      y: [baseLimits[0] - pad, baseLimits[1] + pad],
    };
  }
  /**
   *
   * @returns {Rectangle}
   */
  fullXScale() {
    const baseLimits = [
      this.data[0].x[0],
      this.data[0].x[this.data[0].x.length - 1],
    ];
    const pad = (baseLimits[1] - baseLimits[0]) * 0.01;
    return {
      x: [baseLimits[0] - pad, baseLimits[1] + pad],
      y: [...this.limits.y],
    };
  }

  eventOnAxis(event) {
    if (this.axes.x.boundary?.contains(event.target)) return 'x';
    if (this.axes.y.boundary?.contains(event.target)) return 'y';
    return undefined;
  }

  handleDoubleClick(event) {
    const onAxis = this.eventOnAxis(event);
    if (onAxis == 'x') {
      this.setLimits(this.fullXScale());
      return;
    }
    if (onAxis == 'y') {
      this.setLimits(this.fullYScale());
      return;
    }
    this.resetLimits();
  }
  /**
   *
   * @param {PointerEvent} event
   */
  handleMouseDown(event) {
    event.preventDefault();
    //@ts-ignore
    const onAxis = this.eventOnAxis(event);
    if (onAxis) this.handleMouseDown_Axis(event, onAxis);

    switch (this.interactionMode) {
      case 'zoom':
        this.handleMouseDown_Zoom(event);
        return;
      case 'integrate':
        this.handleMouseDown_Integrate(event);
        return;
      default:
        return;
    }
  }
  handleWheel(event) {
    event.preventDefault();
    const onAxis = this.eventOnAxis(event);
    if (onAxis) this.handleWheel_Axis(event, onAxis);
  }

  handleMouseDown_Integrate(event) {
    const click = xform.transform2D(
      {
        x: event.offsetX - this.plotDimensions.left,
        y: event.offsetY - this.plotDimensions.top,
      },
      { x: [0, this.plotDimensions.width], y: [this.plotDimensions.height, 0] },
      this.limits
    );
    this.integrals.push({
      x: [click.x, click.x + 0.1],
      y: [click.y, click.y + 1],
    });
    this.render();
  }

  /**
   * Convert a coordinate in the chart area to a Plot Scaled value
   * @param {Point} point xy coordinates based on the total chart size
   * @returns {Point}
   */
  chartScreenCoordinateToPlotCoordinate(point) {
    const offsetPlotCoords = {
      x: point.x - this.plotDimensions.left,
      y: point.y - this.plotDimensions.top,
    };
    const source = {
      x: [0, this.plotDimensions.width],
      y: [this.plotDimensions.height, 0],
    };
    return xform.transform2D(offsetPlotCoords, source, this.limits);
  }

  /**
   * Render the Chart
   */
  render() {
    this.readyForAnimationFrame = false;
    console.time(`${this.id} render`);

    this.updateDimensions();
    const xAxisPad = this.axes.x.getDimension(
      this.plotDimensions,
      this.limits.x
    );
    const yAxisPad = this.axes.y.getDimension(
      this.plotDimensions,
      this.limits.y
    );

    this.plotDimensions = {
      top: this.frame.top,
      left: this.frame.left + yAxisPad,
      width: this.width - this.frame.left - yAxisPad - this.frame.right,
      height: this.height - this.frame.top - xAxisPad - this.frame.bottom,
    };

    this.plot.render(
      this.limits,
      this.plotDimensions,
      this.data[0],
      this.integrals,
      this.cull
    );
    this.axes.x.render(this.plotDimensions, this.limits.x);
    this.axes.y.render(this.plotDimensions, this.limits.y);

    this.readyForAnimationFrame = true;

    if (this.onrender)
      this.onrender({
        target: this.chart,
        limits: this.limits,
        plotDimensions: this.plotDimensions,
        integrals: this.integrals,
      });
    console.timeEnd(`${this.id} render`);
  }
  /**
   * Save the SVG Plot
   * @param {*} name
   */
  saveSvg(name) {
    svg.saveSvg(this.chart, name);
  }
  /**
   *
   * @param {*} callback
   */
  addEventListener(type, callback) {
    if (type == 'onrender') {
      this.onrender = callback;
    }
  }
}

export default Chart;
