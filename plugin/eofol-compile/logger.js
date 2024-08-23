const COMPILER_LOG_ERROR_MSG_PREFIX = "Eofol4 compilation error: "

const logCompileError = (msg) => console.log(COMPILER_LOG_ERROR_MSG_PREFIX + msg)

const logDefNotFound = (name) => logCompileError(`Component definition not found for name = "${name}"`)

const logEofolTagHasNoName = (tag) => logCompileError(`Eofol component has no attribute "name" for tagname =  "${tag}"`)

module.exports = { logDefNotFound, logEofolTagHasNoName, logCompileError }
