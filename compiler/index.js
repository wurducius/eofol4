const injectDoctype = require("./scripts/inject-doctype")
const htmlTemplate = require("./head/head")
const minifyHtml = require("./scripts/minify-html")
const minifyJs = require("./scripts/minify-js")
const touchBuildDirs = require("./scripts/touch-build-dirs")
const webpackBuild = require("./scripts/webpack-build")

module.exports = { injectDoctype, htmlTemplate, minifyHtml, minifyJs, touchBuildDirs, webpackBuild }
