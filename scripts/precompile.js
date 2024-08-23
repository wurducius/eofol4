const rimraf = require("rimraf")
const { options } = require("./impl")
const { DIRNAME_DIST, PATH_SRC, PATH_DIST } = require("../config")
const { resolve, readDir, stat, spawn } = require("../util")

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
  spawn.sync("tsc", ["-outDir", resolve(DIRNAME_DIST, "runtime"), "./runtime/index.ts"], options)
  spawn.sync("tsc", ["-outDir", resolve(DIRNAME_DIST, "src"), ...scripts], options)
}

cleanTsc()
compileTsc()
