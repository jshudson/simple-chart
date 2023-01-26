import data from './data.js'
import Chart from './chartClass.js'

const xyToObject = (data) => {
    return { x: data.map(x => x[0]), y: data.map(y => y[1]) }
}

const points = xyToObject(data);

const MyChart = new Chart(document.getElementById("graph"))

MyChart.addPlot(points);
MyChart.updatePlot()