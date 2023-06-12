import exported from './data.js'
const { data, data2 } = exported
// import Chart from './src/chart/chartClassNew.js'
import Chart from './src/chart/chart.js'

import { base64ArrayBuffer } from './src/utils/utils.js'

const xyToObject = (data) => {
    return { x: data.map(x => x[0]), y: data.map(y => y[1]) }
}

const points = xyToObject(data);

const chart = new Chart("graphtest", document.getElementById('graph'), { data: [points] })
// setTimeout(() => {
//     console.log('update')
//     chart.update()
// }, 1000)
