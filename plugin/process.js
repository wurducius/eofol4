const lifecycle = require("./lifecycle")
const { logSizeDelta } = require("./util")
const compile = require("./compile")
const { minifyHtml, injectDoctype } = require("../compiler")

const processGeneralOutput = (path, content) => ({
  path,
  content,
})

const processGeneral = (process, postProcess, pathMutator, lengthOffset) => async (filename, content, info) => {
  const mutatedPath = pathMutator ? pathMutator(filename) : filename
  if (info?.processed) {
    return processGeneralOutput(mutatedPath, content)
  }
  const x = lifecycle.onCompileViewStart(content)
  const processed = process ? await process(x, filename) : x
  const y = lifecycle.onCompileViewCompiled(processed)
  const postProcessed = (postProcess ? await postProcess(y) : y).toString()
  const z = lifecycle.onCompileViewFinished(postProcessed)
  logSizeDelta(filename, processed.length + (lengthOffset ?? 0), z.length)
  return processGeneralOutput(mutatedPath, z)
}

const processHtml = processGeneral(
  (x, filename) => compile(x, filename),
  (y) =>
    minifyHtml(y).then((minifiedHtml) =>
      minifiedHtml.startsWith("<!doctype html>") || minifiedHtml.startsWith("<!DOCTYPE html>")
        ? minifiedHtml
        : injectDoctype(minifiedHtml),
    ),
  undefined,
  15,
)

const processCSS = processGeneral(undefined, undefined, (filename) => `assets/css/${filename}`, undefined)

module.exports = { processCSS, processHtml, processGeneralOutput }
