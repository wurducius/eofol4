const path = require("path")

const webpack = require("webpack")
const { JSONToHTML } = require("html-to-json-parser")

const webpackConfig = require("../../webpack/webpack.config")
const { PATH_CWD, PATH_BUILD, PATH_PUBLIC } = require("../../config")
const { resolve, read, write, touch, isDirectory, readDir, cp } = require("../../util")
const clean = require("./clean")
const htmlTemplate = require("../../compiler/head")

// @TODO handle better tree structure
const copyPublic = () =>
  Promise.all(
    readDir(PATH_PUBLIC, { recursive: true }).map((publicFile) => {
      const source = resolve(PATH_PUBLIC, publicFile)
      if (!isDirectory(source)) {
        return cp(source, resolve(PATH_BUILD, publicFile))
      }
    }),
  )

const build = () => {
  clean()

  touch(PATH_BUILD)

  // @TODO dont do this
  touch(resolve(PATH_BUILD, "fonts"))

  const templatePromises = readDir(resolve(PATH_CWD, "templates")).map((templateName) => {
    const templateContent = read(resolve(PATH_CWD, "templates", templateName)).toString()
    return JSONToHTML(htmlTemplate(path.parse(templateName).name)(templateContent)).then((templateHtml) => {
      write(resolve(PATH_PUBLIC, templateName), templateHtml.toString())
    })
  })

  Promise.all(templatePromises)
    .then(() => copyPublic())
    .then(() => {
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
