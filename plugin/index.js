const { pluginName } = require("./config")
const lifecycle = require("./lifecycle")
const processViews = require("./view")
const { info } = require("./util")
const optimizeAssets = require("./optimize")

const onInitCompilation = (compiler) => (compilation) => {
  compilation.hooks.processAssets.tapPromise(
    {
      name: pluginName,
      stage: compiler.webpack.Compilation.PROCESS_ASSETS_STAGE_ADDITIONS,
    },
    () => processViews(compiler, compilation),
  )
}

// eslint-disable-next-line no-unused-vars
const onBuildStarted = (compilation) => {
  lifecycle.onCompilationStart()
}

// eslint-disable-next-line no-unused-vars
const onDevStarted = (compilation) => {
  info("Eofol4 start")
}

const onCompilationFinished = (compiler) => (compilation) => {
  compilation.hooks.processAssets.tapPromise(
    {
      name: pluginName,
      stage: compiler.webpack.Compilation.PROCESS_ASSETS_STAGE_OPTIMIZE_SIZE,
      additionalAssets: true,
    },
    optimizeAssets(compiler, compilation),
  )
}

// eslint-disable-next-line no-unused-vars
const onAfterCompile = (compiler) => (compilation) => {
  lifecycle.onCompilationFinished()
}

class Eofol4CompilerWebpackPlugin {
  apply(compiler) {
    compiler.hooks.run.tap(pluginName, onBuildStarted)
    compiler.hooks.watchRun.tap(pluginName, onDevStarted)
    compiler.hooks.compilation.tap(pluginName, onCompilationFinished(compiler))
    compiler.hooks.thisCompilation.tap(pluginName, onInitCompilation(compiler))
    compiler.hooks.afterCompile.tap(pluginName, onAfterCompile(compiler))
  }
}

module.exports = Eofol4CompilerWebpackPlugin
