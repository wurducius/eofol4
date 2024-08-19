const { htmlToJson, jsonToHtml } = require("../compiler")
const { read, resolve } = require("../util")
const { PATH_CWD } = require("../config")

const traverseTree = (node, result) => {
  result = node

  if (node.content) {
    return node.content.map((child, i) => {
      return traverseTree(child, result[i])
    })
  } else {
    return result
  }
}

const compileTree = (tree, result) => {
  // console.log(tree)
  //const x = traverseTree(tree, result)
  // console.log(x)
  return tree
}

const baseStyles = read(resolve(PATH_CWD, "compiler-data", "styles", "base.css")).toString()

const compile = async (content) => {
  const json = await htmlToJson(content, false)
  const head = json.content.find((child) => child.type === "head")
  head.content.push({ type: "style", content: [baseStyles] })
  const compiled = compileTree(json, {})
  return await jsonToHtml(compiled, true)
}

module.exports = compile
