const SVGNS = "http://www.w3.org/2000/svg";

export function newElement(tagName, attributes) {
  const element = document.createElementNS(SVGNS, tagName);
  Object.keys(attributes).forEach((key) => {
    element.setAttribute(key, attributes[key]);
  });
  return element;
}

export function append(parent, type, attributes) {
  return parent.appendChild(newElement(type, { ...attributes }));
}

/**
 * Get a path string for an x y list object
 * @param {XYData} points
 * @returns {string} SVG Path String
 */
export function pathStringXY(points) {
  let path = `M${points.x[0]},${points.y[0]}`;
  for (let i = 1; i < points.x.length; i++) {
    path += `L${points.x[i]},${points.y[i]}`;
  }
  return path;
}

/**
 * Get and SVG Path Element based on an x y list object.  Additional attributes can be added with an attribute object.
 * @param {XYData} points
 * @param {Object} attributes
 * @returns {SVGPathElement} SVG Path Element
 */

export function pathXY(points, attributes) {
  const combinedAttributes = {
    ...attributes,
    d: pathStringXY(points),
  };
  const element = newElement("path", combinedAttributes);
  return element;
}

/**
 * Get an SVG rect element.  Extra attributes (rx, ry, etc) can be added as an attribute object
 * @param {number} x
 * @param {number} y
 * @param {number} width
 * @param {number} height
 * @param {Object} attributes
 * @returns {SVGRectElement}
 */

export function rect(x, y, width, height, attributes) {
  const combinedAttributes = {
    ...attributes,
    x,
    y,
    width,
    height,
  };
  const element = newElement("rect", combinedAttributes);
  return element;
}

/**
 *
 * @param {*} x
 * @param {*} y
 * @param {*} width
 * @param {*} height
 * @param {*} attributes
 * @returns {SVGClipPathElement}
 */
export function clipRect(x, y, width, height, attributes) {
  const clip = newElement("clipPath", attributes);

  clip.appendChild(rect(x, y, width, height));
  return clip;
}
