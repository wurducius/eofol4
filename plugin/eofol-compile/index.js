const { COMPILER_EOFOL_TAGS } = require("./constants")
const { logEofolTagHasNoName, logDefNotFound } = require("./logger")
const { findDef } = require("./internals")
const { getInitialState, isBrowser, generateId, getSetState } = require("../../dist/runtime")

const isEofolTag = (tag) => COMPILER_EOFOL_TAGS.includes(tag)

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

  const renderedAttributes = { ...node.attributes, id }

  const rendered = def.render(
    state,
    renderedAttributes,
    // @TODO either remove whitespace from html before eofol compile or trim children manually like this
    node.content?.filter((x) => typeof x !== "string" || !(x.trim().length === 0)),
  )
  rendered.attributes = renderedAttributes

  // @TODO move play effect to lifecycle mounted/updated
  if (isBrowser() && def.effect) {
    def.effect(state, setState)
  }

  return { type: "div", attributes: { id, name }, content: Array.isArray(rendered) ? rendered : [rendered] }
}

module.exports = { isEofolTag, compileEofol }
