const { primary, readDir, isDirectory, resolve, parse, isHtml, read, exists } = require("../util")
const { PATH_STATIC, PATH_PAGES, PATH_TEMPLATES, PATH_SRC, PATH_EOFOL_NODE } = require("../config")
const { resetProgress, incrementProgress, showProgress, setProgress, getProgress } = require("./progress")
const { getFileSizes, addAsset, injectServiceWorker, info } = require("./util")
const lifecycle = require("./lifecycle")
const { jsonToHtml, htmlTemplate, minifyJs } = require("../compiler")
const processStaticAssets = require("./static")
const { processHtml } = require("./process")
const { pushVIEW } = require("../config/internal")

const processViews = async (compiler, compilation, instances) => {
  const processStaticAssetsImpl = processStaticAssets(compilation, instances)

  const staticList = readDir(PATH_STATIC, { recursive: true }).filter(
    (file) => !isDirectory(resolve(PATH_STATIC, file)),
  )
  const pageList = readDir(PATH_PAGES, { recursive: true }).filter(
    (file) => !isDirectory(resolve(PATH_PAGES, file)) && parse(file).ext !== ".css",
  )
  const templateList = readDir(PATH_TEMPLATES, { recursive: true }).filter((file) => {
    const parsed = parse(resolve(PATH_TEMPLATES, file))
    return !parsed.isDirectory && isHtml(parsed.ext)
  })

  setProgress(
    resetProgress(
      getFileSizes(staticList, PATH_STATIC) +
        getFileSizes(pageList, PATH_PAGES) +
        getFileSizes(templateList, PATH_TEMPLATES),
      staticList.length + pageList.length + templateList.length,
    ),
  )

  info(primary("Compiling assets..."))

  const {
    staticList: preprocessedStaticList,
    pageList: preprocessedPageList,
    templateList: preprocessedTemplateList,
  } = lifecycle.onCompileAssetsStart({ staticList, pageList, templateList })

  const staticFiles = processStaticAssetsImpl(PATH_STATIC, preprocessedStaticList)
  const pages = processStaticAssetsImpl(PATH_PAGES, preprocessedPageList)

  const templates = await Promise.all(
    preprocessedTemplateList.map((templateName) => {
      const parsed = parse(templateName)
      return jsonToHtml(
        htmlTemplate(parsed.name)(
          read(resolve(PATH_TEMPLATES, templateName)).toString(),
          exists(resolve(PATH_SRC, parsed.dir, `${parsed.name}.ts`)),
          undefined,
        ),
      )
        .then((content) => processHtml(instances)(templateName, content, compilation.assets[templateName]?.info))
        .then((processed) => {
          addAsset(compilation)(templateName, processed.content, { processed: true })
          setProgress(incrementProgress(getProgress(), processed.content.length))
          showProgress(getProgress(), templateName)
        })
    }),
  )

  let createPagesPromise = undefined
  let createAssetsPromise = undefined
  if (exists(PATH_EOFOL_NODE)) {
    const nodeScript = require(PATH_EOFOL_NODE)
    const createPages = nodeScript.createPages
    const addAssetImpl = addAsset(compilation)
    if (createPages) {
      const createdPagesFirstPromise = await Promise.all(createPages())
      createPagesPromise = await Promise.all(
        createdPagesFirstPromise.map(async (createdPage) => {
          pushVIEW(createdPage.name, !createdPage.script)
          const processedCreatedHtml = await processHtml(instances)(createdPage.name, createdPage.content, {})
          const processedCreatedScript = createdPage.script ? minifyJs(createdPage.script) : createdPage.script
          addAssetImpl(createdPage.name, processedCreatedHtml.content, { processed: true })
          if (createdPage.script) {
            addAssetImpl(createdPage.scriptName, processedCreatedScript, { processed: true })
          }
          return processedCreatedHtml
        }),
      )
    }

    // @TODO move somewhere else generateAssets
    const createAssets = nodeScript.createAssets
    if (createAssets) {
      createAssetsPromise = await Promise.all(createAssets()).then((createdAssets) =>
        createdAssets.map((createdAsset) => {
          addAssetImpl(createdAsset.name, createdAsset.content, {})
        }),
      )
    }
  }

  injectServiceWorker(compilation)

  return await Promise.all(
    [staticFiles, pages, templates, createPagesPromise, createAssetsPromise].filter(Boolean),
  ).then((files) => {
    return lifecycle.onCompileAssetsFinished({ staticList: files[0], pageList: files[1], templateList: files[2] })
  })
}

module.exports = processViews
