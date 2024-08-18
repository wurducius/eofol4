const clean = require("./clean")
const { touchBuildDirs, webpackBuild } = require("../../compiler")

const build = () => {
  clean()
  touchBuildDirs()
  webpackBuild()
}

module.exports = build
