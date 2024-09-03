const clean = require("./clean")
const touchBuildDirs = require("../../compiler/scripts/touch-build-dirs")
const webpackBuild = require("../../webpack/webpack-build")

const build = (isHot) => {
  if (!isHot) {
    clean()
    touchBuildDirs()
  }
  webpackBuild()
}

module.exports = build
