const { touch } = require("../../util")
const {
  PATH_BUILD,
  PATH_ASSETS,
  PATH_JS,
  PATH_CSS,
  PATH_MEDIA,
  PATH_IMAGES,
  PATH_ICONS,
  PATH_FONTS,
} = require("../../config")

const touchBuildDirs = () => {
  touch(PATH_BUILD)
  touch(PATH_ASSETS)
  touch(PATH_JS)
  touch(PATH_CSS)
  touch(PATH_MEDIA)
  touch(PATH_IMAGES)
  touch(PATH_ICONS)
  touch(PATH_FONTS)
}

module.exports = touchBuildDirs
