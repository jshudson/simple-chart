//@ts-nocheck

function charToSuperscript(number) {
  return result = "⁰¹²³⁴⁵⁶⁷⁸⁹"[number]
}

const superscript = (number) => {
  return number.toString().replace(/./g, charToSuperscript)
}

console.log(superscript(123))