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
    chart: {
        id: '',
        e: undefined,
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
                        position: 'inline'
                    },
                    text: 'x-axis',
                },
                ticks: {
                    major: {
                        e: undefined,
                        options: {},
                        labels: {
                            e: undefined,
                        }
                    }
                }
            }
        }
    }
}