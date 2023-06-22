import exported from './data.js'
const { data, data2 } = exported
// import Chart from './src/chart/chartClassNew.js'
import Chart from './src/chart/chart.js'
import * as svg from './src/svgUtils/svgUtils.js'

import { base64ArrayBuffer } from './src/utils/utils.js'

const fileInput = document.getElementById('file')


fileInput.onchange = () => {
    document.getElementById('graph').innerHTML=''
    const file = fileInput.files[0]
    Papa.parse(file, {
        dynamicTyping: true,
        skipEmptyLines: true,
        complete: function (results) {
            console.log(results.data)
            const data3 = results.data.slice(4, results.data.length);
            const points = xyToObject(data3);
            
            const chart = new Chart("graphtest", document.getElementById('graph'), { data: [points] })
        }
    });
}

const xyToObject = (data) => {
    return { x: data.map(x => x[0]), y: data.map(y => y[1]) }
}
const points = xyToObject(data);
            
const chart = new Chart("graphtest", document.getElementById('graph'), { data: [points] })

// setTimeout(() => {
//     console.log('update')
//     chart.update()
// }, 1000)
