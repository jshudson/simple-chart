const state = {
  a: 1,
}

const d = state?.c ? state.c : '' + "hello"

console.log(d)