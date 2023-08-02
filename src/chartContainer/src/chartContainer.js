import Chart from '../../chart/src/chart.js';

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
    this.handleRender = this.handleRender.bind(this);
    this.handleCloseClick = this.handleCloseClick.bind(this);
    this.addParentList();
  }
  addParentList() {
    this.list = this.parent.appendChild(document.createElement('ul'));
    this.list.setAttribute('class', 'chartContainer');
  }
  setMode(mode) {
    // this.mode = mode;
  }
  handleRender(event) {
    this.charts.forEach(({ chart }) => {
      if (chart.id != event.target.id) {
        chart.setLimits(event.limits, true, false);
      }
    });
  }
  handleCloseClick(event) {
    const parentId = event.target.parentNode.id;
    const id = parentId.slice(10, parentId.length);
    this.removeChart(id);
  }
  removeChart(id) {
    const index = this.charts.findIndex((e) => e.id == id);
    this.charts[index].chart.remove();
    this.charts[index].container.remove();
    this.charts.splice(index, 1);
    this.reindex();
  }
  reindex() {
    this.charts.forEach((e, i) => {
      e.id = `${this.id}-${i}`;
      e.container.setAttribute('id', `container-${e.id}`);
      e.chart.updateID(`chart-${e.id}`);
    });
  }
  addData(data) {
    const length = this.charts.length;
    const newId = `${this.id}-${length}`;
    const newContainer = this.list.appendChild(document.createElement('li'));

    newContainer.setAttribute('class', 'graph');
    newContainer.setAttribute('id', `container-${newId}`);
    newContainer.key = length;

    const close = document.createElement('input');

    close.setAttribute('type', 'button');
    close.setAttribute('value', '×');
    close.setAttribute('class', 'chart-container-close');

    newContainer.appendChild(close);

    const normalizedData = this.normalizeData(data);

    const newChart = new Chart(`chart-${newId}`, newContainer, {
      data: this.mode == 'normalized' ? normalizedData : data,
      cull: true,
    });

    newChart.addEventListener('render', this.handleRender);
    close.addEventListener('click', this.handleCloseClick.bind(this));
    this.charts.push({
      id: newId,
      container: newContainer,
      chart: newChart,
      close,
      data,
      normalizedData,
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
    console.log(min, max);
    for (let i = 0; i < data.y.length; i++) {
      normalized.x.push(data.x[i]);
      normalized.y.push((data.y[i] - min) / (max - min));
    }
    normalized.max = max;
    return normalized;
  }
}
