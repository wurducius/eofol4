const { resolve } = require("../util")
const { DIRNAME_BUILD, DIRNAME_PUBLIC, DIRNAME_SRC } = require("./env")

const PATH_CWD = resolve(process.cwd())

const PATH_SRC = resolve(PATH_CWD, DIRNAME_SRC)
const PATH_BUILD = resolve(PATH_CWD, DIRNAME_BUILD)
const PATH_PUBLIC = resolve(PATH_CWD, DIRNAME_PUBLIC)

module.exports = { PATH_CWD, PATH_BUILD, PATH_PUBLIC, PATH_SRC }
