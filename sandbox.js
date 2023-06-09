export const findInterval = (value) => {
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


export const findFirstTick = (start, interval) => {
  return Math.ceil(interval / start) * interval
}

let start = 0.1001
let end = 0.111

let range = end - start
let targetTicks = 7

let fullinterval = range / targetTicks

console.log(fullinterval)

const targetInterval = findInterval(fullinterval)
console.log(targetInterval)
const startTick = findFirstTick(start, targetInterval)
console.log(startTick)



