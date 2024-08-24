const { readDir, parse, isHtml } = require("../util")
const { PATH_PAGES, PATH_TEMPLATES, PATH_SRC } = require("../config")
const { exists, resolve } = require("../util/fs")

// @TODO redundant use of parse twice
const collectViews = () =>
  [...readDir(PATH_PAGES, { recursive: true }), ...readDir(PATH_TEMPLATES, { recursive: true })]
    .map((view) => ({ view, parsed: parse(view) }))
    .filter(({ parsed }) => isHtml(parsed.ext))
    .map(({ view, parsed }) => ({
      path: view,
      isStatic:
        !exists(resolve(PATH_SRC, parsed.dir, `${parsed.name}.ts`)) &&
        !exists(resolve(PATH_SRC, parsed.dir, `${parsed.name}.js`)),
    }))

module.exports = collectViews
