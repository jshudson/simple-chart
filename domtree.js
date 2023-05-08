/*
parent
    chart (svg root)
        title
            label
        axes
            x-axis
                label
                ticks
                    major
                        lines
                        labels
                    minor
                        lines
            y-axis
                ""
        plotArea
            clip
            paths
        interactive
*/
a = {
    parent: undefined,
    plots: [],
    chart: {
        e: undefined,
        viewBox: [{ x1: 0, x2: 0, y1: 0, y2: 0 }],
        viewLimits: { x1: 0, x2: 0, y1: 0, y2: 0 },
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
                    numberFormat: '0.0e0'
                },
                label: {
                    e: undefined,
                    options: {
                        position: 'inline-right'
                    },
                    text: 'x-axis',
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