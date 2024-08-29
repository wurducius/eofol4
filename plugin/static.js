const { parse, resolve, isFont, isHtml, read, isJpeg, isPng, isGif, isSvg, isCSS } = require("../util")
const lifecycle = require("./lifecycle")
const { addAsset } = require("./util")
const { incrementProgress, showProgress, setProgress, getProgress } = require("./progress")
const { processJpeg, processPng, processGif, processSvg } = require("../compiler")
const { processGeneralOutput, processHtml, processCSS } = require("./process")

const processStatic = async (filename, basepath, ext, info) => {
  // @TODO Refactor in order to allow passing content as argument to onCompileAssetStart
  lifecycle.onCompileAssetStart()
  // @TODO preserve static asset dir path
  const filePath = resolve(basepath, filename)

  if (isHtml(ext)) {
    return processHtml(filename, read(filePath).toString(), info)
  }

  if (isJpeg(ext)) {
    return processGeneralOutput(`assets/media/images/${filename}`, processJpeg(filePath))
  }

  if (isPng(ext)) {
    return processGeneralOutput(`assets/media/images/${filename}`, processPng(filePath))
  }

  if (isGif(ext)) {
    return processGeneralOutput(`assets/media/images/${filename}`, processGif(filePath))
  }

  if (isSvg(ext)) {
    return processGeneralOutput(`assets/media/icons/${filename}`, processSvg(filePath))
  }

  if (isCSS(ext)) {
    return processCSS(filename, read(filePath).toString(), info)
  }

  if (isFont(ext)) {
    return processGeneralOutput(`assets/media/fonts/${filename}`, read(filePath))
  }

  return processGeneralOutput(filename, read(filePath))
}

const processStaticAssets = (compilation) => (basepath, files) =>
  Promise.all(
    files.map(async (filename) => {
      const info = compilation.assets[filename]?.info
      return await processStatic(filename, basepath, parse(filename).ext, info).then(async (data) => {
        const staticContent = await data.content
        const postprocessed = lifecycle.onCompileAssetFinished(staticContent)
        addAsset(compilation)(data.path, postprocessed, { processed: true })
        setProgress(incrementProgress(getProgress(), postprocessed.length))
        showProgress(getProgress(), filename)
      })
    }),
  )

module.exports = processStaticAssets
