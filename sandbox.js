const findInterval = (value) => {
  const exponent = Math.floor(Math.log10(value));
  const mantissa = value / (10 ** exponent)
  const orders = [1, 2, 2.5, 5];
  let difference = 10
  let order
  for (i in orders) {
    let newDiff = Math.abs(orders[i] - mantissa)
    if (newDiff < difference) {
      difference = newDiff
      order = orders[i]
    }
  }
  return order * 10 ** exponent
}


const findFirstTick = (start, interval) => {
  return Math.ceil(start / interval) * interval
}

let start = 0.0416
let end = 6

let range = end - start
let targetTicks = 7

let fullinterval = range / targetTicks

console.log(fullinterval)

const targetInterval = findInterval(fullinterval)
console.log(targetInterval)
const startTick = findFirstTick(start, targetInterval)
console.log(startTick)
const tickRange = end - startTick
const tickCount = Math.ceil(tickRange / targetInterval)
console.log(tickCount)

const values = Array.from({ length: tickCount }, (e, i) => i * targetInterval + startTick)

console.log(values)