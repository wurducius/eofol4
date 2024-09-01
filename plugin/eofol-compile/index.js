const { COMPILER_EOFOL_TAGS, COMPILER_STATEFUL_WRAPPER_TAG } = require("./constants")
const { logEofolTagHasNoName, logDefNotFound } = require("./logger")
const { findDef } = require("./internals")
const { getInitialState, isBrowser, generateId, getState, getSetState } = require("../../dist/runtime")

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
  const setState = getSetState(id)

  const instance = { id, name, state }
  //  saveInstance(id, instance)
  instances[id] = instance

  const renderedAttributes = getAttributes(node.attributes, id)

  const rendered = def.render(
    state,
    renderedAttributes,
    // @TODO either remove whitespace from html before eofol compile or trim children manually like this
    // node.content?.filter((x) => typeof x !== "string" || !(x.trim().length === 0)),
    // @TODO Fix children prop later after analysis
    [],
  )

  // @TODO move play effect to lifecycle mounted/updated
  if (isBrowser() && def.effect) {
    if (Array.isArray(def.effect)) {
      def.effect.forEach((singleEffect) => {
        const localState = getState(id)
        const localSetState = getSetState(id)
        singleEffect(localState, localSetState)
      })
    } else {
      def.effect(state, setState)
    }
  }

  return renderEofolWrapper(rendered, renderedAttributes)
}

module.exports = { isEofolTag, compileEofol }
