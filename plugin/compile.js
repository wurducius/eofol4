// const htmlToJson = require("../compiler/scripts/html-to-json")
// const jsonToHtml = require("../compiler/scripts/json-to-html")

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
  const x = traverseTree(tree, result)
  // console.log(x)
  return x
}

const compile = async (content) => {
  /*
  const json = await htmlToJson(content)
  const compiled = compileTree(json, {})
  return await jsonToHtml(compiled, false)
   */
  return content
}

module.exports = compile
