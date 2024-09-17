const transformAssets = require("./transform-assets")
const lifecycle = require("./lifecycle")
const { minifyJs } = require("../compiler")
const getInternals = require("./internals")
const { sourceSize, logSizeDelta, trace } = require("./util")
const { PROGRESS_OPTIMIZE_ASSETS } = require("./config")
const { incrementProgress, showProgress, setProgress, getProgress } = require("./progress")
const { isJs, parse } = require("../util")
const { eofolConfig } = require("../config")

const isErrorOverlayEnabled = eofolConfig.env.ERROR_OVERLAY

const isInternalAsset = (asset) => asset === "assets/js/runtime.js" || asset === "assets/js/dependencies.js"

const wrapInternals = (instancesImpl, x) => `${getInternals(instancesImpl)}${x}`

const wrapErrorOverlay = (asset, x) =>
  isErrorOverlayEnabled
    ? `try { ${x} } catch(errorOverlayException) { const errorOverlayFilename = "${asset}"; const [ , errorOverlayExceptionLineno, errorOverlayExceptionColno] = errorOverlayException.stack.match(/(\\d+):(\\d+)/); console.log("ERROR OVERLAY -> " + errorOverlayFilename + " [line " + errorOverlayExceptionLineno + " : column " + errorOverlayExceptionColno + "] " + errorOverlayException.stack); const bodies = document.getElementsByTagName("body"); if (bodies) { const body = bodies.item(0); if (body) { for (let i = 0; i < body.childElementCount; i++) {   body.removeChild(body.childNodes.item(i));  } const overlay = document.createElement("div"); overlay.setAttribute("style","background-color: maroon; color: grey; padding: 64px 64px; font-size: 24px; display: flex; flex-direction: column; align-items: center; height: 100%;"); body.appendChild(overlay); const title = document.createElement("h1"); title.innerHTML = "Error"; const content = document.createElement("div"); content.innerHTML = errorOverlayFilename + " [line " + errorOverlayExceptionLineno + " : column " + errorOverlayExceptionColno + "] " + errorOverlayException.stack; overlay.appendChild(title); overlay.appendChild(content); }} }`
    : x

const processAssets = (compiler, compilation, instances) => async (assets) =>
  await transformAssets({
    transformPropertyName: "minified",
    transform: (content, asset) => {
      const x = lifecycle.onOptimizeAssetStart(content)
      const instancesPath = asset.replace(".js", ".html").replace("assets/js/", "").replaceAll("/", "\\")
      // @TODO FIXME
      const instancesImpl = instances[instancesPath]
        ? instances[instancesPath][instancesPath]
        : instances[instancesPath]
      const y = minifyJs(isInternalAsset(asset) ? x : wrapErrorOverlay(asset, wrapInternals(instancesImpl, x)))
      return lifecycle.onOptimizeAssetFinished(y)
    },
    logStart: () => {
      trace("Minify JS")
    },
    logFinishedAsset: ({ nextSize, source, transform, assetName }) => {
      const prevSize = transform ? sourceSize(source) : nextSize
      logSizeDelta(assetName, prevSize, nextSize)
      if (PROGRESS_OPTIMIZE_ASSETS) {
        setProgress(incrementProgress(getProgress(), prevSize))
        showProgress(getProgress(), assetName)
      }
    },
    conditional: (info, assetName) => !info.minified && isJs(parse(assetName).ext),
  })(
    compiler,
    compilation,
  )(assets)

module.exports = processAssets
