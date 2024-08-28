const htmlTemplate = require("../head")
const { JSONToHTML } = require("html-to-json-parser")

const createPage = async (props) => {
  const { path, template, content, metadata, styles, script } = props

  const splitPath = path.split("/")
  const name = splitPath[splitPath.length - 1]

  let generatedContent = ""
  if (template) {
    const generatedJson = htmlTemplate(name)(template, Boolean(script))
    generatedContent = await JSONToHTML(generatedJson, true)
  } else if (content) {
    generatedContent = content
  }

  return { name: `${name}.html`, content: generatedContent, script, scriptName: `assets/js/${name}.js` }
}

const createAsset = (props) => {
  const { path, content } = props

  console.log(`Creating asset at path = ${path}`)
}

module.exports = { createPage, createAsset }
