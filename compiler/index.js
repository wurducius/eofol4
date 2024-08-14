const pluginName = "ConsoleLogOnBuildWebpackPlugin"

class ConsoleLogOnBuildWebpackPlugin {
  apply(compiler) {
    // eslint-disable-next-line no-unused-vars
    compiler.hooks.run.tap(pluginName, (compilation) => {
      console.log("Eofol4 build")
    })

    // eslint-disable-next-line no-unused-vars
    compiler.hooks.watchRun.tap(pluginName, (compilation) => {
      console.log("Eofol4 start")
    })
  }
}

module.exports = ConsoleLogOnBuildWebpackPlugin
