import * as svg from '../svgUtils/svgUtils.js'

export default {
  parent: undefined,
  plots: [],
  chart: {
    create: function () {
      console.log(this);
      this.chart.e = svg.append(
        this.parent,
        'svg',
        `${'test'}-chart`
      )
    },
    e: undefined,
    width: 0,
    height: 0,
    viewBox: [{ x1: 0, x2: 100, y1: 0, y2: 100 }],
    viewLimits: { x1: 0, x2: 100, y1: 100, y2: 100 },
    id: '',
    options: {
      title: true,
      border: true,
      legend: false,
    },
    title: {
      e: undefined,
      options: {
        position: 'top-left'
      },
      text: 'Chromatogram'
    },
    border: {
      e: undefined,
    },
    legend: {

    },
    axes: {
      e: undefined,
      options: { xAxis: true, yAxis: true },
      xAxis: {
        e: undefined,
        options: {
          position: 'bottom',
          major: true,
          minor: true,
          label: true,
          numberFormat: '0.0'
        },
        label: {
          e: undefined,
          options: {
            position: 'inline-right'
          },
          text: 'x-axis',
        },
        line: {
          e: undefined,
        },
        ticks: {
          major: {
            e: undefined,
            options: {
              divisions: 5,
              size: 3,
            },
            labels: {
              e: [undefined],
              values: [0],
            }
          },
          minor: {
            e: undefined,
            options: {
              divisions: 5,
              size: 0.5,
            }
          }
        }
      },
      yAxis: {
        e: undefined,
        options: {
          position: 'bottom',
          major: true,
          minor: true,
          label: true,
          numberFormat: '0.0e0'
        },
        label: {
          e: undefined,
          options: {
            position: 'inline-right'
          },
          text: 'x-axis',
        },
        line: {
          e: undefined,
        },
        ticks: {
          major: {
            e: undefined,
            options: {
              divisions: 5,
              size: 3,
            },
            labels: {
              e: [undefined],
              values: [0],
            }
          },
          minor: {
            e: undefined,
            options: {
              divisions: 5,
              size: 0.5,
            }
          }
        }
      }
    },
    plotArea: {
      e: undefined,
      width: 0,
      height: 0,
      pad: { left: 20, right: 10, top: 10, bottom: 20 },
      clip: {
        e: undefined,
      },
      paths: []
    },
    interactive: {
      e: undefined,
      rect: {
        e: undefined,
        box: { x1: 0, x2: 0, y1: 0, y2: 0 }
      },
      cursor: undefined,
      active: false,
    }
  }
}