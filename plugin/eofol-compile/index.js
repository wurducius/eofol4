const { logEofolTagHasNoName, logDefNotFound } = require("./logger")
const {
  generateId,
  getInitialState,
  renderElement,
  Compiler,
  saveStatefulInstanceImpl,
  getDefImpl,
  isEofolTag,
  filterChildren,
} = require("../../dist/runtime")

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
  const def = getDefImpl(defs)(name)
  if (!def) {
    logDefNotFound(name)
    return
  }

  const id = generateId()
  const attributes = getAttributes(node.attributes, id)
  const state = getInitialState(def.initialState)
  saveStatefulInstanceImpl(instances)(id, name, attributes, state)
  const children = filterChildren(node.content)
  const rendered = renderElement(def, state, attributes, children)

  return renderEofolWrapper(rendered, attributes)
}

module.exports = { isEofolTag, compileEofol }
