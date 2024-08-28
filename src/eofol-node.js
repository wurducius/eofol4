const { createPage, createAsset } = require("../compiler")

const generatedTemplate =
  '<div class="container"><h1>Eofol4 app - Generated page</h1><img src="./assets/media/icons/phi.svg" alt="Eofol logo greek letter Phi" height="192px" width="192px" class="phi" /><p id="script">Script not injected.</p></div>'

const generatedScript = "document.getElementById('script').innerHTML = 'Script working!!!'"

const generatedStyles =
  'body { background-image: url("./assets/media/images/rainbow-mountains-peru.jpg"); } .phi { background-color: #1a9595; border-radius: 8px; margin: 32px 0 32px 0; }'

const generatedMetadata = {
  title: "Generated page",
}

const createPages = () => {
  return [
    createPage({
      path: "generated",
      template: generatedTemplate,
      script: generatedScript,
      style: generatedStyles,
      metadata: generatedMetadata,
    }),
    createPage({ path: "generated2", template: "TADA!!!" }),
  ]
}

const createAssets = () => {
  return [createAsset({ path: "g.txt", content: "TADA!!!" })]
}

module.exports = { createPages, createAssets }
