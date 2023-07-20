import Chart from './chart.js';
export default class ChartContainer {
  /**
   *
   * @param {HTMLElement} parent
   */
  constructor(id, parent) {
    this.parent = parent;

    this.data = [];
    this.charts = [];
    this.id = id;
    this.addContainer();
  }
  addContainer() {
    this.container = this.parent.appendChild(document.createElement('div'));
    this.container.setAttribute('class', 'chartContainer');
  }
  addData(data) {
    const newId = `${this.id}-${this.charts.length}`;

    const newContainer = this.container.appendChild(
      document.createElement('div')
    );
    newContainer.setAttribute('class', 'graph');
    newContainer.setAttribute('id', `container-${newId}`);

    const close = document.createElement('input');
    close.setAttribute('type', 'button');
    close.setAttribute('value', '×');
    close.setAttribute('class', 'chart-container-close');

    close.onclick = (e) => {
      const index = Number(
        close.parentElement.id.replace(`container-${this.id}`, '')
      );
      console.log(index)
      this.charts[index].chart.remove();
      close.parentElement.remove();
      this.charts.splice(index, 1);
      this.charts.forEach(({ container, chart }, i) => {
        container.setAttribute('id', `container-${this.id}-${i}`);
        chart.updateID(`${this.id}${i}`);
      });
    };
    newContainer.appendChild(close);

    const newChart = new Chart(`chart-${newId}`, newContainer, {
      data: data,
      cull: true,
    });

    this.charts.push({ container: newContainer, chart: newChart, data });
    this.charts.forEach(({ chart }) => {
      chart.addEventListener('render', (event) => {
        this.charts.forEach(({ chart }) => {
          if (chart.id != event.target.id) {
            chart.setLimits(event.limits, true, false);
          }
        });
      });
    });
  }
  render() {
    console.log('rendering');
    this.charts.forEach(({ chart }) => {
      chart.chart.render;
    });
  }
}
