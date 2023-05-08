let state = {
  a: { a: 1, b: 2 }
}
let newState = {
  a: { c: 3 }
}
state = {
  ...newState,
  ...state,
}
console.log(state)