const clean = require("./clean")
const { touchBuildDirs, webpackBuild } = require("../../compiler")

const build = (webpackParams, isHot) => {
  if (!isHot) {
    clean()
    touchBuildDirs()
  }
  webpackBuild(webpackParams)
}

module.exports = build
