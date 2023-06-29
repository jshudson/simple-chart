import * as svg from "../svgUtils/svgUtils.js";
import Plot from "./plot.js";
import Axis from "./axis.js";
import ZoomRectangle from "./zoomRectangle.js";
import { getScientific } from "../utils/utils.js";
import * as xform from "./coordinateTransfer.js";

const DEFAULT_OPTIONS = {
  data: { x: [], y: [] },
  limits: { x: [0, 0], y: [] },
  pad: { top: 10, right: 10, bottom: 10, left: 0 },
};

const ZOOM_FACTOR = 1.5;

const sideStyleStringToObject = (style) => {
  const array = style
    .replace(/px/g, "")
    .split(" ")
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
      svg.newElement("svg", {
        id: this.id,
        "pointer-events": "bounding-box",
        xmlns: "http://www.w3.org/2000/svg",
      })
    );

    this.chart.onmousedown = this.handleMouseDown.bind(this);
    this.chart.onmouseleave = this.handleMouseLeave.bind(this);
    this.chart.ondblclick = this.handleDoubleClick.bind(this);
    this.chart.onwheel = this.handleWheel.bind(this);

    this.handleMouseUp_Zoom = this.handleMouseUp_Zoom.bind(this);
    this.handleMouseMove_Zoom = this.handleMouseMove_Zoom.bind(this);
    this.handleMouseMove_Axis = this.handleMouseMove_Axis.bind(this);
    this.handleMouseUp_Axis = this.handleMouseUp_Axis.bind(this);

    this.render = this.render.bind(this);

    if (options?.data) {
      this.data = [...options.data];
    } else {
      this.data = { x: [], y: [] };
      /**@type {Rectangle} */
      this.limits = { x: [0, 0], y: [0, 0] };
    }
    this.updateDimensions();

    this.axes = {
      x: new Axis(this.chart, this.id, "x", {
        label: "Time[min]",
        format: "standard",
        visible: true,
      }),
      y: new Axis(this.chart, this.id, "y", {
        label: "mAU",
        format: "scientific",
        visible: true,
      }),
    };
    this.plot = new Plot(this.chart, this.id + "plot");
    this.integrals = [];
    this.zoomRectangle = new ZoomRectangle(this.chart);
    this.interactionMode = "zoom";
    this.readyForAnimationFrame = true;
    if (this.data) this.resetLimits();
    const parentResizeObserver = new ResizeObserver(this.render).observe(
      this.parent
    );
  }
  updateDimensions() {
    const style = window.getComputedStyle(this.chart);
    this.margin = sideStyleStringToObject(style.margin);
    this.padding = sideStyleStringToObject(style.padding);
    this.width = this.parent.offsetWidth;
    this.height = this.parent.offsetHeight;
    this.chart.setAttribute(
      "width",
      String(
        this.width -
          (this.margin.right +
            this.padding.right +
            this.margin.left +
            this.padding.left)
      )
    );
    this.chart.setAttribute(
      "height",
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

  eventOnAxis(event) {
    if (this.axes.x.boundary?.contains(event.target)) return "x";
    if (this.axes.y.boundary?.contains(event.target)) return "y";
    return undefined;
  }

  handleDoubleClick(event) {
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
      case "zoom":
        this.handleMouseDown_Zoom(event);
        return;
      case "integrate":
        this.handleMouseDown_Integrate(event);
        return;
      default:
        return;
    }
  }
  /**
   *
   * @param {PointerEvent} event
   */
  handleMouseLeave(event) {
    switch (this.interactionMode) {
      case "zoom":
        //        this.handleMouseLeave_Zoom(event);
        return;
      case "integrate":
        //this.handleMouseDown_Integrate(event)
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
  handleMouseDown_Axis(event, axis) {
    const point = { x: event.offsetX, y: event.offsetY };
    this.drag = {
      active: false,
      axis,
      start: point[axis],
      end: point[axis],
      limits: { ...this.limits },
      /**@type {Rectangle} */
      newLimits: { ...this.limits },
      pageOffset: {
        x: event.pageX - point.x,
        y: event.pageY - point.y,
      },
    };
    document.addEventListener("mousemove", this.handleMouseMove_Axis);
    document.addEventListener("mouseup", this.handleMouseUp_Axis.bind(this), {
      once: true,
    });
  }

  handleMouseMove_Axis(event) {
    this.drag.active = true;

    const axis = this.drag.axis;
    const pageOffset = this.drag.pageOffset;
    const point = {
      x: event.pageX - pageOffset.x,
      y: event.pageY - pageOffset.y,
    };

    this.drag.end = point[axis];

    const difference =
      axis == "x"
        ? this.drag.end - this.drag.start
        : this.drag.start - this.drag.end;

    const sourceB =
      axis == "x" ? this.plotDimensions.width : this.plotDimensions.height;

    const plotCoordDiff = xform.relativeOffset1D(
      difference,
      0,
      sourceB,
      ...this.drag.limits[axis]
    );

    /**@type {Rectangle} */
    this.drag.newLimits = {
      x: [...this.limits.x],
      y: [...this.limits.y],
      [axis]: this.drag.limits[axis].map((e) => e - plotCoordDiff),
    };

    this.setLimits(this.drag.newLimits, true);
  }
  handleMouseUp_Axis(event) {
    if (this.drag.active) this.setLimits(this.drag.newLimits);
    this.drag.active = false;
    document.removeEventListener("mousemove", this.handleMouseMove_Axis);
  }
  handleWheel_Axis(event, axis) {
    const scrollDirection = Math.sign(event.deltaY);
    const axisPlotCoord = this.chartScreenCoordinateToPlotCoordinate({
      x: event.offsetX,
      y: event.offsetY,
    })[axis];
    const scrollFactor = scrollDirection > 0 ? ZOOM_FACTOR : 1 / ZOOM_FACTOR;
    const newCoords = [
      (this.limits[axis][0] - axisPlotCoord * (1 - scrollFactor)) /
        scrollFactor,
      (this.limits[axis][1] - axisPlotCoord * (1 - scrollFactor)) /
        scrollFactor,
    ];
    const [, exponent] = getScientific(newCoords[1] - newCoords[0]);
    if (exponent < -10) return;
    this.limits[axis] = [...newCoords];
    this.render();
  }

  /**
   *
   * @param {PointerEvent} event
   */
  handleMouseDown_Zoom(event) {
    /**@type Point */
    const point = {
      x: event.offsetX - this.padding.left,
      y: event.offsetY - this.padding.top,
    };
    const pageOffset = { x: event.pageX - point.x, y: event.pageY - point.y };
    if (this.plot.element().contains(event.target)) {
      this.zoomRectangle.activate(point, this.plotDimensions, pageOffset);

      document.addEventListener("mouseup", this.handleMouseUp_Zoom, {
        once: true,
      });
      document.addEventListener("mousemove", this.handleMouseMove_Zoom);
    }
  }
  handleMouseMove_Zoom(event) {
    /**@type Point */
    const point = { x: event.pageX, y: event.pageY };

    this.zoomRectangle.update(point);
  }
  handleMouseUp_Zoom() {
    document.removeEventListener("mousemove", this.handleMouseMove_Zoom);

    const zoomCoords = this.zoomRectangle.coordinates;
    this.zoomRectangle.deactivate();
    if (
      zoomCoords.x[1] - zoomCoords.x[0] <= 1 ||
      zoomCoords.y[1] - zoomCoords.y[0] <= 1
    )
      return;

    const rectPlotCoords = {
      x: [
        zoomCoords.x[0] - this.plotDimensions.left,
        zoomCoords.x[1] - this.plotDimensions.left,
      ],
      y: [
        zoomCoords.y[0] - this.plotDimensions.top,
        zoomCoords.y[1] - this.plotDimensions.top,
      ],
    };
    const newLimits = xform.transformXYObj(
      rectPlotCoords,
      {
        x: [0, this.plotDimensions.width],
        y: [this.plotDimensions.height, 0],
      },
      this.limits
    );
    newLimits.y = newLimits.y.toSorted((a, b) => a - b);
    this.setLimits(newLimits);
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
      x: [click.x, click.x + 0.5],
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
    console.time("render");
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
      this.integrals
    );
    this.axes.x.render(this.plotDimensions, this.limits.x);
    this.axes.y.render(this.plotDimensions, this.limits.y);
    console.timeEnd("render");
    this.readyForAnimationFrame = true;
    if (this.onrender)
      this.onrender({
        target: this.chart,
        limits: this.limits,
        plotDimensions: this.plotDimensions,
        integrals: this.integrals,
      });
  }
  /**
   * Save the SVG Plot
   * @param {*} svgEl
   * @param {*} name
   */
  saveSvg(svgEl, name) {
    var svgData = svgEl.outerHTML;
    var preface = '<?xml version="1.0" standalone="no"?>\r\n';
    var svgBlob = new Blob([preface, svgData], {
      type: "image/svg+xml;charset=utf-8",
    });
    var svgUrl = URL.createObjectURL(svgBlob);
    var downloadLink = document.createElement("a");
    downloadLink.href = svgUrl;
    downloadLink.download = name;
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
  }
  /**
   *
   * @param {*} callback
   */
  addEventListener(type, callback) {
    if (type == "onrender") {
      this.onrender = callback;
    }
  }
}

export default Chart;
