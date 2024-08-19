const Bluebird = require("bluebird")

let promise = undefined

const setPromise = (nextPromise) => {
  promise = new Bluebird.Promise(() => nextPromise())
}

const cancelPromise = () => {
  if (promise) {
    promise.cancel()
  }
  promise = undefined
}

module.exports = { setPromise, cancelPromise }
