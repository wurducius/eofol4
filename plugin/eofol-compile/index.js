const { logEofolTagHasNoName, logDefNotFound } = require("./logger")
const { findDef } = require("./internals")
const { generateId, getInitialState, renderElement, Compiler } = require("../../dist/runtime")

const isEofolTag = (tag) => Compiler.COMPILER_EOFOL_TAGS.includes(tag)

const renderEofolWrapper = (content, attributes) => ({
  type: Compiler.COMPILER_STATEFUL_WRAPPER_TAG,
  attributes,
  content: Array.isArray(content) ? content : [content],
})

const getAttributes = (attributes, id) => {
  const filteredAttributes = { ...attributes }
  delete filteredAttributes["name"]
  const renderedAttributes = { ...filteredAttributes }
  renderedAttributes["id"] = id
  return renderedAttributes
}

const compileEofol = (node, defs, instances) => {
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

  const id = generateId()
  const attributes = getAttributes(node.attributes, id)
  const state = getInitialState(def.initialState)
  const instance = { id, name }
  if (state) {
    instance.state = state
  }
  //  save instance manually because we are using instances from passed arg
  instances[id] = instance
  const children = node.content?.filter((x) => typeof x !== "string" || !(x.trim().length === 0))
  const rendered = renderElement(def, state, attributes, children)

  return renderEofolWrapper(rendered, attributes)
}

module.exports = { isEofolTag, compileEofol }
