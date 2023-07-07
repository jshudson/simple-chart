const SVGNS = 'http://www.w3.org/2000/svg';

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
  const element = newElement('path', combinedAttributes);
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
  const element = newElement('rect', combinedAttributes);
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
  const clip = newElement('clipPath', attributes);

  clip.appendChild(rect(x, y, width, height));
  return clip;
}
/**
 * Save the SVG Plot
 * @param {*} name
 */
export function saveSvg(element, name) {
  var preface = '<?xml version="1.0" standalone="no"?>\r\n';
  // async function getCSS() {
  //   const response = await fetch('./style.css');
  //   const text = await response.text();
  //   return text;
  // }
  // const css = await getCSS();
  const svgClone = element.cloneNode(true);
  const style = document.createElement('style');
  style.innerHTML = `
  
  svg {
    outline: 1px solid black;
    /* padding: 10px 50px;
    margin: 10px; */
    box-sizing: content-box;
  }
  
  svg text {
    font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
    font-size: 0.8em;
  }
  
  
  /* g {
      outline: 1px solid green;
  } */
  
  .integral {
    fill: #0074d9;
  }
  
  .graph {
    height: 300px;
    max-height: 1000px;
    resize: vertical;
    overflow: hidden;
    outline: 1px solid orange;
    margin-left: 100px;
    /* width: 100%; */
  }
  
  .plot {
    fill: none;
    stroke: #0074d9;
    stroke-width: 2px;
    stroke-linejoin: round;
  }
  
  .zoom {
    fill: none;
    stroke: blue;
    stroke-width: 1px;
  }
  
  .plot0 {
    stroke: green;
  }
  
  .plot1 {
    stroke: black;
  }
  
  /* #graph {
      outline: 1px solid green;
  } */
  
  .scroll-drag-horiz:hover {
    cursor: url("./assets/cursors/grab-scroll-horiz.svg") 16 16, pointer;
  }
  
  .scroll-drag-vert:hover {
    cursor: url("./assets/cursors/grab-scroll-vert.svg") 16 16, pointer;
  }
  `;
  //@ts-ignore
  svgClone.prepend(style);
  //@ts-ignore
  var svgData = svgClone.outerHTML;
  var svgBlob = new Blob([preface, svgData], {
    type: 'image/svg+xml;charset=utf-8',
  });
  var svgUrl = URL.createObjectURL(svgBlob);
  var downloadLink = document.createElement('a');
  downloadLink.href = svgUrl;
  downloadLink.download = name;
  document.body.appendChild(downloadLink);
  downloadLink.click();
  document.body.removeChild(downloadLink);
}
