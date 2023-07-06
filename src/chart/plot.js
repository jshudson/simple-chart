import * as svg from '../svgUtils/svgUtils.js';
import * as xform from './coordinateTransfer.js';
class Plot {
  constructor(parent, id, options) {
    this.id = id;

    // parent is the root svg
    this.parent = parent;
  }
  addGroup(dimensions) {
    this.group = this.parent.appendChild(
      svg.newElement('g', {
        id: `${this.id}-plot`,
        transform: `translate(${dimensions.left},${dimensions.top})`,
      })
    );
  }
  addClip(dimensions) {
    return this.group.appendChild(
      svg.clipRect(0, 0, dimensions.width, dimensions.height, {
        id: this.id + '-clip-path',
      })
    );
  }
  addOutline(dimensions) {
    return this.group.appendChild(
      svg.rect(0, 0, dimensions.width, dimensions.height, {
        fill: 'none',
        stroke: 'black',
      })
    );
  }
  addPath() {
    return this.group.appendChild(
      svg.newElement('path', {
        id: this.id + '-plot',
        class: 'plot',
        'clip-path': `url(#${this.id}-clip-path)`,
      })
    );
  }

  cull(scaledPoints, width) {

    let culled = true;
    while (culled) {
      culled = false;
      const length = scaledPoints.x.length;
      const acc = { x: [], y: [] };
      for (let i = 0; i < length - 2; i += 2) {
        if (scaledPoints.x[i + 2] > 0) {
          acc.x.push(scaledPoints.x[i]);
          acc.y.push(scaledPoints.y[i]);
          const curPoint = xform.extractPoint(scaledPoints, i);
          const midPoint = xform.extractPoint(scaledPoints, i + 1);
          const nextPoint = xform.extractPoint(scaledPoints, i + 2);
          const { m, b } = xform.line2Points(curPoint, nextPoint);

          const interpolated = midPoint.x * m + b;
          culled = true;
          if (Math.abs(interpolated - midPoint.y) >= 0.1) {
            acc.x.push(midPoint.x);
            acc.y.push(midPoint.y);
            culled = false;
          }
          if (curPoint.x > width) {
            culled = true;
            break;
          }
        }
      }
      if (acc.x[acc.x.length - 1] < width) {
        if (!(scaledPoints.x.length % 2)) {
          acc.x.push(scaledPoints.x[length - 2]);
          acc.y.push(scaledPoints.y[length - 2]);
        }
        acc.x.push(scaledPoints.x[length - 1]);
        acc.y.push(scaledPoints.y[length - 1]);
      }
      scaledPoints = { ...acc };
    }

    return scaledPoints;
  }
  linearInterpolatedPoint(points, x) {
    const match = points.x.findIndex((e) => e >= x);
    if (points.x[match] == x || match <= 0) {
      return {
        exact: true,
        match,
        x,
        y: points.y[match],
      };
    }
    const pointBefore = xform.extractPoint(points, match - 1);
    const pointAfter = xform.extractPoint(points, match);
    const { m, b } = xform.line2Points(pointBefore, pointAfter);
    return {
      exact: false,
      match,
      x,
      y: m * x + b,
    };
  }
  integral(scaledPoints, scaledPeaks) {
    const pointLength = scaledPoints.x.length;
    scaledPeaks.forEach((peak) => {
      if (
        (peak.x[0] > scaledPoints.x[pointLength - 1] &&
          peak.x[1] > scaledPoints.x[pointLength - 1]) ||
        (peak.x[0] < scaledPoints.x[0] && peak.x[1] < scaledPoints.x[0])
      ) {
        return;
      }
      const start = this.linearInterpolatedPoint(scaledPoints, peak.x[0]);
      let startPoints = { x: [peak.x[0]], y: [peak.y[0]] };
      startPoints.x.push(start.x);
      startPoints.y.push(start.y);

      const end = this.linearInterpolatedPoint(scaledPoints, peak.x[1]);
      let endPoints = { x: [], y: [] };
      if (end.match == -1) {
        endPoints.x.push(scaledPoints.x[pointLength - 1]);
        endPoints.y.push(scaledPoints.y[pointLength - 1]);
      } else {
        endPoints = { x: [end.x], y: [end.y] };
      }
      endPoints.x.push(peak.x[1]);
      endPoints.y.push(peak.y[1]);

      const filtered = {
        x: [
          ...startPoints.x,
          ...scaledPoints.x.slice(start.match, end.match),
          ...endPoints.x,
        ],
        y: [
          ...startPoints.y,
          ...scaledPoints.y.slice(start.match, end.match),
          ...endPoints.y,
        ],
      };

      this.group.appendChild(
        svg.newElement('path', {
          class: 'integral',
          'clip-path': `url(#${this.id}-clip-path)`,
          d: svg.pathStringXY(filtered),
        })
      );
    });
  }
  element() {
    return this.group;
  }
  render(limits, dimensions, points, integrals, cull = false) {
    if (this.group) this.group.remove();

    const targetRect = {
      x: [0, dimensions.width],
      y: [dimensions.height, 0],
    };

    this.addGroup(dimensions);

    this.addClip(dimensions);

    this.addOutline(dimensions);

    const pathElement = this.addPath();
    let scaledPoints = xform.transformXYObj(points, limits, targetRect);
    if (cull) scaledPoints = this.cull(scaledPoints, dimensions.width);

    const scaledIntegrals = integrals.map((e) => {
      return xform.transformXYObj(e, limits, targetRect);
    });

    this.integral(scaledPoints, scaledIntegrals);

    pathElement.setAttribute('d', svg.pathStringXY(scaledPoints));
  }
}
export default Plot;
