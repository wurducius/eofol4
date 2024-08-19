const { readDir, parse, isHtml } = require("../util")
const { PATH_PAGES, PATH_TEMPLATES } = require("../config")

const collectViews = () =>
  [...readDir(PATH_PAGES, { recursive: true }), ...readDir(PATH_TEMPLATES, { recursive: true })].filter((filename) =>
    isHtml(parse(filename).ext),
  )

module.exports = collectViews
