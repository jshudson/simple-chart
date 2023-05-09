const SVGNS = 'http://www.w3.org/2000/svg'

export function newSVGElement(tagName, attributes) {
    const element = document.createElementNS(SVGNS, tagName)
    Object.keys(attributes).forEach(key => {
        element.setAttribute(key, attributes[key])
    })
    return element;
}

export function append(parent, type, id, attributes) {
    return parent.appendChild(
        newSVGElement(type, { id, ...attributes })
    )
}


/**
 * Get a path string for an x y list object
 * @param {number[]} points.x
 * @param {number[]} points.y
 * @returns {string} SVG Path String
 */
function pathStringXY(points) {
    let path = `M${points.x[0]},${points.y[0]}`;
    for (let i = 0; i < path.length; i++) {
        path += `L${points.x[i]},${points.y[i]}`;
    }
    return path
}

/**
 * Get and SVG Path Element based on an x y list object.  Additional attributes can be added with an attribute object.
 * @param {number[]} points.x
 * @param {number[]} points.y
 * @param {Object} attributes
 * @returns {element} SVG Path Element
 */

export function pathXY(points, attributes) {
    const combinedAttributes = {
        ...attributes,
        d: pathStringXY(points)
    }
    const element = newSVGElement('path', combinedAttributes, SVGNS)
    return element;
}

/**
 * Get an SVG rect element.  Extra attributes (rx, ry, etc) can be added as an attribute object
 * @param {number} x
 * @param {number} y
 * @param {number} width
 * @param {number} height
 * @param {Object} attributes
 * @returns
 */

export function rect(x, y, width, height, attributes) {
    const combinedAttributes = {
        ...attributes,
        x,
        y,
        width,
        height
    }
    const element = newSVGElement('rect', combinedAttributes, SVGNS)
    return element;
}

export function clipRect(x, y, width, height, attributes) {
    const clip = newSVGElement('clipPath', attributes)
    id = attribute?.id + 'clip-rect'
    clip.appendChip(
        //rect(x, y, width, height,{id: attributes?id})
    )
}