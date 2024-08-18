const webpack = require("webpack")
const webpackConfig = require("../../webpack/webpack.config")
const { PATH_BUILD } = require("../../config")

const webpackBuild = () => {
  const webpackConfigImpl = { ...webpackConfig, mode: "production" }

  webpack(webpackConfigImpl, (err, stats) => {
    if (err || stats.hasErrors()) {
      console.log(`Webpack error: ${err}`)
    }
    console.log(`Eofol4 project built at ${PATH_BUILD}`)
  })
}

module.exports = webpackBuild
