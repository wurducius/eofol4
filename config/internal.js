const collectViews = require("../compiler/collect-views")
const { sep } = require("../util")

const VIEWS = collectViews().map((view) => view.replace(sep, "/"))

const BASE_URL = process.env.BASE_URL

module.exports = { VIEWS, BASE_URL }
