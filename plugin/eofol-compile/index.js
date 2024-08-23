const { PATH_DIST } = require("../../config")
const { resolve } = require("../../util")
const { sx } = require(resolve(PATH_DIST, "runtime"))

const COMPILER_LOG_ERROR_MSG_PREFIX = "Eofol4 compilation error: "
const logCompileError = (msg) => console.log(COMPILER_LOG_ERROR_MSG_PREFIX + msg)
const logDefNotFound = (name) => logCompileError(`Component definition not found for name = ${name}`)
const logEofolTagHasNoName = (tag) => logCompileError(`Eofol component has no attribute "name" for tagname =  ${tag}`)

const COMPILER_EOFOL_TAGS = ["e", "eofol"]

const e = (tag, style, content, attributes, properties) => {
  return {
    type: tag,
    attributes: { ...properties, ...attributes, class: style },
    content: Array.isArray(content) ? content : [content],
  }
}

const first = {
  name: "first",
  render: (attributes, children) =>
    e(
      "h1",
      sx({ color: "red" }),
      e(
        "ul",
        undefined,
        ["Eofol compiled!!!", `Attribute eofolAttribute = ${attributes.eofolAttribute}`, ...children].map((child) =>
          e("div", undefined, child),
        ),
      ),
    ),
}

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
  return def.render(node.attributes, node.content)
}

module.exports = { isEofolTag, compileEofol }
