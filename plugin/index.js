const path = require("path")

const { minifyJs, minifyHtml } = require("../compiler")
const transformAssets = require("./transform-assets")
const { log, sourceSize, getAsset, logSizeDelta } = require("./util")
const { pluginName } = require("./config")
const { readDir, resolve, read, isDirectory } = require("../util")
const { PATH_PAGES, PATH_TEMPLATES, PATH_PUBLIC } = require("../config/path")
const { JSONToHTML } = require("html-to-json-parser")
const htmlTemplate = require("../compiler/head/head")

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
    conditional: (info, assetName) => !info.minified && path.parse(assetName).ext === ".js",
  })(
    compiler,
    compilation,
  )(assets)

const processStaticAssets = (compilation) => (basepath) =>
  Promise.all(
    readDir(basepath, { recursive: true }).map(async (filename) => {
      const filePath = resolve(basepath, filename)
      if (isDirectory(filePath)) {
        return undefined
      }
      const content = (await read(filePath)).toString()
      const ext = path.parse(filename).ext
      return processStatic(filename, content, ext).then((processed) => {
        compilation.assets[filename] = getAsset({
          nextSize: processed.length,
          nextInfo: {},
          nextSource: processed,
        })
      })
    }),
  )

const processTemplates = () =>
  Promise.all(
    readDir(PATH_TEMPLATES).map((templateName) =>
      JSONToHTML(htmlTemplate(path.parse(templateName).name)(read(resolve(PATH_TEMPLATES, templateName)).toString())),
    ),
  )

const processTemplatesPost = (compilation) => (generatedPages) =>
  generatedPages.map((content) => {
    const filename = "index2.html"
    return processStatic(filename, content, ".html").then((processed) => {
      compilation.assets[filename] = getAsset({
        nextSize: processed.length,
        nextInfo: {},
        nextSource: processed,
      })
    })
  })

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

const processViews = (compiler, compilation) => {
  const processStaticAssetsImpl = processStaticAssets(compilation)
  const pages = processStaticAssetsImpl(PATH_PAGES)
  const publicx = processStaticAssetsImpl(PATH_PUBLIC)
  const templates = processTemplates().then(processTemplatesPost(compilation))
  return Promise.all([pages, publicx, templates])
}

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
    compiler.hooks.thisCompilation.tap(pluginName, onInitCompilation(compiler))
  }
}

module.exports = Eofol4CompilerWebpackPlugin
