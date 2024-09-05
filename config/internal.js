const collectViews = require("../compiler/collect-views")
const { sep } = require("../util")

const getVIEWPath = (path) => path.replaceAll(sep, "/")

const VIEWS = collectViews().map((data) => ({ ...data, path: getVIEWPath(data.path) }))

const getVIEWS = () => VIEWS

const pushVIEW = (viewName, isStatic) => {
  const nextViewPath = getVIEWPath(viewName)
  const saved = VIEWS.find((VIEW) => VIEW.path === nextViewPath)
  if (!saved) {
    VIEWS.push({ path: nextViewPath, isStatic })
  }
}

const BASE_URL = process.env.BASE_URL

module.exports = { getVIEWS, pushVIEW, VIEWS, BASE_URL }
