import * as svg from "../svgUtils/svgUtils.js";

export default class ZoomRectangle {
  /**
   * @param {SVGElement} parent
   */
  constructor(parent) {
    this.render = this.render.bind(this);
    this.parent = parent;
    /**@type Rectangle */
    this.rectangle = {
      x: [0, 0],
      y: [0, 0],
    };
    /**@type Point */
    this.firstPoint = {
      x: 0,
      y: 0,
    };
    this.element = undefined;
    this.readyForAnimationFrame = false;
    this.nextAnimation = 0;
  }

  get coordinates() {
    return this.rectangle;
  }
  /**
   *
   * @param {Point} point
   */
  activate(point, plotDimensions, pageOffset) {
    this.rectLimits = { ...plotDimensions };
    this.firstPoint = { ...point };
    this.rectangle = {
      x: [point.x, point.x],
      y: [point.y, point.y],
    };
    this.pageOffset = { ...pageOffset };
    this.readyForAnimationFrame = true;
    this.render();
  }
  /**
   *
   * @param {Point} point
   */
  update(point) {
    const offsetPoint = {
      x: point.x - this.pageOffset.x,
      y: point.y - this.pageOffset.y,
    };
    this.rectangle = {
      x: [
        Math.max(
          this.rectLimits.left,
          Math.min(this.firstPoint.x, offsetPoint.x)
        ),
        Math.min(
          this.rectLimits.width + this.rectLimits.left,
          Math.max(this.firstPoint.x, offsetPoint.x)
        ),
      ],
      y: [
        Math.max(
          this.rectLimits.top,
          Math.min(this.firstPoint.y, offsetPoint.y)
        ),
        Math.min(
          this.rectLimits.height + this.rectLimits.top,
          Math.max(this.firstPoint.y, offsetPoint.y)
        ),
      ],
    };
    if (this.readyForAnimationFrame) {
      this.readyForAnimationFrame = false;
      this.nextAnimation = window.requestAnimationFrame(this.render);
    }
  }

  deactivate() {
    if (this.nextAnimation) window.cancelAnimationFrame(this.nextAnimation);
    if (this.element) this.element.remove();
    this.enabled = false;
  }
  render() {
    if (this.element) this.element.remove();
    this.element = this.parent.appendChild(
      svg.rect(
        this.rectangle.x[0],
        this.rectangle.y[0],
        this.rectangle.x[1] - this.rectangle.x[0],
        this.rectangle.y[1] - this.rectangle.y[0],
        { class: "zoom" }
      )
    );
    this.readyForAnimationFrame = true;
  }
}
