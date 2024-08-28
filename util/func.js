const _pipe = (f, g) => (arg) => g(f(arg))
const pipe = (...fns) => fns.reduce(_pipe)

const sleep = (ms) =>
  new Promise((resolve) => {
    setTimeout(resolve, ms)
  })

const arrayCombinator = (handler) => (data) => {
  if (Array.isArray(data)) {
    return data.map(handler)
  } else if (data === undefined) {
    return undefined
  } else {
    return handler(data)
  }
}

module.exports = { pipe, sleep, arrayCombinator }
