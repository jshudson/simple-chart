//@ts-nocheck
import exported from "./data.js";
const { data, data2 } = exported;
// import Chart from './src/chart/chartClassNew.js'
import Chart from "./src/chart/chart.js";
import * as svg from "./src/svgUtils/svgUtils.js";

import { base64ArrayBuffer } from "./src/utils/utils.js";

const fileInput = document.getElementById("file");
const checkBox = document.getElementById("mode");

checkBox.onchange = (event) => {
  console.log(event.target.checked);
  chart.setMode(event.target.checked ? "integrate" : "zoom");
};

fileInput.onchange = () => {
  document.getElementById("graph").innerHTML = "";
  const file = fileInput.files[0];
  Papa.parse(file, {
    dynamicTyping: true,
    skipEmptyLines: true,
    complete: function (results) {
      console.log(results.data);
      const data3 = results.data.slice(4, results.data.length);
      const points = xyToObject(data3);

      chart = new Chart("graphtest", document.getElementById("graph"), {
        data: [points],
      });
    },
  });
};

const xyToObject = (data) => {
  return { x: data.map((x) => x[0]), y: data.map((y) => y[1]) };
};
const points = xyToObject(data);

let chart = new Chart("graphtest", document.getElementById("graph"), {
  data: [points],
});

let chart2 = new Chart("graphtest", document.getElementById("graph2"), {
  data: [points],
});
chart.addEventListener("onrender", (event) => {
  chart2.setLimits(event.limits, true);
});
