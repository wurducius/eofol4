const { readDir, resolve, stat, spawn } = require("../../util")
const { PATH_SRC, DIRNAME_DIST, PATH_DIST } = require("../../config")
const spawnOptions = require("./options")
const rimraf = require("rimraf")

const cleanPaths = [PATH_DIST]

const cleanTsc = () => {
  cleanPaths.forEach((cleanPath) => {
    rimraf.rimrafSync(cleanPath)
  })
}

const compileTsc = () => {
  const scripts = readDir(PATH_SRC, { recursive: true })
    .map((filename) => resolve(PATH_SRC, filename))
    .filter((fullPath) => !stat(fullPath).isDirectory())
  spawn.sync("tsc", ["-outDir", resolve(DIRNAME_DIST), ...scripts], spawnOptions)
}

const precompile = () => {
  cleanTsc()
  compileTsc()
}

module.exports = precompile
