const { VERBOSE, VERBOSE_INFO, SERVICE_WORKER_PAGES_PLACEHOLDER } = require("./config")
const { prettySize, stat, resolve, read, sep } = require("../util")
const { VIEWS } = require("../config/internal")
const { PATH_SERVICE_WORKER_SCRIPT } = require("../config")

const log = console.log

const trace = (msg) => {
  if (VERBOSE) {
    log(msg)
  }
}

const info = (msg) => {
  if (VERBOSE_INFO) {
    log(msg)
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
  trace(
    `[${filename}]: original size = ${prettySize(prevSize)}, minified size = ${prettySize(nextSize)}, ${isSaved ? "saved" : "added"} = ${prettySize(isSaved ? delta : -delta)}.`,
  )
}

const getFileSizes = (filenames, basepath) =>
  filenames.map((filename) => stat(resolve(basepath, filename)).size).reduce((acc, next) => acc + next, 0)

const addAsset = (compilation) => (name, content, info) => {
  compilation.assets[name] = getAsset({
    nextSize: content.length,
    nextInfo: info ?? {},
    nextSource: content,
  })
}

const injectServiceWorker = (compilation) => {
  const serviceWorkerContent = read(PATH_SERVICE_WORKER_SCRIPT)
    .toString()
    .replace(SERVICE_WORKER_PAGES_PLACEHOLDER, VIEWS.map(({ path }) => `"${path.replaceAll(sep, "/")}"`).join(", "))
  addAsset(compilation)("service-worker.js", serviceWorkerContent, {})
}

module.exports = { log, trace, info, sourceSize, getAsset, logSizeDelta, getFileSizes, addAsset, injectServiceWorker }
