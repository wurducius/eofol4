const { resolve } = require("../util")
const { PATH_CWD, PATH_SRC } = require("./path")

const getEofolConfig = () => {
  const configDefault = require(resolve(PATH_CWD, "compiler-data", "eofol-config", "eofol-config-default.js"))
  const configProject = require(resolve(PATH_SRC, "eofol-config.js"))
  return { ...configDefault, ...configProject }
}

const eofolConfig = getEofolConfig()

module.exports = eofolConfig
