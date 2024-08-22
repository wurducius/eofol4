const { htmlToJson, jsonToHtml } = require("../compiler")
const { read, resolve } = require("../util")
const { PATH_CWD } = require("../config")

const traverseTree = (node, result) => {
  if (typeof node === "object") {
    result = { type: node.type, attributes: node.attributes, content: [] }
    if (node.content && node.content.length > 0) {
      node.content.map((child, i) => {
        result.content[i] = traverseTree(child, result.content[i])
      })
    }
  } else {
    result = node
  }
  return result
}

const compileTree = (tree, result) => traverseTree(tree, result)

const baseStyles = read(resolve(PATH_CWD, "compiler-data", "styles", "base.css")).toString()

const compile = async (content) => {
  const json = await htmlToJson(content, false)
  const head = json.content.find((child) => child.type === "head")
  head.content.push({ type: "style", content: [baseStyles] })
  const compiled = compileTree(json, {})
  return await jsonToHtml(compiled, true)
}

module.exports = compile
