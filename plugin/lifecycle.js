// ========= COMPILATION  =========

const onCompilationStart = () => {}

const onCompilationFinished = () => {}

// ========= COMPILE ASSETS  =========

const onCompileAssetsStart = ({ staticList, pageList, templateList }) => ({ staticList, pageList, templateList })

const onCompileAssetStart = (content) => {
  return content
}

const onCompileAssetFinished = (content) => {
  return content
}

const onCompileAssetsFinished = ({ staticList, pageList, templateList }) => ({ staticList, pageList, templateList })

// ========= OPTIMIZE VIEWS  =========

const onCompileViewStart = (content) => content

const onCompileViewCompiled = (content) => content

const onCompileViewFinished = (content) => content

// ========= OPTIMIZE ASSETS  =========

const onOptimizeAssetsStart = (files) => files

const onOptimizeAssetStart = (content) => {
  return content
}

const onOptimizeAssetFinished = (content) => {
  return content
}

const onOptimizeAssetsFinished = (files) => files

const lifecycle = {
  onCompilationStart,
  onCompilationFinished,
  onCompileAssetsStart,
  onCompileAssetStart,
  onCompileAssetFinished,
  onCompileAssetsFinished,
  onCompileViewStart,
  onCompileViewCompiled,
  onCompileViewFinished,
  onOptimizeAssetsStart,
  onOptimizeAssetStart,
  onOptimizeAssetFinished,
  onOptimizeAssetsFinished,
}

module.exports = lifecycle
