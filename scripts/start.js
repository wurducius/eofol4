const Watchpack = require("watchpack")
const { build, serve } = require("./impl")
const { sleep, primary, success } = require("../util")
const { DIRNAME_SRC, DIRNAME_PAGES, DIRNAME_STATIC, DIRNAME_TEMPLATES, PROTOCOL, HOST, PORT } = require("../config")

const webpackParams = { mode: "development" }

const watchpackOptions = {
  aggregateTimeout: 250,
  poll: true,
  followSymlinks: true,
  ignored: "**/.git",
}

// const listOfDirectories = [DIRNAME_SRC, DIRNAME_PAGES, DIRNAME_TEMPLATES, DIRNAME_STATIC]
const listOfDirectories = [
  DIRNAME_SRC,
  DIRNAME_PAGES,
  DIRNAME_TEMPLATES,
  DIRNAME_STATIC,
  "compiler",
  "compiler-data",
  "plugin",
  "util",
]
const listOfFiles = []
const listOfNotExistingItems = []

const SERVE_URL = `${PROTOCOL}://${HOST}:${PORT}`

const recompile = async () => {
  console.log(primary("Recompiling..."))
  build(webpackParams, true)
  return await sleep(20).then(() => {
    console.log(success(`Recompiled! Serving Eofol4 app now at ${SERVE_URL}.`))
  })
}

const handleChange = async () => {
  await recompile()
}

const handleRemove = async () => {
  await recompile()
}

build(webpackParams, false)

// @TODO do not sleep instead fix async promise handling in build
sleep(20).then(() => {
  console.log(primary("Starting the development server..."))

  const wp = new Watchpack(watchpackOptions)

  const handleClose = () => {
    console.log(primary("\nShutting down development server..."))
    wp.close()
    console.log(primary("Development server shut down."))
    process.exit(0)
  }

  process.on("SIGINT", handleClose)
  process.on("SIGTERM", handleClose)
  process.on("SIGQUIT", handleClose)

  wp.watch({
    files: listOfFiles,
    directories: listOfDirectories,
    missing: listOfNotExistingItems,
    startTime: Date.now() - 10000,
  })

  wp.on("change", handleChange)
  wp.on("remove", handleRemove)

  serve()
})
