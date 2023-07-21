import Chart from './chart.js';
export default class ChartContainer {
  /**
   *
   * @param {HTMLElement} parent
   */
  constructor(id, parent, mode) {
    this.parent = parent;

    this.charts = [];
    this.id = id;
    this.mode = 'normalized';
    this.addContainer();
  }
  addContainer() {
    this.container = this.parent.appendChild(document.createElement('ul'));
    this.container.setAttribute('class', 'chartContainer');
  }
  setMode(mode) {}
  addData(data) {
    const newId = `${this.id}-${this.charts.length}`;

    const newContainer = this.container.appendChild(
      document.createElement('li')
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
      console.log(index);
      this.charts[index].chart.remove();
      close.parentElement.remove();
      this.charts.splice(index, 1);
      this.charts.forEach(({ container, chart }, i) => {
        container.setAttribute('id', `container-${this.id}-${i}`);
        chart.updateID(`${this.id}${i}`);
      });
    };
    newContainer.appendChild(close);
    const normalizedData = this.normalizeData(data);

    const newChart = new Chart(`chart-${newId}`, newContainer, {
      data: this.mode == 'normalized' ? normalizedData : data,
      cull: true,
    });
    this.charts.push({
      container: newContainer,
      chart: newChart,
      data,
      normalizedData,
    });

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
  normalizeData(data) {
    let normalized = { x: [], y: [], max: 0 };
    let max = data.y[0];
    let min = max;
    for (let i = 1; i < data.y.length; i++) {
      if (data.y[i] > max) max = data.y[i];
      if (data.y[i] < min) min = data.y[i];
    }
    console.log(min,max)
    for (let i = 0; i < data.y.length; i++) {
      normalized.x.push(data.x[i]);
      normalized.y.push((data.y[i] - min) / (max - min));
    }
    normalized.max = max;
    return normalized;
  }
  render() {
    console.log('rendering');
    this.charts.forEach(({ chart }) => {
      chart.chart.render;
    });
  }
}
