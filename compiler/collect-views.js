const { readDir, parse } = require("../util")
const { PATH_PAGES, PATH_TEMPLATES } = require("../config")

const collectViews = () =>
  [...readDir(PATH_PAGES, { recursive: true }), ...readDir(PATH_TEMPLATES, { recursive: true })].filter((filename) => {
    const ext = parse(filename).ext
    return ext === ".html" || ext === ".htm"
  })

module.exports = collectViews
