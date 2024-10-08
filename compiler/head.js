const { read, resolve, parse, exists } = require("../util")
const { PATH_TEMPLATES, PATH_METADATA_DEFAULT } = require("../config")
const { relativizePath } = require("../dist/runtime")

const htmlElement = (tagname, content, attributes) => ({
  type: tagname,
  content,
  attributes,
})

const script = (scriptName) =>
  htmlElement("script", [], {
    src: relativizePath(`./assets/js/${scriptName}.js`),
    async: "async",
    defer: "defer",
  })

const getHead = (data, viewStyles) =>
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
      htmlElement("style", [relativizePath(data.fontStyle), data.style, viewStyles].filter(Boolean), {}),
    ],
    {},
  )

const htmlTemplate = (view) => (body, isScript, metadataArg) => {
  const parsed = parse(view)
  const viewStylePath = resolve(PATH_TEMPLATES, parsed.dir, `${parsed.name}.css`)
  let viewStyles = ""
  if (exists(viewStylePath)) {
    viewStyles = read(viewStylePath).toString()
  }
  const defaultMetadata = require(PATH_METADATA_DEFAULT)
  let viewMetadata = {}
  if (metadataArg) {
    viewMetadata = metadataArg
  } else {
    const viewMetadataPath = resolve(PATH_TEMPLATES, parsed.dir, `${parsed.name}-metadata.js`)
    if (exists(viewMetadataPath)) {
      viewMetadata = require(viewMetadataPath)
    }
  }
  const data = { ...defaultMetadata, ...viewMetadata }

  return htmlElement(
    "html",
    [
      getHead(data, viewStyles),
      htmlElement(
        "body",
        [
          body,
          script("runtime"),
          script("dependencies"),
          isScript && script(view),
          htmlElement("noscript", ["You need to enable JavaScript to run this app."], {}),
        ].filter(Boolean),
        {},
      ),
    ],
    {
      lang: "en",
    },
  )
}

module.exports = htmlTemplate
