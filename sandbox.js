function scientific(value) {
  const stringArray = (value2.toExponential() + '').split("e");
  const mantissa = parseFloat(stringArray[0]);
  const exponent = parseInt(stringArray[1]);
  return { mantissa, exponent }
}

console.time('math')
const value = 10023540
const exponent = Math.floor(Math.log10(value));
const mantissa = value / (10 ** exponent);
console.timeEnd('math')


console.time('parse')
const value2 = 10023540
const myarray = (value2.toExponential() + '').split("e");
const mantissa2 = parseFloat(myarray[0]);
const exponent2 = parseInt(myarray[1]);
console.timeEnd('parse')

console.time('function')
const value3 = 10023540
const stuff = scientific(value3)
console.timeEnd('function')