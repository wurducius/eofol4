const { minifyJs } = require("../compiler")
const { prettySize } = require("../util/dev-util")

const pluginName = "eofol4-compiler"

const sourceSize = (source) => Buffer.byteLength(source, "utf8")

const VERBOSE = true

const log = (msg) => {
  if (VERBOSE) {
    console.log(msg)
  }
}

const transformAssets =
  (transformPropertyName, transform, logStart, logFinishedAsset, extraProperty, conditional) =>
  (compiler, compilation) =>
  async (assets) => {
    logStart()
    Object.keys(assets)
      .filter((assetName) => !conditional || conditional(assets[assetName].info))
      .map((assetName) => {
        const asset = assets[assetName]
        const source = asset.source()
        const map = asset.map()

        const nextSource = transform(source)
        const nextSize = sourceSize(nextSource)
        const nextInfo = { ...asset.info, [transformPropertyName]: true, ...extraProperty }

        const nextAsset = {
          source: () => nextSource,
          map: () => map,
          sourceAndMap: () => ({
            source: nextSource,
            map,
          }),
          size: () => nextSize,
          info: nextInfo,
        }

        logFinishedAsset({ source, nextSource, nextSize })

        assets[assetName] = nextAsset
        return nextAsset
      })
  }

const processAssets = (compiler, compilation) => (assets) => {
  return transformAssets(
    "typed",
    (x) => x,
    () => {},
    () => {},
    { type: "js" },
  )(
    compiler,
    compilation,
  )(assets).then(() => {
    return transformAssets(
      "minified",
      minifyJs,
      () => {
        log("Minify JS")
      },
      ({ nextSize, source }) => {
        const prevSize = sourceSize(source)
        log(
          `Original size = ${prettySize(prevSize)}, minified size = ${prettySize(nextSize)}, saved = ${prettySize(prevSize - nextSize)}.`,
        )
      },
      undefined,
      (info) => !info.minified && info.type === "js",
    )(
      compiler,
      compilation,
    )(assets)
  })
}

// eslint-disable-next-line no-unused-vars
const onBuildStarted = (compilation) => {
  console.log("Eofol4 build")
}

// eslint-disable-next-line no-unused-vars
const onDevStarted = (compilation) => {
  console.log("Eofol4 start")
}

const onCompilationFinished = (compiler) => (compilation) => {
  compilation.hooks.processAssets.tapPromise(
    {
      name: pluginName,
      stage: compiler.webpack.Compilation.PROCESS_ASSETS_STAGE_OPTIMIZE_SIZE,
      additionalAssets: true,
    },
    processAssets(compiler, compilation),
  )
}

class Eofol4CompilerWebpackPlugin {
  apply(compiler) {
    compiler.hooks.run.tap(pluginName, onBuildStarted)
    compiler.hooks.watchRun.tap(pluginName, onDevStarted)
    compiler.hooks.compilation.tap(pluginName, onCompilationFinished(compiler))
  }
}

module.exports = Eofol4CompilerWebpackPlugin
