export const deepEqual = (x: any, y: any) => {
  if ((x && !y) || (!x && y)) {
    return false
  } else if (!x && !y) {
    return x === y
  } else {
    return JSON.stringify(x) === JSON.stringify(y)
  }
}
