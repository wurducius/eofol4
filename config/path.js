const { resolve } = require("../util")
const {
  DIRNAME_BUILD,
  DIRNAME_STATIC,
  DIRNAME_SRC,
  DIRNAME_PAGES,
  DIRNAME_ASSETS,
  DIRNAME_FONTS,
  DIRNAME_ICONS,
  DIRNAME_IMAGES,
  DIRNAME_MEDIA,
  DIRNAME_CSS,
  DIRNAME_JS,
  DIRNAME_TEMPLATES,
} = require("./env")

const PATH_CWD = resolve(process.cwd())

const PATH_SRC = resolve(PATH_CWD, DIRNAME_SRC)
const PATH_BUILD = resolve(PATH_CWD, DIRNAME_BUILD)
const PATH_STATIC = resolve(PATH_CWD, DIRNAME_STATIC)
const PATH_PAGES = resolve(PATH_CWD, DIRNAME_PAGES)
const PATH_ASSETS = resolve(PATH_BUILD, DIRNAME_ASSETS)
const PATH_JS = resolve(PATH_ASSETS, DIRNAME_JS)
const PATH_CSS = resolve(PATH_ASSETS, DIRNAME_CSS)
const PATH_MEDIA = resolve(PATH_ASSETS, DIRNAME_MEDIA)
const PATH_IMAGES = resolve(PATH_MEDIA, DIRNAME_IMAGES)
const PATH_ICONS = resolve(PATH_MEDIA, DIRNAME_ICONS)
const PATH_FONTS = resolve(PATH_MEDIA, DIRNAME_FONTS)
const PATH_TEMPLATES = resolve(PATH_CWD, DIRNAME_TEMPLATES)

module.exports = {
  PATH_CWD,
  PATH_BUILD,
  PATH_STATIC,
  PATH_SRC,
  PATH_PAGES,
  PATH_ASSETS,
  PATH_JS,
  PATH_CSS,
  PATH_MEDIA,
  PATH_IMAGES,
  PATH_ICONS,
  PATH_FONTS,
  PATH_TEMPLATES,
}
