const transformAssets = require("./transform-assets")
const lifecycle = require("./lifecycle")
const { minifyJs } = require("../compiler")
const getInternals = require("./internals")
const { sourceSize, logSizeDelta, trace } = require("./util")
const { PROGRESS_OPTIMIZE_ASSETS } = require("./config")
const { incrementProgress, showProgress, setProgress, getProgress } = require("./progress")
const { isJs, parse } = require("../util")

const processAssets = (compiler, compilation, instances) => (assets) =>
  transformAssets({
    transformPropertyName: "minified",
    transform: (content, asset) => {
      const x = lifecycle.onOptimizeAssetStart(content)
      const instancesPath = asset.replace(".js", ".html").replace("assets/js/", "").replaceAll("/", "\\")
      // @TODO FIXME
      const instancesImpl = instances[instancesPath]
        ? instances[instancesPath][instancesPath]
        : instances[instancesPath]
      const y = minifyJs(`${getInternals(instancesImpl)}${x}`)
      return lifecycle.onOptimizeAssetFinished(y)
    },
    logStart: () => {
      trace("Minify JS")
    },
    logFinishedAsset: ({ nextSize, source, transform, assetName }) => {
      const prevSize = transform ? sourceSize(source) : nextSize
      logSizeDelta(assetName, prevSize, nextSize)
      if (PROGRESS_OPTIMIZE_ASSETS) {
        setProgress(incrementProgress(getProgress(), prevSize))
        showProgress(getProgress(), assetName)
      }
    },
    conditional: (info, assetName) => !info.minified && isJs(parse(assetName).ext),
  })(
    compiler,
    compilation,
  )(assets)

module.exports = processAssets
