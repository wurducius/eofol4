const transformAssets = require("./transform-assets")
const lifecycle = require("./lifecycle")
const { minifyJs } = require("../compiler")
const getInternals = require("./internals")
const { sourceSize, logSizeDelta, trace } = require("./util")
const { PROGRESS_OPTIMIZE_ASSETS } = require("./config")
const { incrementProgress, showProgress, setProgress, getProgress } = require("./progress")
const { isJs, parse } = require("../util")

const processAssets = (compiler, compilation) => (assets) =>
  transformAssets({
    transformPropertyName: "minified",
    transform: (content) => {
      const x = lifecycle.onOptimizeAssetStart(content)
      const y = minifyJs(`${getInternals()}${x}`)
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
