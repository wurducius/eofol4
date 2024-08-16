const { VERBOSE } = require("./config")

const log = (msg) => {
  if (VERBOSE) {
    console.log(msg)
  }
}

const sourceSize = (source) => Buffer.byteLength(source, "utf8")

const getAsset = ({ asset, nextSource, nextSize, nextInfo }) => {
  const map = asset.map()

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

module.exports = { log, sourceSize, getAsset }
