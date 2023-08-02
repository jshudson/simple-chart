//@ts-nocheck
import exported from './data.js';
const { data } = exported;

import SplitDiv from './src/splitDiv/src/splitDiv.js';
import ChartContainer from './src/chartContainer/src/chartContainer.js';

import Chart from './src/chart/index.js';
import * as svg from './src/chart/src/svgUtils.js';

import { base64ArrayBuffer } from './src/utils/utils.js';

const root = new SplitDiv(document.getElementById('root'), 'horizontal');
fetch('./navPanel/navPanel.html')
.then(response => response.text())
.then(text => {
  root.first.innerHTML = text;
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
  
  fileInput.onchange = (e) => {
    if (e.target.files.length < 1) return;
    Array.from(fileInput.files).forEach((file) => {
      if (file.type != 'text/csv') return;
      Papa.parse(file, {
        dynamicTyping: true,
        skipEmptyLines: true,
        complete: function (results) {
          const data3 = results.data.slice(4, results.data.length);
          const points = xyToObject(data3);
          container.addData({ ...points });
        },
      });
    });
    e.target.value = '';
  };

})

// let splitDiv = new SplitDiv(root.second, 'vertical');
let container = new ChartContainer('default', root.containers[1]);

const xyToObject = (data) => {
  return { x: data.map((x) => x[0]), y: data.map((y) => y[1]) };
};


