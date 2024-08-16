const path = require("path")

const webpack = require("webpack")
const { JSONToHTML } = require("html-to-json-parser")

const webpackConfig = require("../../webpack/webpack.config")
const { PATH_CWD, PATH_BUILD, PATH_PUBLIC } = require("../../config")
const { resolve, read, write, touch, readDir } = require("../../util")
const clean = require("./clean")
const htmlTemplate = require("../../compiler/head/head")

const build = () => {
  clean()

  touch(PATH_BUILD)

  // @TODO dont do this
  touch(resolve(PATH_BUILD, "assets"))
  touch(resolve(PATH_BUILD, "assets", "media"))
  touch(resolve(PATH_BUILD, "assets", "media", "images"))
  touch(resolve(PATH_BUILD, "assets", "media", "icons"))
  touch(resolve(PATH_BUILD, "assets", "media", "fonts"))

  const templatePromises = readDir(resolve(PATH_CWD, "templates")).map((templateName) =>
    JSONToHTML(
      htmlTemplate(path.parse(templateName).name)(read(resolve(PATH_CWD, "templates", templateName)).toString()),
    ).then((templateHtml) => {
      write(resolve(PATH_PUBLIC, templateName), templateHtml.toString())
    }),
  )

  Promise.all(templatePromises).then(() => {
    const webpackConfigImpl = { ...webpackConfig, mode: "production" }
    webpack(webpackConfigImpl, (err, stats) => {
      if (err || stats.hasErrors()) {
        console.log(`Webpack error: ${err}`)
      }
      console.log(`Eofol4 project built at ${PATH_BUILD}`)
    })
  })
}

module.exports = build
