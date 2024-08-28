const htmlTemplate = require("../head")
const { JSONToHTML } = require("html-to-json-parser")
const HTMLToJSON = require("../scripts/html-to-json")

const injectStyle = (generatedJson, style) => {
  const headTag = generatedJson.content.find((element) => element.type === "head")
  const styleTag = headTag.content.find((element) => element.type === "style")
  if (styleTag) {
    const styleTagContent = styleTag.content
    if (styleTagContent) {
      styleTag.content.push(style)
    } else {
      styleTag.content = [style]
    }
  } else {
    headTag.content.push({ type: "style", content: [style] })
  }
  return generatedJson
}

const createPage = async (props) => {
  const { path, template, content, metadata, style, script } = props

  const splitPath = path.split("/")
  const name = splitPath[splitPath.length - 1]

  let generatedContent
  if (template) {
    const generatedJson = htmlTemplate(name)(template, Boolean(script), metadata)
    let generatedJsonStyled = generatedJson
    if (style) {
      generatedJsonStyled = injectStyle(generatedJson, style)
    }
    generatedContent = generatedJsonStyled
  } else if (content) {
    let generatedContentStyled = content
    if (style) {
      generatedContentStyled = injectStyle(await HTMLToJSON(generatedContentStyled), style)
    }
    generatedContent = generatedContentStyled
  }
  generatedContent = await JSONToHTML(generatedContent, true)
  return { name: `${name}.html`, content: generatedContent, script, scriptName: `assets/js/${name}.js` }
}

const createAsset = (props) => {
  const { path, content } = props

  console.log(`Creating asset at path = ${path}, content = ${content}`)
}

module.exports = { createPage, createAsset }
