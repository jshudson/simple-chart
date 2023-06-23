/**
 * A two point range, low to high
 */
type NumberRange = [number, number]
/**
 * x y vector coordinate
 */
type Point = {
    x: number,
    y: number
}
/**
 * Defines a rectangle from an x range and y range
 */
type Rectangle = {
    /**
     * The x start and stop
     */
    x: NumberRange,
    /**
     * The y start and stop
     */
    y: NumberRange
}


/**
 * Location and size of a screen element in pixels
 * @typedef {Object} ScreenDimensions
 * @property {number} left
 * @property {number} top
 * @property {number} width
 * @property {number} height
 */

type Range = [number, number]

/**
 * Location and size of a screen element in pixels
 */
type ScreenDimensions = {
    left: number,
    top: number,
    width: number,
    height: number
}