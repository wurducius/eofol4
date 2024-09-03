const Watchpack = require("watchpack")
const { build, serve } = require("./impl")
const { sleep, primary, success } = require("../util")
const {
  DIRNAME_SRC,
  DIRNAME_PAGES,
  DIRNAME_STATIC,
  DIRNAME_TEMPLATES,
  PROTOCOL,
  HOST,
  PORT,
  HOT_UPDATE_WATCH_INTERNAL_MS,
  HOT_UPDATE_WATCH_POLL,
} = require("../config")
const { cancelPromise, setPromise } = require("../webpack/singleton")
const precompile = require("./impl/precompile")

const COMPILER_SLEEP_INTERVAL_MS = 1000

const sleepInterval = () => sleep(COMPILER_SLEEP_INTERVAL_MS)

const watchpackOptions = {
  aggregateTimeout: HOT_UPDATE_WATCH_INTERNAL_MS,
  poll: HOT_UPDATE_WATCH_POLL,
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
  "runtime",
  "util",
]
const listOfFiles = []
const listOfNotExistingItems = []

const SERVE_URL = `${PROTOCOL}://${HOST}:${PORT}`

const VERBOSE_DEVELOPMENT_SERVER = false

const recompile = async () => {
  cancelPromise()
  setPromise(async () => {
    console.log(primary("Recompiling..."))
    precompile()
    build(true)
    console.log(success(`Recompiled! Serving Eofol4 app now at ${SERVE_URL}.`))
  })
}

const handleChange = async () => {
  await recompile()
}

const handleRemove = async () => {
  await recompile()
}

const startHotReload = () => {
  const wp = new Watchpack(watchpackOptions)

  if (VERBOSE_DEVELOPMENT_SERVER) {
    console.log(primary("Starting the development server..."))
  }

  const handleClose = () => {
    if (VERBOSE_DEVELOPMENT_SERVER) {
      console.log(primary("\nShutting down development server..."))
    }
    wp.close()
    if (VERBOSE_DEVELOPMENT_SERVER) {
      console.log(primary("Development server shut down."))
    }
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
}

build(false)

sleepInterval().then(() => startHotReload())
