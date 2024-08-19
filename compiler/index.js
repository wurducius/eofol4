const Img = require("./scripts/img")

const collectViews = require("./collect-views")
const htmlTemplate = require("./head")

const htmlToJson = require("./scripts/html-to-json")
const jsonToHtml = require("./scripts/json-to-html")
const injectDoctype = require("./scripts/inject-doctype")
const minifyHtml = require("./scripts/minify-html")
const minifyJs = require("./scripts/minify-js")
const touchBuildDirs = require("./scripts/touch-build-dirs")

module.exports = {
  ...Img,
  collectViews,
  htmlTemplate,
  htmlToJson,
  jsonToHtml,
  injectDoctype,
  minifyHtml,
  minifyJs,
  touchBuildDirs,
}
