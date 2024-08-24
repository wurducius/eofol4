const { collectViews } = require("../compiler")
const { sep } = require("../util")

const getInternals = () => {
  // @TODO dont call collectViews triple and also do not call per view!!!
  const env = { BASE_URL: process.env.BASE_URL, views: collectViews().map((view) => view.replace(sep, "/")) }
  const instances = {}
  const vdom = {}
  const assets = {}
  const internals = { instances, vdom, env, assets }
  return `var internals = ${JSON.stringify(internals)};\n`
}

module.exports = getInternals
