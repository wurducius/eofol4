const lifecycle = require("./lifecycle")
const { PROGRESS_OPTIMIZE_ASSETS } = require("./config")
const { setProgress, resetProgress } = require("./progress")
const { info } = require("./util")
const processAssets = require("./script")

const optimizeAssets = (compiler, compilation) => (assets) => {
  const assetsToOptimize = Object.keys(assets).filter((asset) => asset.endsWith(".js"))
  const preprocessedAssetsToOptimize = lifecycle.onOptimizeAssetsStart(assetsToOptimize)
  const assetSize = preprocessedAssetsToOptimize
    .map((asset) => assets[asset].size())
    .reduce((acc, next) => ({ count: acc.count + 1, size: acc.size + next }), { count: 0, size: 0 })
  if (PROGRESS_OPTIMIZE_ASSETS) {
    setProgress(resetProgress(assetSize.size, assetSize.count))
    info("Optimizing assets...")
  }
  const result = processAssets(compiler, compilation)(assets)
  return lifecycle.onOptimizeAssetsFinished(result)
}

module.exports = optimizeAssets
