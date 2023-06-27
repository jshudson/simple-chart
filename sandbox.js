//@ts-nocheck

const limits = {
  x: [0, 1],
  y: [1, 2],
};

const test = { ...limits };
test.x = [3, 4];

console.log(limits);
console.log(test);
