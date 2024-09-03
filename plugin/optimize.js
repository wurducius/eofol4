const lifecycle = require("./lifecycle")
const { PROGRESS_OPTIMIZE_ASSETS } = require("./config")
const { setProgress, resetProgress } = require("./progress")
const { info, addAsset } = require("./util")
const processAssets = require("./script")
const { primary } = require("../util")

const optimizeAssets = (compiler, compilation, instances) => async (assets) => {
  // Touch assets/js/dependencies.js in case no views are importing external dependencies
  // @TODO Move somewhere else i guess
  const dependenciesScriptName = "/assets/js/dependencies.js"
  if (!compilation.assets[dependenciesScriptName]) {
    addAsset(compilation)(dependenciesScriptName, "", { processed: true })
  }

  const assetsToOptimize = Object.keys(assets).filter((asset) => asset.endsWith(".js"))
  const preprocessedAssetsToOptimize = lifecycle.onOptimizeAssetsStart(assetsToOptimize)
  const assetSize = preprocessedAssetsToOptimize
    .map((asset) => assets[asset].size())
    .reduce((acc, next) => ({ count: acc.count + 1, size: acc.size + next }), { count: 0, size: 0 })
  if (PROGRESS_OPTIMIZE_ASSETS) {
    setProgress(resetProgress(assetSize.size, assetSize.count))
    info(primary("Optimizing assets..."))
  }
  const result = await processAssets(compiler, compilation, instances)(assets)
  return lifecycle.onOptimizeAssetsFinished(result)
}

module.exports = optimizeAssets
