const { createPage, createAsset } = require("../compiler")

const generatedTemplate =
  '<div class="container"><h1>Eofol4 app - Index page</h1><img src="./assets/media/icons/phi.svg" alt="Eofol logo greek letter Phi" height="192px" width="192px" class="phi" /><p id="script">Script not injected.</p></div>'

const generatedScript =
  'export const injectElement = (id: string, content: string, condition?: boolean) => { if ((condition === undefined || condition) && id && isBrowser()) { const scriptElement = document.getElementById(id) if (scriptElement) {   scriptElement.innerHTML = content } }} injectElement("script", "Script injected and working!", true)'

const createPages = async () => {
  return [
    await createPage({ path: "generated", template: generatedTemplate, script: generatedScript }),
    await createPage({ path: "generated2", template: "TADA!!!" }),
  ]
}

const createAssets = async () => {
  createAsset({ path: "g.txt", content: "TADA!!!" })
}

module.exports = { createPages, createAssets }
