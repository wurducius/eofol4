const { pluginName } = require("./config")
const lifecycle = require("./lifecycle")
const processViews = require("./view")
const optimizeAssets = require("./optimize")

let instances = {}

const onInitCompilation = (compiler) => (compilation) => {
  compilation.hooks.processAssets.tapPromise(
    {
      name: pluginName,
      stage: compiler.webpack.Compilation.PROCESS_ASSETS_STAGE_ADDITIONS,
    },
    async () => {
      return await processViews(compiler, compilation, instances)
    },
  )
}

// eslint-disable-next-line no-unused-vars
const onBuildStarted = (compilation) => {
  instances = {}
  lifecycle.onCompilationStart()
}

const onCompilationFinished = (compiler) => (compilation) => {
  compilation.hooks.processAssets.tapPromise(
    {
      name: pluginName,
      stage: compiler.webpack.Compilation.PROCESS_ASSETS_STAGE_OPTIMIZE_SIZE,
      additionalAssets: true,
    },
    optimizeAssets(compiler, compilation, instances),
  )
}

// eslint-disable-next-line no-unused-vars
const onAfterCompile = (compiler) => (compilation) => {
  lifecycle.onCompilationFinished()
}

class Eofol4CompilerWebpackPlugin {
  apply(compiler) {
    compiler.hooks.run.tap(pluginName, onBuildStarted)
    compiler.hooks.compilation.tap(pluginName, onCompilationFinished(compiler))
    compiler.hooks.thisCompilation.tap(pluginName, onInitCompilation(compiler))
    compiler.hooks.afterCompile.tap(pluginName, onAfterCompile(compiler))
  }
}

module.exports = Eofol4CompilerWebpackPlugin
