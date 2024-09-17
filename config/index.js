const Env = require("./env")
const Path = require("./path")
const eofolConfig = require("./eofol-config")
const { setBASE_URL } = require("../dist/runtime")

module.exports = { ...Env, ...Path, eofolConfig }

setBASE_URL(Env.BASE_URL)
