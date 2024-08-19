const transformAssets = require("./transform-assets")
const { log, sourceSize, getAsset, logSizeDelta } = require("./util")
const { pluginName } = require("./config")
const {
  isHtml,
  isJpeg,
  isPng,
  isSvg,
  isGif,
  isJs,
  readDir,
  resolve,
  read,
  isDirectory,
  parse,
  sep,
} = require("../util")
const { PATH_CWD, PATH_PAGES, PATH_TEMPLATES, PATH_STATIC } = require("../config")
const {
  processSvg,
  processPng,
  processJpeg,
  processGif,
  injectDoctype,
  collectViews,
  jsonToHtml,
  htmlTemplate,
  minifyHtml,
  minifyJs,
} = require("../compiler")
const compile = require("./compile")
const { resetProgress, incrementProgress, showProgress } = require("./progress")

let progress = {}

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
    conditional: (info, assetName) => !info.minified && isJs(parse(assetName).ext),
  })(
    compiler,
    compilation,
  )(assets)

const processStaticAssets = (compilation) => (basepath, files) =>
  Promise.all(
    files.map(async (filename) => {
      const info = compilation.assets[filename]?.info
      return await processStatic(filename, basepath, parse(filename).ext, info).then((processed) => {
        compilation.assets[filename] = getAsset({
          nextSize: processed.length,
          nextInfo: { processed: true },
          nextSource: processed,
        })
        progress = incrementProgress(progress)
        showProgress(progress, filename)
      })
    }),
  )

const processHtml = async (filename, content, info) => {
  if (info?.processed) {
    return content
  }
  const compiledHtml = await compile(content)
  const minifiedHtml = (await minifyHtml(compiledHtml)).toString()
  let processedHtml
  if (minifiedHtml.startsWith("<!doctype html>") || minifiedHtml.startsWith("<!DOCTYPE html>")) {
    processedHtml = minifiedHtml
  } else {
    processedHtml = injectDoctype(minifiedHtml)
  }
  logSizeDelta(filename, compiledHtml.length + 15, processedHtml.length)
  return processedHtml
}

const processStatic = async (filename, basepath, ext, info) => {
  const filePath = resolve(basepath, filename)

  if (isHtml(ext)) {
    return processHtml(filename, read(filePath).toString(), info)
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

const processPage = async (filename, content, info) => await processHtml(filename, content, info)

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

  const staticList = readDir(PATH_STATIC, { recursive: true }).filter(
    (file) => !isDirectory(resolve(PATH_STATIC, file)),
  )
  const pageList = readDir(PATH_PAGES, { recursive: true }).filter((file) => !isDirectory(resolve(PATH_PAGES, file)))
  const templateList = readDir(PATH_TEMPLATES, { recursive: true }).filter(
    (file) => !isDirectory(resolve(PATH_TEMPLATES, file)),
  )

  progress = resetProgress(staticList.length + pageList.length + templateList.length)
  showProgress(progress, "(compilation start)")

  const staticFiles = processStaticAssetsImpl(PATH_STATIC, staticList)
  const pages = processStaticAssetsImpl(PATH_PAGES, pageList)

  const templates = Promise.all(
    templateList.map((templateName) =>
      jsonToHtml(htmlTemplate(parse(templateName).name)(read(resolve(PATH_TEMPLATES, templateName)).toString()))
        .then((content) => processPage(templateName, content, compilation.assets[templateName]?.info))
        .then((processed) => {
          compilation.assets[templateName] = getAsset({
            nextSize: processed.length,
            nextInfo: { processed: true },
            nextSource: processed,
          })
          progress = incrementProgress(progress)
          showProgress(progress, templateName)
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
