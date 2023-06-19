import * as svg from '../svgUtils/svgUtils.js';
import * as xform from './coordinateTransfer.js';

class Plot {
  constructor(parent, id, options) {
    this.id = id

    // parent is the root svg
    this.parent = parent
  }
  addGroup(dimensions) {
    this.group = this.parent.appendChild(
      svg.newElement('g',
        {
          id: this.id,
          transform: `translate(${dimensions.left},${dimensions.top})`
        }
      )
    )
  }
  addClip(dimensions) {
    return this.group.appendChild(
      svg.clipRect(0, 0, dimensions.width, dimensions.height,
        { id: this.id + '-clip-path' })
    )

  }
  addOutline(dimensions) {
    return this.group.appendChild(
      svg.rect(0, 0, dimensions.width, dimensions.height, {
        fill: 'none',
        stroke: 'black'
      })
    )
  }
  addPath() {
    return this.group.appendChild(
      svg.newElement('path',
        {
          id: this.id + '-plot',
          class: 'plot',
          "clip-path": `url(#${this.id}-clip-path)`
        })
    )
  }
  getPathString(limits, points, dimensions) {
    console.log(points, dimensions, limits)
    const scaledPoints = xform.transformXYObj(points,
      limits,
      { x: [0, dimensions.width], y: [dimensions.height, 0] }
    )

    return svg.pathStringXY((scaledPoints))
  }
  cull(scaledPoints) {
    const acc = { x: [], y: [] }

    for (let i = 0; i < scaledPoints.x.length; i++) {
      //find line
      //check if first point
      if (scaledPoints.x[i] < 0) { }
      if (i == 0 || (scaledPoints.x[i] - acc.x[acc.x.length - 1]) >= 1) {
        acc.x.push(scaledPoints.x[i])
        acc.y.push(scaledPoints.y[i])
      }

    }

    return acc;
  }
  redraw(limits, dimensions, points) {
    if (this.group) this.group.remove()

    this.addGroup(dimensions)

    this.addClip(dimensions)

    this.addOutline(dimensions)

    const pathElement = this.addPath()
    const newPath = this.getPathString(limits, points, dimensions)
    pathElement.setAttribute("d", newPath)
  }
}
export default Plot