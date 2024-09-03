const { Compiler, isEofolTag, mountImpl } = require("../../dist/runtime")

// @TODO REFACTOR use runtime createWrapper together with json2html
const renderEofolWrapper = (content, attributes) => ({
  type: Compiler.COMPILER_STATEFUL_WRAPPER_TAG,
  attributes,
  content: Array.isArray(content) ? content : [content],
})

const compileEofol = (node, defs, instances) => {
  const mounted = mountImpl(node, instances, defs)
  if (mounted) {
    const { result, attributes } = mounted
    return renderEofolWrapper(result, attributes)
  }
}

module.exports = { isEofolTag, compileEofol }
