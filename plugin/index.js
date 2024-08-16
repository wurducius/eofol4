const { minifyJs } = require("../compiler")
const { prettySize } = require("../util/dev-util")
const transformAssets = require("./transform-assets")
const { log, sourceSize } = require("./util")
const { pluginName } = require("./config")

const processAssets = (compiler, compilation) => (assets) => {
  return transformAssets({ transformPropertyName: "typed", extraProperty: { type: "js" } })(
    compiler,
    compilation,
  )(assets).then(() => {
    return transformAssets({
      transformPropertyName: "minified",
      transform: minifyJs,
      logStart: () => {
        log("Minify JS")
      },
      logFinishedAsset: ({ nextSize, source, transform }) => {
        const prevSize = transform ? sourceSize(source) : nextSize
        log(
          `Original size = ${prettySize(prevSize)}, minified size = ${prettySize(nextSize)}, saved = ${prettySize(prevSize - nextSize)}.`,
        )
      },
      conditional: (info) => !info.minified && info.type === "js",
    })(
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
