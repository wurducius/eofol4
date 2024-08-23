const { COMPILER_EOFOL_TAGS } = require("./constants")
const { logEofolTagHasNoName, logDefNotFound } = require("./logger")
const { findDef } = require("./internals")

const isEofolTag = (tag) => COMPILER_EOFOL_TAGS.includes(tag)

const compileEofol = (node, defs) => {
  const name = node.attributes?.name
  if (!name) {
    logEofolTagHasNoName(node.type)
    return
  }
  const def = findDef(defs, name)
  if (!def) {
    logDefNotFound(name)
    return
  }
  return def.render(
    node.attributes,
    // @TODO either remove whitespace from html before eofol compile or trim children manually like this
    node.content?.filter((x) => typeof x !== "string" || !(x.trim().length === 0)),
  )
}

module.exports = { isEofolTag, compileEofol }
