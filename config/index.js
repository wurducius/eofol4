const Env = require("./env")
const Path = require("./path")
const eofolConfig = require("./eofol-config")

module.exports = { ...Env, ...Path, eofolConfig }
