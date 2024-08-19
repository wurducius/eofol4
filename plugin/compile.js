const { HTMLToJSON, JSONToHTML } = require("html-to-json-parser")

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
  // const json = await HTMLToJSON(content)
  // console.log(json)
  // const compiled = compileTree(json, {})
  // return await JSONToHTML(compiled, false)
  return content
}

module.exports = compile
