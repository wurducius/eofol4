const clean = require("./clean")
const webpackBuild = require("../../webpack/webpack-build")
const touchBuildDirs = require("../../compiler/scripts/touch-build-dirs")

const build = (webpackParams, isHot) => {
  if (!isHot) {
    clean()
    touchBuildDirs()
  }
  webpackBuild(webpackParams)
}

module.exports = build
