function scientific(value) {
  const stringArray = (value.toExponential() + '').split("e");
  const mantissa = parseFloat(stringArray[0]);
  const exponent = parseInt(stringArray[1]);
  return [ mantissa, exponent ]
}
function getScientific(value) {
  const exponent = Math.floor(Math.log10(value));
  const mantissa = value / (10 ** exponent);
  return [ mantissa, exponent ]
}

console.time('math')
for (let i = 0; i < 10000000; i++) {
  {
    const value = Math.random()*1000000000
    const exponent = Math.floor(Math.log10(value));
    const mantissa = value / (10 ** exponent);
  }
}
console.timeEnd('math')


console.time('parse')
for (let i = 0; i < 10000000; i++) {
  {
    const value2 = Math.random()*1000000000
    const myarray = (value2.toExponential() + '').split("e");
    const mantissa2 = parseFloat(myarray[0]);
    const exponent2 = parseInt(myarray[1]);
  }
}
console.timeEnd('parse')

console.time('function')

for (let i = 0; i < 10000000; i++) {
  {
    const value3 = Math.random()*1000000000
    const stuff = scientific(value3)
  }
}
console.timeEnd('function')

console.time('math function')

for (let i = 0; i < 10000000; i++) {
  {
    const value3 = Math.random()*1000000000
    const stuff = mathScientifi(value3)
  }
}
console.timeEnd('math function')