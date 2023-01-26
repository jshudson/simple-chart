class Chart {
    constructor(div) {

        this.plotRange = {
            x1: 0,
            x2: 100,
            y1: 0,
            y2: 100
        }

        this.plotScreenDimensions = {
            pad: 10,
            width: 100,
            height: 100,
            x1: 10,
            x2: 90,
            y1: 10,
            y2: 90
        }

        this.data = [];
        this.scaleData = [];

        this.element = div

        const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        svg.innerHTML = `
        <clipPath id="plot-clip">
            <rect x="0" y="${this.plotScreenDimensions.pad}" height="200vh" width="200vw"></rect>
        </clipPath> 
        <g id="plot"></g>
        <g id="rect"></g>
        `
        this.chart = this.element.appendChild(svg);


    }

    /**
     * Add a plot to the chart
     * @param {Object} points - collection of xy data
     * @param {Array} points.x - list of x values
     * @param {Array} points.y - list of y values
     * @param {Object} options - display options for the plot
     */
    addPlot(points, options) {
        this.data = [...this.data, points];
    }

    /**
     * 
     * @param {Array} array - 1D array of values
     * @param {*} plotMin - Minimum value of the plotted data
     * @param {*} plotMax - Maximum value of the plotted data
     * @param {*} screenMin - Minimum screen coordinate referenced to the SVG
     * @param {*} screenMax - Maximum screen coordinate referenced to the SVG
     * @returns Array values scaled to the provided coordinate system
     */

    scaleArrayToScreen(array, plotMin, plotMax, screenMin, screenMax) {
        return array.map(i => ((i - plotMin) * (screenMax - screenMin) / (plotMax - plotMin) + screenMin))
    }

    /**
     * 
     * @param {Object} points - collection of xy data
     * @param {Array} points.x - list of x values
     * @param {Array} points.y - list of y values
     * @returns 
     */
    scalePointsToScreen(points) {
        const y1 = this.plotScreenDimensions.height - this.plotScreenDimensions.y1
        const y2 = this.plotScreenDimensions.height - this.plotScreenDimensions.y2

        const scaleX = scalePoints(points.x, this.plotRange.x1, this.plotRange.x2, this.plotScreenDimensions.x1, this.plotScreenDimensions.x2);
        const scaleY = scalePoints(points.y, this.plotRange.y1, this.plotRange.y2, y1, y2);

        return { x: scaleX, y: scaleY }
    }

    convertToPath(points, svgDimensions) {

        let prevInGraph = false, curInGraph, nextInGraph = true;

        let command, x, y, ny;

        let i = points.x.findIndex(e => e >= 0);
        x = points.x[i];
        let path = `M${points.x[i]},${points.y[i]}`;
        i++;
        while (i < points.x.length && x <= svgDimensions.width && x >= 0) {
            // while (i < 110 && x < svgDimensions.width) {
            x = points.x[i]
            y = points.y[i]
            ny = points.y[i + 1]
            curInGraph = inGraph(y, svgDimensions)
            nextInGraph = inGraph(ny, svgDimensions)
            command = getCommand(x, y, prevInGraph, curInGraph, nextInGraph)
            path += command;
            prevInGraph = curInGraph
            i++;
        }
        // console.log(path);
        return path
    }
    inGraph(y, svgDimensions) {
        return !(
            y < 0 ||
            y > svgDimensions.height
        )
    }
    getCommand(x, y, prevInGraph, curInGraph, nextInGraph) {
        if (!curInGraph && nextInGraph) return `M${x},${y}`
        if (curInGraph || prevInGraph || nextInGraph) return `L${x},${y}`
        return ``
    }
    SVGString(points, limits, svgDimensions) {
        return `
            <path
        d = ${convertToPath(scaleDataToSVG(points, limits, svgDimensions), svgDimensions)}
        clip-path="url(#plot-clip)"/>
            `
    }
    getLimits(points) {
        const x1 = Math.min(...points.x)
        const x2 = Math.max(...points.x)
        const y1 = Math.min(...points.y)
        const y2 = Math.max(...points.y)
        const limits = { x1, x2, y1, y2 }
        return limits
    }
}