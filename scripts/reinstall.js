const { execSync, spawn } = require("child_process")
const fs = require("fs")
const { resolve } = require("path")

const PATH_CWD = process.cwd()

const PATH_PACKAGE_LOCK = resolve(PATH_CWD, "package-lock.json")
const PATH_NODE_MODULES = resolve(PATH_CWD, "node_modules")

const spawnOptions = { shell:true}

const rm = fs.rmSync
const exists = fs.existsSync

let isCacheClean = false
if (process.argv.length >= 3 && process.argv[2] && process.argv[2] === "-c") {
  isCacheClean = true
}

if (exists(PATH_PACKAGE_LOCK)) {
  rm(PATH_PACKAGE_LOCK)
}

if (exists(PATH_NODE_MODULES)) {
  rm(PATH_NODE_MODULES)
}

if (isCacheClean) {
  execSync("npm cache clean --force")
}


const install = spawn("npm", ["i"], spawnOptions)

install.on("error", (data) => {
  console.log(`ERROR: ${data}`)
})
install.on("close", () => {
  process.exit(0)
})
