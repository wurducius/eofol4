const { VERBOSE } = require("./config")
const { prettySize } = require("../util/dev-util")

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
  log(
    `[${filename}]: original size = ${prettySize(prevSize)}, minified size = ${prettySize(nextSize)}, saved = ${prettySize(prevSize - nextSize)}.`,
  )
}

module.exports = { log, sourceSize, getAsset, logSizeDelta }
