const { spawn } = require("../util")
const { spawnOptions } = require("./impl/options")
const { DIRNAME_DIST, PATH_SRC } = require("../config")
const { resolve, readDir, stat } = require("../util")

const tsc = () => {
  const scripts = readDir(PATH_SRC, { recursive: true })
    .map((filename) => resolve(PATH_SRC, filename))
    .filter((fullPath) => !stat(fullPath).isDirectory())
  spawn.sync("tsc", ["-outDir", resolve(DIRNAME_DIST, "runtime"), "./runtime/index.ts"], spawnOptions)
  spawn.sync("tsc", ["-outDir", resolve(DIRNAME_DIST, "src"), ...scripts], spawnOptions)
}

tsc()
