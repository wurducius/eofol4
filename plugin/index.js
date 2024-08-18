const minifyJs = require("../compiler/scripts/minify-js")
const minifyHtml = require("../compiler/scripts/minify-html")
const transformAssets = require("./transform-assets")
const { log, sourceSize, getAsset, logSizeDelta } = require("./util")
const { pluginName } = require("./config")
const { readDir, resolve, read, isDirectory, parse } = require("../util")
const { PATH_CWD, PATH_PAGES, PATH_TEMPLATES, PATH_STATIC } = require("../config")
const { JSONToHTML } = require("html-to-json-parser")
const htmlTemplate = require("../compiler/head")
const injectDoctype = require("../compiler/scripts/inject-doctype")
const collectViews = require("../compiler/collect-views")

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

const processStaticAssets = (compilation) => (basepath) =>
  Promise.all(
    readDir(basepath, { recursive: true }).map(async (filename) => {
      const filePath = resolve(basepath, filename)
      if (isDirectory(filePath)) {
        return undefined
      }
      const content = (await read(filePath)).toString()
      const ext = parse(filename).ext
      return await processStatic(filename, content, ext).then((processed) => {
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
      JSONToHTML(htmlTemplate(parse(templateName).name)(read(resolve(PATH_TEMPLATES, templateName)).toString())).then(
        (content) => injectDoctype(content),
      ),
    ),
  )

const processTemplatesPost = (compilation) => (generatedPages) =>
  generatedPages.map(async (content) => {
    // @TODO process tree structure generated pages in PATH_TEMPLATES
    const filename = "index2.html"
    return await processStatic(filename, content, ".html").then((processed) => {
      compilation.assets[filename] = getAsset({
        nextSize: processed.length,
        nextInfo: {},
        nextSource: processed,
      })
    })
  })

const processStatic = async (filename, content, ext) => {
  if (ext === ".html" || ext === ".htm") {
    const minifiedHtml = (await minifyHtml(content)).toString()
    let processedHtml
    if (minifiedHtml.startsWith("<!doctype html>") || minifiedHtml.startsWith("<!DOCTYPE html>")) {
      processedHtml = minifiedHtml
    } else {
      processedHtml = injectDoctype(minifiedHtml)
    }
    logSizeDelta(filename, content.length, processedHtml.length)
    return processedHtml
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
  const publicx = processStaticAssetsImpl(PATH_STATIC)
  const templates = processTemplates().then(processTemplatesPost(compilation))

  const SERVICE_WORKER_PAGES_PLACEHOLDER = '"@@VIEWS@@"'

  // @TODO do not call collectViews() twice
  const collectedViews = collectViews()

  const serviceWorkerContent = read(resolve(PATH_CWD, "compiler-data", "service-worker", "service-worker.js"))
    .toString()
    .replace(SERVICE_WORKER_PAGES_PLACEHOLDER, collectedViews.map((view) => `"${view}"`).join(", "))
  compilation.assets["service-worker.js"] = getAsset({
    nextSize: serviceWorkerContent.length,
    nextInfo: {},
    nextSource: serviceWorkerContent,
  })

  console.log(serviceWorkerContent)

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
