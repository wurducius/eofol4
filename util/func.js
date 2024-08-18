const _pipe = (f, g) => (arg) => g(f(arg))
const pipe = (...fns) => fns.reduce(_pipe)

const sleep = (ms) =>
  new Promise((resolve) => {
    setTimeout(resolve, ms)
  })

module.exports = { pipe, sleep }
