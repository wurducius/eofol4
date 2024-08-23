const clean = require("./clean")
const touchBuildDirs = require("../../compiler/scripts/touch-build-dirs")
// const tsc = require("../tsc")
const webpackBuild = require("../../webpack/webpack-build")

const build = (webpackParams, isHot) => {
  if (!isHot) {
    clean()
    touchBuildDirs()
  }
  // tsc()
  webpackBuild(webpackParams)
}

module.exports = build
