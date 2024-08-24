const { readDir, resolve, stat, spawn, parse } = require("../../util")
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
    .filter(
      (fullPath) =>
        !stat(fullPath).isDirectory() && parse(fullPath).ext === ".ts" && !fullPath.endsWith("-metadata.js"),
    )
  spawn.sync("tsc", ["-outDir", resolve(DIRNAME_DIST), ...scripts], spawnOptions)
}

const precompile = () => {
  cleanTsc()
  compileTsc()
}

module.exports = precompile
