const { htmlToJson, jsonToHtml } = require("../compiler")

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

const compile = async (content) => {
  const json = await htmlToJson(content, false)
  const compiled = compileTree(json, {})
  return await jsonToHtml(compiled, true)
}

module.exports = compile
