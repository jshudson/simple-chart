export function transform1D(value, sourceA, sourceB, targetA, targetB) {
  return (
    ((value - sourceA) * (targetB - targetA)) / (sourceB - sourceA) + targetA
  );
}

export function relativeOffset1D(offset, sourceA, sourceB, targetA, targetB) {
  return (offset / (sourceB - sourceA)) * (targetB - targetA);
}

export function transform2D(point, sourceRect, targetRect) {
  const {
    x: [sx1, sx2],
    y: [sy1, sy2],
  } = sourceRect;
  const {
    x: [tx1, tx2],
    y: [ty1, ty2],
  } = targetRect;
  return {
    x: transform1D(point.x, sx1, sx2, tx1, tx2),
    y: transform1D(point.y, sy1, sy2, ty1, ty2),
  };
}
export function transform1DArray(points, sourceA, sourceB, targetA, targetB) {
  return points.map((e) => transform1D(e, sourceA, sourceB, targetA, targetB));
}

/**
 * Tranform an object of points in the form
 * @param {Object} points - collection of xy data
 * @param {number[]} points.x - list of x values
 * @param {number[]} points.y - list of y values
 * @param {Object} sourceRect
 * @param {number[]} sourceRect.x
 * @param {number[]} sourceRect.y
 * @param {Object} targetRect
 * @param {number[]} targetRect.x
 * @param {number[]} targetRect.y
 * @returns {Object} - collection of xy data
 */
export function transformXYObj(points, sourceRect, targetRect) {
  const {
    x: [sx1, sx2],
    y: [sy1, sy2],
  } = sourceRect;
  const {
    x: [tx1, tx2],
    y: [ty1, ty2],
  } = targetRect;

  return {
    x: transform1DArray(points.x, sx1, sx2, tx1, tx2),
    y: transform1DArray(points.y, sy1, sy2, ty1, ty2),
  };
}
export function line2Points(point1, point2) {
  const m = (point2.y - point1.y) / (point2.x - point1.x);
  const b = point1.y - m * point1.x;
  return { m, b };
}
export function extractPoint(points, index) {
  return {
    x: points.x[index],
    y: points.y[index],
  };
}
