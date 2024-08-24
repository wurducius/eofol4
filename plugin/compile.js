const { htmlToJson, jsonToHtml } = require("../compiler")
const { read, resolve, exists, parse } = require("../util")
const { PATH_CWD, PATH_DIST, PATH_PAGES } = require("../config")
const { isEofolTag, compileEofol } = require("./eofol-compile")
const { clearCompileCache, getCompileCache } = require(resolve(PATH_DIST, "runtime"))

const importDefs = (scriptPath) => {
  if (exists(scriptPath)) {
    const ViewExport = require(scriptPath)
    return Object.keys(ViewExport).map((viewExport) => ViewExport[viewExport])
  } else {
    return []
  }
}

const traverseTree = (node, result, defs) => {
  if (typeof node === "object") {
    if (isEofolTag(node.type)) {
      result = compileEofol(node, defs)
    } else {
      result = { type: node.type, attributes: node.attributes, content: [] }
      if (node.content && node.content.length > 0) {
        node.content.map((child, i) => {
          result.content[i] = traverseTree(child, node.content[i], defs)
        })
      }
    }
  } else {
    result = node
  }
  return result
}

const compileTree = (tree, result, defs) => traverseTree(tree, result, defs)

const baseStyles = read(resolve(PATH_CWD, "compiler-data", "styles", "base.css")).toString()

// @TODO temporary workaround
const themedStyle = read(resolve(PATH_CWD, "compiler-data", "styles", "themed.css")).toString()

const compile = async (content, filename) => {
  clearCompileCache()
  const parsed = parse(filename)
  const defs = importDefs(resolve(PATH_DIST, "src", parsed.dir, `${parsed.name}.js`))
  const json = await htmlToJson(content, false)
  const compiled = compileTree(json, {}, defs)
  const head = compiled.content.find((child) => child.type === "head")
  // @TODO allow also view styles for PATH_TEMPLATES, possibly also LESS files
  const viewStylesPath = resolve(PATH_PAGES, parsed.dir, `${parsed.name}.css`)
  let viewStyles = ""
  if (exists(viewStylesPath)) {
    viewStyles = read(viewStylesPath).toString()
  }
  head.content.push({ type: "style", content: [baseStyles, themedStyle, viewStyles, getCompileCache()] })
  return await jsonToHtml(compiled, true)
}

module.exports = compile
