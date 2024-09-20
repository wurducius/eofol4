const rimraf = require("rimraf")
const { PATH_BUILD } = require("../../config/path")

const cleanPaths = [PATH_BUILD]

const clean = () => {
  cleanPaths.forEach((cleanPath) => {
    rimraf.rimrafSync(cleanPath)
  })
}

module.exports = clean
