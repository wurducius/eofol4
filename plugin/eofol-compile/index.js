const { COMPILER_EOFOL_TAGS, COMPILER_STATEFUL_WRAPPER_TAG } = require("./constants")
const { logEofolTagHasNoName, logDefNotFound } = require("./logger")
const { findDef } = require("./internals")
const { getInitialState, generateId } = require("../../dist/runtime")

const isEofolTag = (tag) => COMPILER_EOFOL_TAGS.includes(tag)

const renderEofolWrapper = (content, attributes) => ({
  type: COMPILER_STATEFUL_WRAPPER_TAG,
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

  const state = getInitialState(def.initialState)

  const instance = { id, name, state }
  //  saveInstance(id, instance)
  instances[id] = instance

  const attributes = getAttributes(node.attributes, id)

  // @TODO either remove whitespace from html before eofol compile or trim children manually like this
  // node.content?.filter((x) => typeof x !== "string" || !(x.trim().length === 0)),
  // @TODO Fix children prop later after analysis
  const children = []

  const rendered = def.render({ state, attributes, children })

  return renderEofolWrapper(rendered, attributes)
}

module.exports = { isEofolTag, compileEofol }
