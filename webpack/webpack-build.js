const webpack = require("webpack")
const getWebpackConfig = require("./webpack.config")
const { PATH_BUILD } = require("../config")

const webpackBuild = () => {
  webpack(getWebpackConfig(), (err, stats) => {
    if (err || stats.hasErrors()) {
      console.log(`Webpack error: ${err}`)
    }
    console.log(`Eofol4 project built at ${PATH_BUILD}`)
  })
}

module.exports = webpackBuild
