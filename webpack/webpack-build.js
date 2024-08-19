const webpack = require("webpack")
const getWebpackConfig = require("./webpack.config")
const { PATH_BUILD, MODE } = require("../config")
const collectViews = require("../compiler/collect-views")

const webpackBuild = (params) => {
  const views = collectViews()

  const webpackParams = { views, ...params, MODE }
  const webpackConfig = getWebpackConfig(webpackParams)

  webpack(webpackConfig, (err, stats) => {
    if (err || stats.hasErrors()) {
      console.log(`Webpack error: ${err}`)
    }
    console.log(`Eofol4 project built at ${PATH_BUILD}`)
  })
}

module.exports = webpackBuild
