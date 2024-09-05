const { renderWrapperStatic, isEofolTag, mountImpl } = require("../dist/runtime")

const compileEofol = (node, defs, instances) => {
  const mounted = mountImpl(node, instances, defs)
  if (mounted) {
    const { result, attributes, wrap } = mounted
    return wrap ? renderWrapperStatic(result, attributes) : result
  }
}

module.exports = { isEofolTag, compileEofol }
