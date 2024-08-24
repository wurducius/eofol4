const { BASE_URL } = require("../config")
const { VIEWS } = require("../config/internal")

const getInternals = () => {
  const env = { BASE_URL: BASE_URL, views: VIEWS }
  const instances = {}
  const vdom = {}
  const assets = {}
  const internals = { instances, vdom, env, assets }
  return `var internals = ${JSON.stringify(internals)};\n`
}

module.exports = getInternals
