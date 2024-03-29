import * as svg from './svgUtils.js';
import * as xform from './coordinateTransfer.js';
import { getScientific } from '../../utils/utils.js';

import Plot from './plot.js';
import Axis from './axis.js';
import ZoomRectangle from './zoomRectangle.js';

import * as axisMouseHandlers from './chartAxisMouseHandlers.js';
import * as zoomMouseHandlers from './chartZoomMouseHandlers.js';
import * as integrateMouseHandlers from './chartIntegrateMouseHandlers.js';

const SUPPORTED_EVENTS = [
  'render',
  'click',
  'contextmenu',
  'copy',
  'cut',
  'dblclick',
  'drag',
  'dragend',
  'dragenter',
  'dragexit',
  'dragleave',
  'dragover',
  'dragstart',
  'drop',
  'durationchange',
  'focus',
  'focusin',
  'focusout',
  'keydown',
  'keypress',
  'keyup',
  'mousedown',
  'mouseenter',
  'mouseleave',
  'mousemove',
  'mouseout',
  'mouseover',
  'mouseup',
  'paste',
  'resize',
  'scroll',
  'wheel',
];

const styleStringToObject = (style) => {
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
    this.eventListeners = [];
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
      this.data = { ...options.data };
    } else {
      this.data = { x: [], y: [] };
      /**@type {Rectangle} */
      this.limits = { x: [0, 0], y: [0, 0] };
    }
    this.cull = options?.cull ? options.cull : false;
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
    this.updateDimensions();
    if (this.data) this.resetLimits();
  }
  updateID(id) {
    this.id = id;
    this.chart.setAttribute('id', this.id);
    this.axes.x.updateID(this.id);
    this.axes.y.updateID(this.id);
    this.plot.updateID(this.id);
    this.render();
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

    this.handleMouseDown_Integrate =
      integrateMouseHandlers.handleMouseDown_Integrate.bind(this);

    this.render = this.render.bind(this);
    this.resizeRender = this.resizeRender.bind(this);
    window.addEventListener('focus', this.render);

    this.parentResizeObserver = new ResizeObserver(this.resizeRender);
    this.parentResizeObserver.observe(this.parent);
  }
  updateDimensions() {
    const style = window.getComputedStyle(this.chart);
    this.margin = styleStringToObject(style.margin);
    this.padding = styleStringToObject(style.padding);
    this.chart.setAttribute('width', '0');
    this.chart.setAttribute('height', '0');
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
      ) + 'px'
    );
    this.chart.setAttribute(
      'height',
      String(
        this.height -
          (this.margin.top +
            this.padding.top +
            this.margin.bottom +
            this.padding.bottom)
      ) + 'px'
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
  getPadding(limits) {
    const plotPadding = {
      x: xform.relativeOffset1D(10, 0, this.plotDimensions.width, ...limits.x),
      y: xform.relativeOffset1D(10, 0, this.plotDimensions.height, ...limits.y),
    };
    /**@type {Rectangle} */
    const paddedLimits = {
      x: [limits.x[0] - plotPadding.x, limits.x[1] + plotPadding.x],
      y: [limits.y[0] - plotPadding.y, limits.y[1] + plotPadding.y],
    };
    return paddedLimits;
  }
  /**
   *
   * @param {Rectangle} newLimits
   * @returns
   */
  setLimits(newLimits, animate = false, triggerRenderEvent = true) {
    const [, xExponent] = getScientific(newLimits.y[1] - newLimits.y[0]);
    const [, yExponent] = getScientific(newLimits.y[1] - newLimits.y[0]);
    if (xExponent < -10 || yExponent < -10) return;

    /**@type {Rectangle} */
    this.limits = { ...newLimits };
    this.triggerRenderEvent = triggerRenderEvent;
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
      x: [this.data.x[0], this.data.x[this.data.x.length - 1]],
      y: [Math.min(...this.data.y), Math.max(...this.data.y)],
    };

    this.setLimits({
      x: [baseLimits.x[0], baseLimits.x[1]],
      y: [baseLimits.y[0], baseLimits.y[1]],
    });
    console.log('reset', this.limits, this.paddedLimits);
  }
  /**
   *
   * @returns {Rectangle}
   */
  fullYScale() {
    const start = this.data.x.findIndex((e) => e >= this.limits.x[0]);
    const end = this.data.x.findIndex((e) => e > this.limits.x[1]);

    if (start == end) return;
    const filter = this.data.y.slice(start, end);
    const baseLimits = [Math.min(...filter), Math.max(...filter)];
    return {
      x: [...this.limits.x],
      y: [baseLimits[0], baseLimits[1]],
    };
  }
  /**
   *
   * @returns {Rectangle}
   */
  fullXScale() {
    const baseLimits = [this.data.x[0], this.data.x[this.data.x.length - 1]];

    return {
      x: [baseLimits[0], baseLimits[1]],
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

  /**
   * Convert a coordinate in the chart area to a Plot Scaled value
   * @param {Point} point xy coordinates based on the total chart size
   * @returns {Point}
   */
  chartScreenCoordinateToPlotCoordinate(point) {
    const offsetPlotCoords = {
      x: point.x - this.plotDimensions.left - this.padding.left,
      y: point.y - this.plotDimensions.top - this.padding.top,
    };
    const source = {
      x: [0, this.plotDimensions.width],
      y: [this.plotDimensions.height, 0],
    };
    return xform.transform2D(offsetPlotCoords, source, this.limits);
  }
  clickToPlotCoordinate(event) {
    return this.chartScreenCoordinateToPlotCoordinate({
      x: event.offsetX,
      y: event.offsetY,
    });
  }
  resizeRender() {
    console.log('resize observer', this.id);
    this.updateDimensions();
    this.setLimits(this.limits, true, false);
    if (this.id == 'second3') console.log(this.limits, this.paddedLimits);
  }
  /**
   * Render the Chart
   */
  render() {
    console.time(`${this.id} render`);
    this.readyForAnimationFrame = false;
    console.time('update dimensions');
    this.updateDimensions();
    console.time('get padding');
    this.paddedLimits = this.getPadding(this.limits);
    console.timeEnd('get padding');
    console.time('xAxis pad');
    const xAxisPad = this.axes.x.getDimension(
      this.plotDimensions,
      this.paddedLimits.x
    );
    console.timeEnd('xAxis pad');
    console.time('yAxis pad');
    const yAxisPad = this.axes.y.getDimension(
      this.plotDimensions,
      this.paddedLimits.y
    );
    console.timeEnd('yAxis pad');
    this.plotDimensions = {
      top: this.frame.top,
      left: this.frame.left + yAxisPad,
      width: this.width - this.frame.left - yAxisPad - this.frame.right - 1,
      height: this.height - this.frame.top - xAxisPad - this.frame.bottom,
    };

    console.timeEnd('update dimensions');
    console.time('render plot');
    this.plot.render(
      this.paddedLimits,
      this.plotDimensions,
      this.data,
      this.integrals,
      this.cull
    );
    console.timeEnd('render plot');
    console.time('render axes');
    this.axes.x.render(this.plotDimensions, this.paddedLimits.x);
    this.axes.y.render(this.plotDimensions, this.paddedLimits.y);
    console.timeEnd('render axes');
    this.readyForAnimationFrame = true;

    if (this.onrender && this.triggerRenderEvent) {
      this.triggerRenderEvent = true;
      this.onrender({
        target: this.chart,
        limits: this.limits,
        plotDimensions: this.plotDimensions,
        integrals: this.integrals,
      });
    }
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
    if (!SUPPORTED_EVENTS.includes(type)) return;
    console.log(this.id, type);
    switch (type) {
      case 'render':
        this.onrender = callback;
        return;
      default:
        this.eventListeners.push({
          type,
          originalCallback: callback,
          callback: (event) => {
            event.onAxis = this.eventOnAxis(event);
            callback(event);
          },
        });

        this.chart.addEventListener(
          type,
          this.eventListeners[this.eventListeners.length - 1].callback
        );
    }
  }
  removeEventListener(type, callback) {
    const index = this.eventListeners.findIndex(
      (element) => element.type == type && element.originalCallback == callback
    );
    if (index == -1) return;
    this.chart.removeEventListener(type, this.eventListeners[index].callback);
    this.eventListeners.splice(index, 1);
  }
  remove() {
    this.eventListeners.forEach(({ type, callback }) => {
      this.chart.removeEventListener(type, callback);
    });
    this.parentResizeObserver.unobserve(this.parent);
    window.removeEventListener('focus', this.render);
    this.chart.remove();
  }
}

export default Chart;
