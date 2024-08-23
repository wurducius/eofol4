const { htmlToJson, jsonToHtml } = require("../compiler")
const { read, resolve } = require("../util")
const { PATH_CWD, PATH_DIST } = require("../config")
const { isEofolTag, compileEofol } = require("./eofol-compile")

const { clearCompileCache, getCompileCache } = require(resolve(PATH_DIST, "runtime"))

const traverseTree = (node, result) => {
  if (typeof node === "object") {
    if (isEofolTag(node.type)) {
      result = compileEofol(node)
    } else {
      result = { type: node.type, attributes: node.attributes, content: [] }
      if (node.content && node.content.length > 0) {
        node.content.map((child, i) => {
          result.content[i] = traverseTree(child, node.content[i])
        })
      }
    }
  } else {
    result = node
  }
  return result
}

const compileTree = (tree, result) => traverseTree(tree, result)

const baseStyles = read(resolve(PATH_CWD, "compiler-data", "styles", "base.css")).toString()

const compile = async (content) => {
  clearCompileCache()
  const json = await htmlToJson(content, false)
  const compiled = compileTree(json, {})
  const head = compiled.content.find((child) => child.type === "head")
  head.content.push({ type: "style", content: [baseStyles, getCompileCache()] })
  return await jsonToHtml(compiled, true)
}

module.exports = compile
