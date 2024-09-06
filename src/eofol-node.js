const { createPage, createAsset } = require("../compiler")
const docsData = require("../docs")

const generatedTemplate =
  '<div class="container"><h1>Eofol4 app - Generated page</h1><img src="./assets/media/icons/phi.svg" alt="Eofol logo greek letter Phi" height="192px" width="192px" class="phi" /><p id="script">Script not injected.</p><div><a href="./index.html">Index page</a></div></div>'

const generatedScript = "document.getElementById('script').innerHTML = 'Script working!!!'"

const generatedStyles = ".phi { background-color: #1a9595; border-radius: 8px; margin: 32px 0 32px 0; }"

const generatedMetadata = {
  title: "Generated page",
}

const docsStyles =
  "html { scroll-behavior: smooth; } body { background-color: #1a202c; font-family: Inter, sans-serif; font-size: 16px; font-weight: 400; color: #edf2f7; url(./assets/media/images/rainbow-mountains-peru.jpg); } .container { margin: 0 auto 0 auto; text-align: center; padding: 32px 32px; } a { color: #30cccc; } a:visited { color: #299393; } a:hover { color: #87e6e6; } a:active { color: #87e6e6; }"

const docsMetadata = {
  title: "Eofol4 docs",
}

const traverseDocs = (data, result, level) => {
  if (typeof data === "object") {
    result = `${result}<h${level} id="${data.title
      .split("")
      .map((letter) => letter.toLowerCase())
      .join("")
      .replaceAll(" ", "-")}">${data.title}</h${level}>`
    if (data.content && data.content.length > 0) {
      result = data.content.reduce((acc, next, i) => traverseDocs(data.content[i], acc, level + 1), result)
    }
  } else {
    result = `${result}<p>${data}</p>`
  }
  return result
}

const traverseDocsSummary = (data, result, level, index, numbering) => {
  if (typeof data === "object") {
    result = `${result}<div><a href="#${data.title
      .split("")
      .map((letter) => letter.toLowerCase())
      .join("")
      .replaceAll(" ", "-")}">${`${index + 1} ${data.title}`}</a></div>`
    if (data.content && data.content.length > 0) {
      result = data.content.reduce(
        (acc, next, i) =>
          traverseDocsSummary(
            data.content[i],
            acc,
            level + 1,
            i,
            `${Number(numbering) > 0 ? numbering : ""}${numbering ? "." : ""}${index + 1}`,
          ),
        result,
      )
    }
  }
  return result
}

const renderDocs = (data) => {
  let summary = ""
  summary = `${summary}${traverseDocsSummary(data, summary, 0, 0, "")}`
  let result = `<div class='container'><div>${summary}</div>`
  result = `${result}${traverseDocs(data, result, 1)}</div>`
  return result
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
    createPage({ path: "docs", template: renderDocs(docsData), style: docsStyles, metadata: docsMetadata }),
  ]
}

const createAssets = () => {
  return [createAsset({ name: "g.txt", content: "TADA!!!" })]
}

module.exports = { createPages, createAssets }
