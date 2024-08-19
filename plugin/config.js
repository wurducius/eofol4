const { COMPILATION_VERBOSE, COMPILATION_SHOW_PROGRESS } = require("../config")

const pluginName = "eofol4-compiler"

const VERBOSE = COMPILATION_VERBOSE === "true" || COMPILATION_VERBOSE === true
const PROGRESS = COMPILATION_SHOW_PROGRESS === "true" || COMPILATION_SHOW_PROGRESS === true

module.exports = { pluginName, VERBOSE, PROGRESS }
