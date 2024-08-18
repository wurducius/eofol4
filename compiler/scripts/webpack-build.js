const webpack = require("webpack")
const getWebpackConfig = require("../../webpack/webpack.config")
const { PATH_BUILD } = require("../../config")
const collectViews = require("../collect-views")
const { parse } = require("../../util")

const webpackBuild = (params) => {
  const views = collectViews().map((view) => parse(view).name)

  const webpackParams = { views, ...params }
  const webpackConfig = getWebpackConfig(webpackParams)

  webpack(webpackConfig, (err, stats) => {
    if (err || stats.hasErrors()) {
      console.log(`Webpack error: ${err}`)
    }
    console.log(`Eofol4 project built at ${PATH_BUILD}`)
  })
}

module.exports = webpackBuild
