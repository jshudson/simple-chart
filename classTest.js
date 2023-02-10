import exported from './data.js'
const { data, data2 } = exported
import Chart from './chartClass.js'
import { base64ArrayBuffer } from './utils.js'

const xyToObject = (data) => {
    return { x: data.map(x => x[0]), y: data.map(y => y[1]) }
}

const points = xyToObject(data2);

console.log(data2.flatMap(x => x))
const x = new Float64Array(data2.flatMap(num => num))

console.log(base64ArrayBuffer(x.buffer))





const points2 = xyToObject(data);
const MyChart = new Chart(document.getElementById("graph"))

MyChart.addPlot(points);
MyChart.addPlot(points2);
MyChart.resetPlot();
MyChart.updatePlot()