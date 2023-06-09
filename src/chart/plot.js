import * as svg from '../svgUtils/svgUtils.js';
import * as xform from './coordinateTransfer.js';

class Plot {
  constructor(parent, points, id, options) {
    this.id = id

    //remove later
    this.width = options.width
    this.height = options.height
    this.left = options.left;
    this.top = options.top;

    this.points = { ...points }

    // parent is the root svg
    this.parent = parent

    // create the plot group
    this.group = this.parent.appendChild(
      svg.newElement('g',
        {
          id: this.id,
          transform: `translate(${options.left},${options.top})`,
          "clip-path": `url(#${this.id}-clip-path)`
        }
      )
    )

    this.clip = this.group.appendChild(
      svg.clipRect(0, 0, options.width, options.height,
        { id: this.id + '-clip-path' })
    )

    this.path = this.group.appendChild(
      svg.newElement('path',
        {
          id: this.id + '-plot',
          class: 'plot',
        })
    )

    if (options?.limits) {
      this.setLimits(options.limits)
    }
  }

  setLimits(limits) {
    this.limits = { ...limits }
    this.redraw()
  }
  getPathString() {
    const scaledPoints = xform.transformXYObj(this.points,
      this.limits,
      { x: [0, this.width], y: [this.height, 0] }
    )
    return svg.pathStringXY(scaledPoints)
  }
  redraw() {
    const newPath = this.getPathString()
    this.path.setAttribute("d", newPath)
  }
}
export default Plot