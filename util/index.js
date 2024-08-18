const Fs = require("./fs")
const DevUtil = require("./dev-util")

const sleep = (ms) =>
  new Promise((resolve) => {
    setTimeout(resolve, ms)
  })

module.exports = { ...Fs, ...DevUtil, sleep }
