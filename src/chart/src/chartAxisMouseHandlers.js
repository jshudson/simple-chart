import * as xform from './coordinateTransfer.js';
import { getScientific } from '../../utils/utils.js';

//Methods are not direct event handlers.  Events are passed from a parent handler

const ZOOM_FACTOR = 1.5;

/**
 * Initiate drag interactions on an axis
 * @param {PointerEvent} event
 * @param {String} axis
 */
export function handleMouseDown_Axis(event, axis) {
  if (event.buttons != 1 && event.buttons != 2) {
    return;
  }
  const point = { x: event.offsetX, y: event.offsetY };
  this.drag = {
    axis,
    start: point[axis],
    end: point[axis],
    //@ts-ignore
    limits: { ...this.limits },
    /**@type {Rectangle} */
    //@ts-ignore
    newLimits: { ...this.limits },
    pageOffset: {
      x: event.pageX - point.x,
      y: event.pageY - point.y,
    },
  };
  //@ts-ignore
  document.addEventListener('mousemove', this.handleMouseMove_Axis);

  //@ts-ignore
  document.addEventListener('mouseup', this.handleMouseUp_Axis, {
    once: true,
  });
}

export function handleMouseMove_Axis(event) {
  const axis = this.drag.axis;
  const pageOffset = this.drag.pageOffset;
  const point = {
    x: event.pageX - pageOffset.x,
    y: event.pageY - pageOffset.y,
  };

  this.drag.end = point[axis];

  const difference =
    axis == 'x'
      ? this.drag.end - this.drag.start
      : this.drag.start - this.drag.end;

  const sourceB =
    axis == 'x' ? this.plotDimensions.width : this.plotDimensions.height;

  const plotCoordDiff = xform.relativeOffset1D(
    difference,
    0,
    sourceB,
    ...this.drag.limits[axis]
  );
  if (event.buttons == 1) {
    //Left Button
    /**@type {Rectangle} */
    this.drag.newLimits = {
      x: [...this.limits.x],
      y: [...this.limits.y],
      [axis]: this.drag.limits[axis].map((e) => e - plotCoordDiff),
    };
  } else {
    //Right Button
    const clickA = axis == 'x' ? 0 : sourceB;
    const clickB = axis == 'x' ? sourceB : 0;
    const clickPoint = xform.transform1D(
      this.drag.start -
        (axis == 'x' ? this.plotDimensions.left : this.plotDimensions.top),
      clickA,
      clickB,
      ...this.drag.limits[axis]
    );
    const newLimit = xform.transform1D(
      this.drag.limits[axis][1],
      this.drag.limits[axis][0],
      clickPoint + plotCoordDiff,
      this.drag.limits[axis][0],
      clickPoint
    );
    if (newLimit > this.drag.limits[axis][0]) {
      /**@type {Rectangle} */
      this.drag.newLimits = {
        x: [...this.limits.x],
        y: [...this.limits.y],
        [axis]: [this.drag.limits[axis][0], newLimit],
      };
    }
  }
  // this.drag.newLimits.y = [...this.fullYScale().y];
  this.setLimits(this.drag.newLimits, true);
}

/**
 * Remove listener from mousedown event
 * @param {PointerEvent} event
 */
export function handleMouseUp_Axis(event) {
  document.removeEventListener('mousemove', this.handleMouseMove_Axis);
}

/**
 * Zoom in centered on pointer scroll
 * @param {WheelEvent} event
 * @param {String} axis
 */
export function handleWheel_Axis(event, axis) {
  const scrollDirection = Math.sign(event.deltaY);
  const axisPlotCoord = this.chartScreenCoordinateToPlotCoordinate({
    x: event.offsetX,
    y: event.offsetY,
  })[axis];
  const scrollFactor = scrollDirection > 0 ? ZOOM_FACTOR : 1 / ZOOM_FACTOR;
  const newCoords = [
    (this.limits[axis][0] - axisPlotCoord * (1 - scrollFactor)) / scrollFactor,
    (this.limits[axis][1] - axisPlotCoord * (1 - scrollFactor)) / scrollFactor,
  ];
  const [, exponent] = getScientific(newCoords[1] - newCoords[0]);
  if (exponent < -10) return;
  this.limits[axis] = [...newCoords];
  this.render();
}
