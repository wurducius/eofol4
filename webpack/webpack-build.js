const webpack = require("webpack")
const getWebpackConfig = require("./webpack.config")
const { PATH_BUILD } = require("../config")
const { success, error } = require("../util")

const webpackBuild = () => {
  webpack(getWebpackConfig(), (err, stats) => {
    if (err || stats.hasErrors()) {
      console.log(error(`Webpack error: ${err}`))
    }
    console.log(success(`Eofol4 project built at ${PATH_BUILD}`))
  })
}

module.exports = webpackBuild
