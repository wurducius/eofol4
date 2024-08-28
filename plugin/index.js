const transformAssets = require("./transform-assets")
const { log, sourceSize, getAsset, logSizeDelta, getFileSizes } = require("./util")
const { pluginName, PROGRESS_OPTIMIZE_ASSETS } = require("./config")
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
  arrayCombinator,
  exists,
} = require("../util")
const { PATH_CWD, PATH_PAGES, PATH_TEMPLATES, PATH_STATIC, PATH_SRC } = require("../config")
const {
  processSvg,
  processPng,
  processJpeg,
  processGif,
  injectDoctype,
  jsonToHtml,
  htmlTemplate,
  minifyHtml,
  minifyJs,
} = require("../compiler")
const compile = require("./compile")
const { resetProgress, incrementProgress, showProgress } = require("./progress")
const getInternals = require("./internals")
const lifecycle = require("./lifecycle")
const { VIEWS } = require("../config/internal")

const SERVICE_WORKER_PAGES_PLACEHOLDER = '"@@VIEWS@@"'

let progress = {}

const addGeneratedPage = (compilation) => (createdPage) => {
  compilation.assets[createdPage.name] = getAsset({
    nextSize: createdPage.content.length,
    nextInfo: { processed: true },
    nextSource: createdPage.content,
  })
  if (createdPage.script) {
    compilation.assets[createdPage.scriptName] = getAsset({
      nextSize: createdPage.script.length,
      nextInfo: { processed: false },
      nextSource: createdPage.script,
    })
  }
}

const processAssets = (compiler, compilation) => (assets) =>
  transformAssets({
    transformPropertyName: "minified",
    transform: (content) => {
      const x = lifecycle.onOptimizeAssetStart(content)
      const y = minifyJs(`${getInternals()}${x}`)
      return lifecycle.onOptimizeAssetFinished(y)
    },
    logStart: () => {
      log("Minify JS")
    },
    logFinishedAsset: ({ nextSize, source, transform, assetName }) => {
      const prevSize = transform ? sourceSize(source) : nextSize
      logSizeDelta(assetName, prevSize, nextSize)
      if (PROGRESS_OPTIMIZE_ASSETS) {
        progress = incrementProgress(progress, prevSize)
        showProgress(progress, assetName)
      }
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
        const postprocessed = lifecycle.onCompileAssetFinished(processed)
        compilation.assets[filename] = getAsset({
          nextSize: postprocessed.length,
          nextInfo: { processed: true },
          nextSource: postprocessed,
        })
        progress = incrementProgress(progress, postprocessed.length)
        showProgress(progress, filename)
      })
    }),
  )

const processHtml = async (filename, content, info) => {
  if (info?.processed) {
    return content
  }
  const x = lifecycle.onCompileViewStart(content)
  const compiledHtml = await compile(x, filename)
  const y = lifecycle.onCompileViewCompiled(compiledHtml)
  const minifiedHtml = (await minifyHtml(y)).toString()
  let processedHtml
  if (minifiedHtml.startsWith("<!doctype html>") || minifiedHtml.startsWith("<!DOCTYPE html>")) {
    processedHtml = minifiedHtml
  } else {
    processedHtml = injectDoctype(minifiedHtml)
  }
  const z = lifecycle.onCompileViewFinished(processedHtml)
  logSizeDelta(filename, compiledHtml.length + 15, processedHtml.length)
  return z
}

const processStatic = async (filename, basepath, ext, info) => {
  // @TODO Refactor in order to allow passing content as argument to onCompileAssetStart
  lifecycle.onCompileAssetStart()
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
  const serviceWorkerContent = read(resolve(PATH_CWD, "compiler-data", "service-worker", "service-worker.js"))
    .toString()
    .replace(SERVICE_WORKER_PAGES_PLACEHOLDER, VIEWS.map(({ path }) => `"${path.replaceAll(sep, "/")}"`).join(", "))
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
  const templateList = readDir(PATH_TEMPLATES, { recursive: true }).filter((file) => {
    const parsed = parse(resolve(PATH_TEMPLATES, file))
    return !parsed.isDirectory && isHtml(parsed.ext)
  })

  progress = resetProgress(
    getFileSizes(staticList, PATH_STATIC) +
      getFileSizes(pageList, PATH_PAGES) +
      getFileSizes(templateList, PATH_TEMPLATES),
    staticList.length + pageList.length + templateList.length,
  )

  console.log("Compiling assets...")

  const {
    staticList: preprocessedStaticList,
    pageList: preprocessedPageList,
    templateList: preprocessedTemplateList,
  } = lifecycle.onCompileAssetsStart({ staticList, pageList, templateList })

  const staticFiles = processStaticAssetsImpl(PATH_STATIC, preprocessedStaticList)
  const pages = processStaticAssetsImpl(PATH_PAGES, preprocessedPageList)

  const templates = Promise.all(
    preprocessedTemplateList.map((templateName) => {
      const parsed = parse(templateName)
      const isScript = exists(resolve(PATH_SRC, parsed.dir, `${parsed.name}.ts`))
      return jsonToHtml(
        htmlTemplate(parse(templateName).name, isScript)(read(resolve(PATH_TEMPLATES, templateName)).toString()),
      )
        .then((content) => processPage(templateName, content, compilation.assets[templateName]?.info))
        .then((processed) => {
          compilation.assets[templateName] = getAsset({
            nextSize: processed.length,
            nextInfo: { processed: true },
            nextSource: processed,
          })
          progress = incrementProgress(progress, processed.length)
          showProgress(progress, templateName)
        })
    }),
  )

  const nodeScript = require(resolve(PATH_SRC, "eofol-node.js"))
  const createPages = nodeScript.createPages
  let createPagesPromise = undefined
  if (createPages) {
    // @TODO promise handling
    /*
    createPagesPromise = createPages()
      .then((created) => {
        return created.map(async (createdPage) => {
          const processedCreatedHtml = await processPage(createdPage.name, createdPage.content, { processed: true })
          let processedCreatedScript = undefined
          if (createdPage.script) {
            processedCreatedScript = minifyJs(createdPage.script)
          }
          return { ...createdPage, content: processedCreatedHtml, script: processedCreatedScript }
        })
      })
      .then(arrayCombinator(addGeneratedPage(compilation)))
     */
  }

  injectServiceWorker(compilation)

  return Promise.all([staticFiles, pages, templates, createPagesPromise].filter(Boolean)).then((files) => {
    return lifecycle.onCompileAssetsFinished({ staticList: files[0], pageList: files[1], templateList: files[2] })
  })
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
  lifecycle.onCompilationStart()
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
    (assets) => {
      const assetsToOptimize = Object.keys(assets).filter((asset) => asset.endsWith(".js"))
      const preprocessedAssetsToOptimize = lifecycle.onOptimizeAssetsStart(assetsToOptimize)
      const assetSize = preprocessedAssetsToOptimize
        .map((asset) => assets[asset].size())
        .reduce((acc, next) => ({ count: acc.count + 1, size: acc.size + next }), { count: 0, size: 0 })
      if (PROGRESS_OPTIMIZE_ASSETS) {
        progress = resetProgress(assetSize.size, assetSize.count)
        console.log("Optimizing assets...")
      }
      const result = processAssets(compiler, compilation)(assets)
      return lifecycle.onOptimizeAssetsFinished(result)
    },
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
