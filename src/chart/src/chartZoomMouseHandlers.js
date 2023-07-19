import * as xform from './coordinateTransfer.js';

//Methods are not direct event handlers.  Events are passed from a parent handler

/**
 * Initiate the mouse handlers for zooming
 * @param {PointerEvent} event
 */
export function handleMouseDown_Zoom(event) {
  /**@type Point */
  const point = {
    x: event.offsetX - this.padding.left,
    y: event.offsetY - this.padding.top,
  };
  const pageOffset = { x: event.pageX - point.x, y: event.pageY - point.y };
  if (this.plot.element().contains(event.target)) {
    this.zoomRectangle.activate(point, this.plotDimensions, pageOffset);

    document.addEventListener('mouseup', this.handleMouseUp_Zoom, {
      once: true,
    });
    document.addEventListener('mousemove', this.handleMouseMove_Zoom);
  }
}

/**
 * Update the zoom rectangle
 * @param {PointerEvent} event 
 */
export function handleMouseMove_Zoom(event) {
  /**@type Point */
  const point = { x: event.pageX, y: event.pageY };

  this.zoomRectangle.update(point);
}

/**
 * Update the chart zoom from the zoom rectangle
 */
export function handleMouseUp_Zoom() {

  document.removeEventListener('mousemove', this.handleMouseMove_Zoom);

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
    this.paddedLimits
  );
  newLimits.y = newLimits.y.toSorted((a, b) => a - b);
  this.setLimits(newLimits);
}
