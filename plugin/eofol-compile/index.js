const { PATH_DIST } = require("../../config")
const { resolve } = require("../../util")

const { first } = require(resolve(PATH_DIST, "src", "src", "index.js"))

const COMPILER_LOG_ERROR_MSG_PREFIX = "Eofol4 compilation error: "
const logCompileError = (msg) => console.log(COMPILER_LOG_ERROR_MSG_PREFIX + msg)
const logDefNotFound = (name) => logCompileError(`Component definition not found for name = ${name}`)
const logEofolTagHasNoName = (tag) => logCompileError(`Eofol component has no attribute "name" for tagname =  ${tag}`)

const COMPILER_EOFOL_TAGS = ["e", "eofol"]

const defs = [first]

const findDef = (name) => defs.find((def) => def.name === name)

const isEofolTag = (tag) => COMPILER_EOFOL_TAGS.includes(tag)

const compileEofol = (node) => {
  const name = node.attributes?.name
  if (!name) {
    logEofolTagHasNoName(node.type)
    return
  }
  const def = findDef(name)
  if (!def) {
    logDefNotFound(name)
    return
  }
  return def.render(
    node.attributes,
    // @TODO either remove whitespace from html before eofol compile or trim children manually like this
    node.content?.filter((x) => typeof x !== "string" || !(typeof x === "string" && x.trim().length === 0)),
  )
}

module.exports = { isEofolTag, compileEofol }
