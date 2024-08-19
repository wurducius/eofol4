const { read, resolve } = require("../util")
const { PATH_CWD } = require("../config")

const htmlElement = (tagname, content, attributes) => ({
  type: tagname,
  content,
  attributes,
})

const script = (scriptName) =>
  htmlElement("script", [], {
    src: relativizePath(`./assets/js/${scriptName}.js`),
    async: true,
    defer: true,
  })

/*
compileAllStyles(PATH_BASE_STYLES_CSS, PATH_BASE_STYLES_LESS, "").then((baseStyle) => {
    const metadataPage = requireIfExists(resolve(PATH_PAGES, `${view}${FILENAME_SUFFIX_PAGE_METADATA}`))
    const data = { ...metadataDefault, ...metadataProjectDefault, ...metadataPage }
 */

const relativizePath = (x) => x
const relativizeFontStyle = (x) => x

const baseStyle = read(resolve(PATH_CWD, "compiler-data", "styles", "base.css")).toString()

const getHead = (data) =>
  htmlElement(
    "head",
    [
      htmlElement("meta", [], { charset: "UTF-8" }),
      htmlElement("meta", [], {
        name: "viewport",
        content: "width=device-width, initial-scale=1, shrink-to-fit=no",
      }),
      htmlElement("meta", [], { name: "theme-color", content: data.themeColor }),
      htmlElement("meta", [], { name: "description", content: data.description }),
      htmlElement("meta", [], { property: "og:description", content: data.descriptionOg }),
      htmlElement("meta", [], { name: "keywords", content: data.keywords }),
      htmlElement("meta", [], { name: "author", content: data.author }),
      htmlElement("meta", [], { property: "og:image", content: relativizePath(data.imageOg) }),
      htmlElement("meta", [], { property: "og:image:type", content: data.imageTypeOg }),
      htmlElement("meta", [], { property: "og:image:width", content: data.imageWidthOg }),
      htmlElement("meta", [], { property: "og:image:height", content: data.imageHeightOg }),
      htmlElement("link", [], { rel: "icon", href: relativizePath(data.favicon) }),
      htmlElement("link", [], { rel: "apple-touch-icon", href: relativizePath(data.appleTouchIcon) }),
      htmlElement("link", [], { rel: "manifest", href: relativizePath(data.manifest) }),
      htmlElement("title", [data.title], {}),
      htmlElement("style", [relativizeFontStyle(data.fontStyle), baseStyle], {}),
    ],
    {},
  )

const htmlTemplate = (view) => (body) => {
  const data = require(resolve(PATH_CWD, "compiler-data", "metadata", "metadata-default.js"))
  return htmlElement(
    "html",
    [
      getHead(data),
      htmlElement(
        "body",
        [
          body,
          script("runtime"),
          script("dependencies"),
          script(view),
          htmlElement("noscript", ["You need to enable JavaScript to run this app."], {}),
        ],
        {},
      ),
    ],
    {
      lang: "en",
    },
  )
}

module.exports = htmlTemplate
