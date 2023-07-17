//@ts-nocheck
import exported from './data.js';
const { data, data2 } = exported;

import SplitDiv from './src/splitDiv/src/splitDiv.js';
import ChartContainer from './src/chart/src/chartContainer.js';

import Chart from './src/chart/index.js';
import * as svg from './src/chart/src/svgUtils.js';

import { base64ArrayBuffer } from './src/utils/utils.js';

const fileInput = document.getElementById('file');
const checkBox = document.getElementById('mode');
const save = document.getElementById('save');
save.onclick = () => {
  chart.saveSvg('test');
};
checkBox.onchange = (event) => {
  console.log(event.target.checked);
  chart.setMode(event.target.checked ? 'integrate' : 'zoom');
};

fileInput.onchange = () => {
  const file = fileInput.files[0];
  Papa.parse(file, {
    dynamicTyping: true,
    skipEmptyLines: true,
    complete: function (results) {
      const data3 = results.data.slice(4, results.data.length);
      const points = xyToObject(data3);
      chart.data = { ...points };
      chart.resetLimits();
    },
  });
};

const xyToObject = (data) => {
  return { x: data.map((x) => x[0]), y: data.map((y) => y[1]) };
};
const points = xyToObject(data);

// let chart = new Chart('1', document.getElementById('graph'), {
//   data: points,
//   cull: true,
// });

// const test = await fetch('./119188-3.csv');
// const testData = await test.text();
// let points2;
// Papa.parse(testData, {
//   dynamicTyping: true,
//   skipEmptyLines: true,
//   complete: function (results) {
//     console.log(results.data);
//     const newData = results.data.slice(4, results.data.length);
//     points2 = xyToObject(newData);
//   },
// });

// let chart2 = new Chart('2', document.getElementById('graph2'), {
//   data: points2,
// });
// chart.addEventListener('onrender', (event) => {
//   chart2.setLimits(event.limits, true);
// });

let splitDiv = new SplitDiv(document.getElementById('graph'),'horizontal')
// let container = new ChartContainer('first',splitDiv.containers[0])
// container.addData(points);


let container2 = new ChartContainer('second',splitDiv.containers[1])
container2.addData(points);
// container2.addData(points);
// container2.addData(points);
// container2.addData(points);

/**
 * Gets styles by a classname
 *
 * @notice The className must be 1:1 the same as in the CSS
 * @param string className_
 */
function getStyle(className_) {
  for (const sheet of window.document.styleSheets) {
    console.log(sheet);
    for (const cssClass of sheet.cssRules) {
      if (cssClass.selectorText == className_) {
        let returnValue;
        if (cssClass.cssText) {
          returnValue = cssClass.cssText;
        } else {
          returnValue = cssClass.style.cssText;
        }
        if (returnValue.indexOf(cssClass.selectorText) == -1) {
          returnValue = cssClass.selectorText + '{' + ret + '}';
        }
        return returnValue;
      }
    }
  }
}

// console.log(getStyle(".graphmargin"));

/**
 * Convert absolute CSS numerical values to pixels.
 *
 * @link https://developer.mozilla.org/en-US/docs/Learn/CSS/Building_blocks/Values_and_units#numbers_lengths_and_percentages
 *
 * @param {string} cssValue
 * @param {null|HTMLElement} target Used for relative units.
 * @return {*}
 */
window.convertCssUnit = function (cssValue, target) {
  target = target || document.body;

  const supportedUnits = {
    // Absolute sizes
    px: (value) => value,
    cm: (value) => value * 38,
    mm: (value) => value * 3.8,
    q: (value) => value * 0.95,
    in: (value) => value * 96,
    pc: (value) => value * 16,
    pt: (value) => value * 1.333333,

    // Relative sizes
    rem: (value) =>
      value * parseFloat(getComputedStyle(document.documentElement).fontSize),
    em: (value) => value * parseFloat(getComputedStyle(target).fontSize),
    vw: (value) => (value / 100) * window.innerWidth,
    vh: (value) => (value / 100) * window.innerHeight,

    // Times
    ms: (value) => value,
    s: (value) => value * 1000,

    // Angles
    deg: (value) => value,
    rad: (value) => value * (180 / Math.PI),
    grad: (value) => value * (180 / 200),
    turn: (value) => value * 360,
  };

  // Match positive and negative numbers including decimals with following unit
  const pattern = new RegExp(
    `^([\-\+]?(?:\\d+(?:\\.\\d+)?))(${Object.keys(supportedUnits).join('|')})$`,
    'i'
  );

  // If is a match, return example: [ "-2.75rem", "-2.75", "rem" ]
  const matches = String.prototype.toString
    .apply(cssValue)
    .trim()
    .match(pattern);

  if (matches) {
    const value = Number(matches[1]);
    const unit = matches[2].toLocaleLowerCase();

    // Sanity check, make sure unit conversion function exists
    if (unit in supportedUnits) {
      return supportedUnits[unit](value);
    }
  }

  return cssValue;
};

// console.log(convertCssUnit("1em", document.getElementById("graph")));
