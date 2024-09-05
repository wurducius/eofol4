const { htmlToJson, jsonToHtml } = require("../compiler")
const { read, resolve, exists, parse } = require("../util")
const { PATH_BASE_STYLES, PATH_DIST, PATH_PAGES } = require("../config")
const { isEofolTag, compileEofol } = require("./eofol-compile")
const { clearCompileCache, getCompileCache } = require(resolve(PATH_DIST, "runtime"))
const { setCURRENT_VIEW } = require("../dist/runtime")
const { sep } = require("../util/fs")

const importDefs = (scriptPath) => {
  if (exists(scriptPath)) {
    const ViewExport = require(scriptPath)
    return Object.keys(ViewExport).reduce((acc, next) => ({ ...acc, [next]: ViewExport[next] }), {})
  } else {
    return {}
  }
}

const traverseTree = (node, result, defs, instances) => {
  if (typeof node === "object") {
    if (isEofolTag(node.type)) {
      result = compileEofol(node, defs, instances)
    } else {
      result = { type: node.type, attributes: node.attributes, content: [] }
      if (node.content && node.content.length > 0) {
        node.content.map((child, i) => {
          result.content[i] = traverseTree(child, node.content[i], defs, instances)
        })
      }
    }
  } else {
    result = node
  }
  if (result.content) {
    result.content = result.content.filter(Boolean)
  }
  return result
}

const compileTree = (tree, result, defs, instances) => traverseTree(tree, result, defs, instances)

const baseStyles = read(PATH_BASE_STYLES).toString()

const compile = async (content, filename, instances) => {
  clearCompileCache()
  setCURRENT_VIEW(`./${filename.replace(sep, "/").replace("\\", "/")}`)
  const parsed = parse(filename)
  const defs = importDefs(resolve(PATH_DIST, "src", parsed.dir, `${parsed.name}.js`))
  const json = await htmlToJson(content, false)
  instances[filename] = {}
  const viewInstances = instances[filename]
  const compiled = compileTree(json, {}, defs, viewInstances)
  const head = compiled.content.find((child) => child.type === "head")
  // @TODO allow also view styles for PATH_TEMPLATES, possibly also LESS files
  const viewStylesPath = resolve(PATH_PAGES, parsed.dir, `${parsed.name}.css`)
  let viewStyles = ""
  if (exists(viewStylesPath)) {
    viewStyles = read(viewStylesPath).toString()
  }
  head.content.push({ type: "style", content: [baseStyles, viewStyles, getCompileCache()] })
  return await jsonToHtml(compiled, true)
}

module.exports = compile
