const { minify } = require("html-minifier-terser")

const argsConfig = {
  minifyHTML: true,
  minifyRegistryJSON: true,
  verbose: false,
  production: true,
}

const defaultConfig = {
  production: false,
  minifyHTML: false,
  minifyRegistryJSON: false,
  verbose: false,
}

const config = { ...defaultConfig, ...argsConfig }

if (argsConfig.production) {
  config.minifyHTML = true
  config.minifyRegistryJSON = true
}

const minifyOptions = {
  continueOnParseError: true,
  removeComments: true,
  minifyHTML: config.minifyHTML,
  minifyCSS: config.minifyHTML,
  minifyJS: config.minifyHTML,
  minifyURLs: config.minifyHTML,
  processScripts: config.minifyHTML,
  collapseWhitespace: config.minifyHTML,
  collapseInlineTagWhitespace: true,
  collapseBooleanAttributes: true,
  noNewlinesBeforeTagClose: true,
  sortAttributes: true,
  sortClassName: true,
}

const minifyHtml = (res) =>
  minify(res, minifyOptions).catch((ex) => {
    console.log("Minify error", ex)
  })

module.exports = minifyHtml
