import Chart from './chart.js';
export default class ChartContainer {
  /**
   *
   * @param {HTMLElement} parent
   */
  constructor(id, parent) {
    this.parent = parent;
    this.container = this.parent.appendChild(document.createElement('div'));
    this.container.setAttribute('class', 'chartContainer');
    this.data = [];
    this.charts = [];
    this.id = id;
  }
  addData(data) {
    this.data.push(data);
    const newContainer = this.container.appendChild(
      document.createElement('div')
    );
    newContainer.setAttribute('class', 'graph');
    const newChart = new Chart(
      this.id + String(this.data.length - 1),
      newContainer,
      {
        data: data,
        cull: true,
      }
    );

    // chart.addEventListener('onrender', (event) => {
    //   chart2.setLimits(event.limits, true);
    // });
    this.charts.push(newChart);
    this.charts.forEach((chart) => {
      chart.addEventListener('render', (event) => {
        this.charts.forEach((chart) => {
          if (chart.id != event.target.id) {
            chart.setLimits(event.limits, true, false);
          }
        });
      });
    });
    const afunction = (e) => {
      console.log(e);
    };
    if (this.charts.length == 1) {
      this.charts[0].addEventListener('click', afunction);
      this.charts[0].removeEventListener('click', afunction);
    }
  }
  render() {
    this.data.forEach((data, i) => {
      this.charts[i].render;
    });
  }
}
