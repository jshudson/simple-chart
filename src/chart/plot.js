import * as svg from "../svgUtils/svgUtils.js";
import * as xform from "./coordinateTransfer.js";
class Plot {
  constructor(parent, id, options) {
    this.id = id;

    // parent is the root svg
    this.parent = parent;
  }
  addGroup(dimensions) {
    this.group = this.parent.appendChild(
      svg.newElement("g", {
        id: this.id,
        transform: `translate(${dimensions.left},${dimensions.top})`,
      })
    );
  }
  addClip(dimensions) {
    return this.group.appendChild(
      svg.clipRect(0, 0, dimensions.width, dimensions.height, {
        id: this.id + "-clip-path",
      })
    );
  }
  addOutline(dimensions) {
    return this.group.appendChild(
      svg.rect(0, 0, dimensions.width, dimensions.height, {
        fill: "none",
        stroke: "black",
      })
    );
  }
  addPath() {
    return this.group.appendChild(
      svg.newElement("path", {
        id: this.id + "-plot",
        class: "plot",
        "clip-path": `url(#${this.id}-clip-path)`,
      })
    );
  }

  cull(scaledPoints) {
    const acc = { x: [], y: [] };

    for (let i = 0; i < scaledPoints.x.length; i++) {
      //find line
      //check if first point
      if (scaledPoints.x[i] < 0) {
      }
      if (i == 0 || scaledPoints.x[i] - acc.x[acc.x.length - 1] >= 1) {
        acc.x.push(scaledPoints.x[i]);
        acc.y.push(scaledPoints.y[i]);
      }
    }

    return acc;
  }
  integral(limits, dimensions, points, peaks) {
    peaks.forEach((peak) => {
      const start = points.x.findIndex((e) => e >= peak.x[0]);
      const end = points.x.findIndex((e) => e > peak.x[1]);
      const filtered = {
        x: [peak.x[0], ...points.x.slice(start, end + 1), peak.x[1]],
        y: [peak.y[0], ...points.y.slice(start, end + 1), peak.y[1]],
      };
      const scaledPoints = xform.transformXYObj(filtered, limits, {
        x: [0, dimensions.width],
        y: [dimensions.height, 0],
      });
      this.group.appendChild(
        svg.newElement("path", {
          class: "integral",
          "clip-path": `url(#${this.id}-clip-path)`,
          d: svg.pathStringXY(scaledPoints),
        })
      );
    });
  }
  element() {
    return this.group;
  }
  render(limits, dimensions, points, integrals) {
    if (this.group) this.group.remove();

    this.addGroup(dimensions);

    this.addClip(dimensions);

    this.addOutline(dimensions);

    this.integral(limits, dimensions, points, integrals);

    const pathElement = this.addPath();
    const scaledPoints = xform.transformXYObj(points, limits, {
      x: [0, dimensions.width],
      y: [dimensions.height, 0],
    });
    pathElement.setAttribute("d", svg.pathStringXY(scaledPoints));
  }
}
export default Plot;
