const { PATH_EOFOL_CONFIG, PATH_EOFOL_CONFIG_DEFAULT } = require("./path")
const { exists } = require("../util/fs")
const { mergeDeep } = require("../util")

const getEofolConfig = () => {
  const configDefault = require(PATH_EOFOL_CONFIG_DEFAULT)
  let configProject = {}
  if (exists(PATH_EOFOL_CONFIG)) {
    configProject = require(PATH_EOFOL_CONFIG)
  }
  return mergeDeep(configProject, configDefault)
}

const eofolConfig = getEofolConfig()

module.exports = eofolConfig
