const { spawn } = require("../util")
const { spawnOptions } = require("./impl/options")
const { DIRNAME_DIST } = require("../config")

const tsc = () => {
  spawn.sync("tsc", ["-outDir", DIRNAME_DIST, "./runtime/index.ts"], spawnOptions)
}

tsc()
