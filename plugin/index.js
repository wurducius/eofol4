const { parse } = require("path")

const { minifyJs, minifyHtml } = require("../compiler")
const { prettySize } = require("../util/dev-util")
const transformAssets = require("./transform-assets")
const { log, sourceSize, getAsset, logSizeDelta } = require("./util")
const { pluginName } = require("./config")
const { readDir, resolve, read, isDirectory, touch } = require("../util")
const { PATH_PUBLIC } = require("../config/path")

const processAssets = (compiler, compilation) => (assets) =>
  transformAssets({
    transformPropertyName: "minified",
    transform: minifyJs,
    logStart: () => {
      log("Minify JS")
    },
    logFinishedAsset: ({ nextSize, source, transform, assetName }) => {
      const prevSize = transform ? sourceSize(source) : nextSize
      logSizeDelta(assetName, prevSize, nextSize)
    },
    conditional: (info, assetName) => !info.minified && parse(assetName).ext === ".js",
  })(
    compiler,
    compilation,
  )(assets)

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

const processStatic = async (filename, content, ext) => {
  if (ext === ".html" || ext === ".htm") {
    const minifiedHtml = await minifyHtml(content)
    logSizeDelta(filename, content.length, minifiedHtml.toString().length)
    return minifiedHtml
  }
  if (ext === ".jpg" || ext === ".jpeg") {
    return content
  }
  // @TODO finish
  return content
}

class Eofol4CompilerWebpackPlugin {
  apply(compiler) {
    compiler.hooks.run.tap(pluginName, onBuildStarted)
    compiler.hooks.watchRun.tap(pluginName, onDevStarted)
    compiler.hooks.compilation.tap(pluginName, onCompilationFinished(compiler))
    compiler.hooks.thisCompilation.tap(pluginName, (compilation) => {
      readDir(PATH_PUBLIC, { recursive: true }).map((filename) => {
        const filePath = resolve(PATH_PUBLIC, filename)
        if (isDirectory(filePath)) {
          return undefined
        }
        const content = read(filePath).toString()
        const ext = parse(filename).ext
        processStatic(filename, content, ext).then((processed) => {
          compilation.assets[filename] = getAsset({
            nextSize: processed.length,
            nextInfo: {},
            nextSource: processed,
          })
        })
      })
    })
  }
}

module.exports = Eofol4CompilerWebpackPlugin
