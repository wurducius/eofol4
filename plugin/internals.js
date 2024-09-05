const { BASE_URL } = require("../config")
const { getVIEWS } = require("../config/internal")
const { getAssets } = require("../dist/runtime")

const getInternals = (instances) => {
  const VIEWS = getVIEWS()
  const env = { BASE_URL: BASE_URL, views: VIEWS }
  const instancesImpl = instances ?? {}
  const vdom = {}
  const assets = getAssets()
  const internals = { instances: instancesImpl, vdom, env, assets }
  return `var internals = ${JSON.stringify(internals)};\n`
}

module.exports = getInternals
