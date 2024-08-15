require("dotenv").config()

const PORT = 3000
const BROWSER = true
const HOST = "0.0.0.0"
const PROTOCOL = "http"

const DIRNAME_BUILD = "build"
const DIRNAME_SRC = "src"
const DIRNAME_PUBLIC = "public"

const PAGE_FALLBACK = "404.html"

const defaultEnv = { PORT, BROWSER, HOST, PROTOCOL, DIRNAME_BUILD, DIRNAME_SRC, DIRNAME_PUBLIC, PAGE_FALLBACK }

const randomInteger = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min

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

module.exports = { ...defaultEnv, ...process.env, PORT: getPort() }
