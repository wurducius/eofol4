const { BASE_URL } = require("../config")
const { VIEWS } = require("../config/internal")

const getInternals = (instances) => {
  const env = { BASE_URL: BASE_URL, views: VIEWS }
  const instancesImpl = instances ?? {}
  const vdom = {}
  const assets = {
    pages: VIEWS.map(({ path }) => path),
    scripts: VIEWS.filter(({ isStatic }) => !isStatic).map(({ path }) => path),
    images: [],
    other: [],
  }
  const internals = { instances: instancesImpl, vdom, env, assets }
  return `var internals = ${JSON.stringify(internals)};\n`
}

module.exports = getInternals
