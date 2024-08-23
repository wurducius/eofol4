const { PATH_DIST } = require("../config")
const rimraf = require("rimraf")

const cleanPaths = [PATH_DIST]

const cleanTsc = () => {
  cleanPaths.forEach((cleanPath) => {
    rimraf.rimrafSync(cleanPath)
  })
}

cleanTsc()
