import * as svg from '../svgUtils/svgUtils.js';

class Plot {
  constructor(parent, points, options) {
    console.log(points)
    this.points = { ...points }
    this.parent = parent
    this.width = parent.width
    this.height = parent.height
    this.element = svg.pathXY(points)
    this.parent.appendChild(this.element)
  }
  setLimits(limits) {
    this.limits = { ...limits }
    this.redraw()
  }
  redraw() {

  }
}
export default Plot