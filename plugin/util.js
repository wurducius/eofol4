const { VERBOSE } = require("./config")
const { prettySize, resolve } = require("../util")
const { stat } = require("../util/fs")

const log = (msg) => {
  if (VERBOSE) {
    console.log(msg)
  }
}

const sourceSize = (source) => Buffer.byteLength(source, "utf8")

const getAsset = ({ asset, nextSource, nextSize, nextInfo }) => {
  const map = asset ? asset.map() : null

  return {
    source: () => nextSource,
    map: () => map,
    sourceAndMap: () => ({
      source: nextSource,
      map,
    }),
    size: () => nextSize,
    info: nextInfo,
  }
}

const logSizeDelta = (filename, prevSize, nextSize) => {
  const delta = prevSize - nextSize
  const isSaved = delta >= 0
  log(
    `[${filename}]: original size = ${prettySize(prevSize)}, minified size = ${prettySize(nextSize)}, ${isSaved ? "saved" : "added"} = ${prettySize(isSaved ? delta : -delta)}.`,
  )
}

const getFileSizes = (filenames, basepath) =>
  filenames.map((filename) => stat(resolve(basepath, filename)).size).reduce((acc, next) => acc + next, 0)

module.exports = { log, sourceSize, getAsset, logSizeDelta, getFileSizes }
