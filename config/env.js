require("dotenv").config()
const getArgs = require("./args")

const args = getArgs()

const PORT = 3000
const BROWSER = true
const HOST = "0.0.0.0"
const PROTOCOL = "http"

const DIRNAME_BUILD = "build"
const DIRNAME_SRC = "src"
const DIRNAME_STATIC = "static"
const DIRNAME_PAGES = "pages"
const DIRNAME_ASSETS = "assets"
const DIRNAME_JS = "js"
const DIRNAME_CSS = "css"
const DIRNAME_MEDIA = "media"
const DIRNAME_IMAGES = "images"
const DIRNAME_ICONS = "icons"
const DIRNAME_FONTS = "fonts"
const DIRNAME_TEMPLATES = "templates"

const PAGE_FALLBACK = "404.html"

const HOT_UPDATE_WATCH_INTERNAL_MS = 250
const HOT_UPDATE_WATCH_POLL = true

const IMAGE_PROCESSING_INCLUDE_METADATA = false

const COMPILATION_VERBOSE = false
const COMPILATION_SHOW_PROGRESS = true

const BASE_URL = "./"

const defaultEnv = {
  PORT,
  BROWSER,
  HOST,
  PROTOCOL,
  DIRNAME_BUILD,
  DIRNAME_SRC,
  DIRNAME_STATIC,
  DIRNAME_PAGES,
  DIRNAME_ASSETS,
  DIRNAME_JS,
  DIRNAME_CSS,
  DIRNAME_MEDIA,
  DIRNAME_IMAGES,
  DIRNAME_ICONS,
  DIRNAME_FONTS,
  DIRNAME_TEMPLATES,
  PAGE_FALLBACK,
  HOT_UPDATE_WATCH_INTERNAL_MS,
  HOT_UPDATE_WATCH_POLL,
  BASE_URL,
  IMAGE_PROCESSING_INCLUDE_METADATA,
  COMPILATION_VERBOSE,
  COMPILATION_SHOW_PROGRESS,
}

const randomInteger = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min

const envPre = { ...defaultEnv, ...process.env, ...args }

const getPort = () => {
  if (process.env.PORT === "random") {
    return randomInteger(3000, 8999)
  } else if (
    !process.env.PORT ||
    Number.isNaN(process.env.PORT) ||
    !Number.isFinite(process.env.PORT) ||
    !Number.isInteger(process.env.PORT)
  ) {
    return process.env.PORT
  } else {
    return defaultEnv.PORT
  }
}

const getBaseUrl = () => {
  if (envPre.MODE === "production") {
    return envPre.BASE_URL
  } else {
    return BASE_URL
  }
}

module.exports = { ...envPre, PORT: getPort(), BASE_URL: getBaseUrl() }
