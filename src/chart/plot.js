import * as svg from '../svgUtils/svgUtils.js';
import * as xform from './coordinateTransfer.js';

class Plot {
  constructor(parent, points, options) {
    this.plotId = "pltID"

    //remove later
    options.width = this.width = 300;
    options.height = this.height = 200;
    options.left = 30;
    options.top = 15;

    this.points = { ...points }

    // parent is the root svg
    this.parent = parent

    // create the plot group
    this.group = this.parent.appendChild(
      svg.newElement('g',
        {
          id: this.plotId,
          transform: `translate(${options.left},${options.top})`,
          "clip-path": `url(#${this.plotId}-clip-path)`
        }
      )
    )

    this.clip = this.group.appendChild(
      svg.clipRect(0, 0, options.width, options.height,
        { id: this.plotId + '-clip-path' })
    )

    this.path = this.group.appendChild(
      svg.newElement('path',
        {
          id: this.plotId + '-plot',
          class: 'plot',
        })
    )

    if (options?.limits) {
      this.setLimits(options.setLimits)
    } else {
      this.setLimits(
        {
          x: [this.points.x[0], this.points.x[this.points.x.length - 1]],
          y: [Math.max(...this.points.y), Math.min(...this.points.y)]
        }
      )
    }
  }

  setLimits(limits) {
    this.limits = { ...limits }
    this.redraw()
  }
  getPathString() {
    const scaledPoints = xform.transformXYObj(this.points,
      this.limits,
      { x: [0, this.width], y: [0, this.height] }
    )
    return svg.pathStringXY(scaledPoints)
  }
  redraw() {
    const newPath = this.getPathString()
    this.path.setAttribute("d", newPath)
  }
}
export default Plot