const { renderEofolWrapper, isEofolTag, mountImpl } = require("../dist/runtime")

const compileEofol = (node, defs, instances) => {
  const mounted = mountImpl(node, instances, defs)
  if (mounted) {
    const { result, attributes } = mounted
    return renderEofolWrapper(result, attributes)
  }
}

module.exports = { isEofolTag, compileEofol }
