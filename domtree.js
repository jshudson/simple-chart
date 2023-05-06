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
    viewBox: [{ x1: 0, x2: 0, y1: 0, y2: 0 }],
    viewLimits: { x1: 0, x2: 0, y1: 0, y2: 0 },
    chart: {
        e: undefined,
        id: '',
        options: {
            title: true,
        },
        title: {
            e: undefined,
            options: {
                position: 'top-left'
            },
            text: 'Chromatogram'
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
        }
    }
}