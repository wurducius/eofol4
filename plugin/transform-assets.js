const { getAsset, sourceSize } = require("./util")

const transformAssets =
  ({
    transformPropertyName,
    transform,
    logStart,
    logStartedAsset,
    logFinishedAsset,
    logFinished,
    extraProperty,
    conditional,
  }) =>
  // eslint-disable-next-line no-unused-vars
  (compiler, compilation) =>
  async (assets) => {
    if (logStart) {
      logStart()
    }

    Object.keys(assets)
      .filter((assetName) => !conditional || conditional(assets[assetName].info))
      .map((assetName) => {
        if (logStartedAsset) {
          logStartedAsset({ assetName })
        }

        const asset = assets[assetName]
        const source = asset.source()

        const nextSource = transform ? transform(source) : source
        const nextSize = sourceSize(nextSource)
        const nextInfo = { ...asset.info, [transformPropertyName]: true, ...extraProperty }

        const nextAsset = getAsset({ asset, nextSource, nextSize, nextInfo })

        if (logFinishedAsset) {
          logFinishedAsset({ source, nextSource, nextSize, assetName, transform })
        }

        assets[assetName] = nextAsset
        return nextAsset
      })

    if (logFinished) {
      logFinished()
    }
  }

module.exports = transformAssets
