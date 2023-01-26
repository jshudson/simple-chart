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
            width: 800,
            height: 400,
        }

        this.data = [];

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
        this.plot = document.getElementById("plot");

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
        console.log(this.data);
    }

    /**
     * Get screen coordinates for plot region
     */
    get plotScreenCoordinates() {
        return {
            x1: this.plotScreenDimensions.pad,
            x2: this.plotScreenDimensions.width - this.plotScreenDimensions.pad,
            y1: this.plotScreenDimensions.pad,
            y2: this.plotScreenDimensions.height - this.plotScreenDimensions.pad
        }
    }

    /**
     * Get SVG path command from points
     * @param {Object} points - collection of xy data
     * @param {number[]} points.x - list of x values
     * @param {number[]} points.y - list of y values
     * @returns 
     */
    pointsToSVGPath(points) {
        const scaledPoints = this.scalePointsToScreen(points);
        const screenCoords = this.plotScreenCoordinates
        
        let prevInGraph = false, curInGraph, nextInGraph = true;

        let command, x, y, ny;

        //first point is an M
        let i = scaledPoints.x.findIndex(e => e >= 0);
        x = scaledPoints.x[i]
        let path = `M${scaledPoints.x[i]},${scaledPoints.y[i]}`;
        i++;

        while (i < scaledPoints.x.length && x <= screenCoords.x2 && x >= 0) {
            x = scaledPoints.x[i]
            y = scaledPoints.y[i]
            ny = scaledPoints.y[i + 1]

            curInGraph = this.pointInGraph(y)
            nextInGraph = this.pointInGraph(ny)

            command = this.getPathCommand(x, y, prevInGraph, curInGraph, nextInGraph)

            path += command;

            prevInGraph = curInGraph

            i++;
        }
        return path
    }

    /**
     * Scale array values to SVG screen coordinates
     * @param {Array} array - 1D array of values
     * @param {number} plotMin - Minimum value of the plotted data
     * @param {number} plotMax - Maximum value of the plotted data
     * @param {number} screenMin - Minimum screen coordinate referenced to the SVG
     * @param {number} screenMax - Maximum screen coordinate referenced to the SVG
     * @returns {Array} Array values scaled to the provided coordinate system
     */
    scaleArrayToScreen(array, plotMin, plotMax, screenMin, screenMax) {
        return array.map(i => ((i - plotMin) * (screenMax - screenMin) / (plotMax - plotMin) + screenMin))
    }

    /**
     * Scale points object to SVG screen coordinates
     * @param {Object} points - collection of xy data
     * @param {number[]} points.x - list of x values
     * @param {number[]} points.y - list of y values
     * @returns {Object} Scaled Points
     */
    scalePointsToScreen(points) {
        const screenCoords = this.plotScreenCoordinates

        const scaleX = this.scaleArrayToScreen(points.x, this.plotRange.x1, this.plotRange.x2, screenCoords.x1, screenCoords.x2);
        const scaleY = this.scaleArrayToScreen(points.y, this.plotRange.y1, this.plotRange.y2, screenCoords.y2, screenCoords.y1);

        return { x: scaleX, y: scaleY }
    }

    /**
     * Check if a y point is within the vertical scale of the plot
     * @param {number} y Value
     * @returns {boolean} Point is in graph?
     */
    pointInGraph(y) {
        return !(
            y < 0 ||
            y > this.plotScreenCoordinates.y2
        )
    }
    
    /**
     * Gives a path command string based on surrounding points visibility in the plot
     * @param {number} x x-coordinate
     * @param {number} y y-coordinate
     * @param {boolean} prevInGraph Previous point was displayed
     * @param {boolean} curInGraph Current point should be displayed
     * @param {boolean} nextInGraph Next point will be displayed
     * @returns {string} Path command
     */
    getPathCommand(x, y, prevInGraph, curInGraph, nextInGraph) {
        if (!curInGraph && nextInGraph) return `M${x},${y}`
        if (curInGraph || prevInGraph || nextInGraph) return `L${x},${y}`
        return ``
    }

    /**
     * Converts x and y lists to an SVG path element string
     * @param {Object} points - collection of xy data
     * @param {Array} points.x - list of x values
     * @param {Array} points.y - list of y values
     * @returns {String} Path element string
     */
    getPathString(points) {
        return `
        <path
            d = ${this.pointsToSVGPath(points)}
            clip-path="url(#plot-clip)"
        />`
    }

    /**
     * Gets the total data range of a point collection
     * @param {Object} points - collection of xy data
     * @param {Array} points.x - list of x values
     * @param {Array} points.y - list of y values
     * @returns {Object} Max and min values of x and y lists
     */
    getDataRange(points) {
        const x1 = Math.min(...points.x)
        const x2 = Math.max(...points.x)
        const y1 = Math.min(...points.y)
        const y2 = Math.max(...points.y)
        const limits = { x1, x2, y1, y2 }
        return limits
    }

    /**
     * Update the plot
     */
    updatePlot() {
        this.plotRange = this.getDataRange(this.data[0]);
        this.plot.innerHTML = this.getPathString(this.data[0]);
    }
}

export default Chart;