const collectViews = require("../compiler/collect-views")
const { sep } = require("../util")

const getVIEWPath = (path) => path.replaceAll(sep, "/")

const VIEWS = collectViews().map((data) => ({ ...data, path: getVIEWPath(data.path) }))

const getVIEWS = () => VIEWS

const BASE_URL = process.env.BASE_URL

module.exports = { getVIEWS, VIEWS, BASE_URL }
