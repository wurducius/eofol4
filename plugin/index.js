const minifyJs = require("../compiler/scripts/minify-js")
const minifyHtml = require("../compiler/scripts/minify-html")
const transformAssets = require("./transform-assets")
const { log, sourceSize, getAsset, logSizeDelta } = require("./util")
const { pluginName } = require("./config")
const { readDir, resolve, read, isDirectory, parse } = require("../util")
const { PATH_CWD, PATH_PAGES, PATH_TEMPLATES, PATH_STATIC } = require("../config")
const htmlTemplate = require("../compiler/head")
const injectDoctype = require("../compiler/scripts/inject-doctype")
const collectViews = require("../compiler/collect-views")
const compile = require("./compile")
const { isHtml, isJpeg, isPng, isSvg, isGif } = require("../util/ext")
const jsonToHtml = require("../compiler/scripts/json-to-html")
const { processSvg, processPng, processJpeg, processGif } = require("../compiler/scripts/img")
const { sep } = require("path")

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
      return await processStatic(filename, basepath, parse(filename).ext).then((processed) => {
        compilation.assets[filename] = getAsset({
          nextSize: processed.length,
          nextInfo: {},
          nextSource: processed,
        })
      })
    }),
  )

const processHtml = async (filename, content) => {
  const compiledHtml = await compile(content)
  const minifiedHtml = (await minifyHtml(compiledHtml)).toString()
  let processedHtml
  if (minifiedHtml.startsWith("<!doctype html>") || minifiedHtml.startsWith("<!DOCTYPE html>")) {
    processedHtml = minifiedHtml
  } else {
    processedHtml = injectDoctype(minifiedHtml)
  }
  logSizeDelta(filename, content.length, processedHtml.length)
  return processedHtml
}

const processStatic = async (filename, basepath, ext) => {
  const filePath = resolve(basepath, filename)

  if (isHtml(ext)) {
    return processHtml(filename, read(filePath).toString())
  }

  if (isJpeg(ext)) {
    return processJpeg(filePath)
  }

  if (isPng(ext)) {
    return processPng(filePath)
  }

  if (isGif(ext)) {
    return processGif(filePath)
  }

  if (isSvg(ext)) {
    return processSvg(filePath)
  }

  return read(filePath)
}

const processPage = async (filename, content) => await processHtml(filename, content)

const injectServiceWorker = (compilation) => {
  const SERVICE_WORKER_PAGES_PLACEHOLDER = '"@@VIEWS@@"'

  // @TODO do not call collectViews() twice
  const collectedViews = collectViews()

  const serviceWorkerContent = read(resolve(PATH_CWD, "compiler-data", "service-worker", "service-worker.js"))
    .toString()
    .replace(
      SERVICE_WORKER_PAGES_PLACEHOLDER,
      collectedViews.map((view) => `"${view.replaceAll(sep, "/")}"`).join(", "),
    )
  compilation.assets["service-worker.js"] = getAsset({
    nextSize: serviceWorkerContent.length,
    nextInfo: {},
    nextSource: serviceWorkerContent,
  })
}

const processViews = (compiler, compilation) => {
  const processStaticAssetsImpl = processStaticAssets(compilation)
  const staticFiles = processStaticAssetsImpl(PATH_STATIC)
  const pages = processStaticAssetsImpl(PATH_PAGES)

  const templates = Promise.all(
    readDir(PATH_TEMPLATES).map((templateName) =>
      jsonToHtml(htmlTemplate(parse(templateName).name)(read(resolve(PATH_TEMPLATES, templateName)).toString()))
        .then((content) => injectDoctype(content))
        .then((content) => processPage(templateName, content))
        .then((processed) => {
          compilation.assets[templateName] = getAsset({
            nextSize: processed.length,
            nextInfo: {},
            nextSource: processed,
          })
        }),
    ),
  )

  injectServiceWorker(compilation)

  return Promise.all([staticFiles, pages, templates])
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
  // console.log("Eofol4 build")
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
