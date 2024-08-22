const { PROGRESS } = require("./config")

const resetProgress = (totalSize, totalCount) => {
  if (PROGRESS) {
    return {
      indexSize: 0,
      indexCount: 0,
      totalSize,
      totalCount,
    }
  } else {
    return {}
  }
}

const incrementProgress = (data, incrementSize) => {
  if (PROGRESS) {
    return { ...data, indexSize: data.indexSize + incrementSize, indexCount: data.indexCount + 1 }
  } else {
    return {}
  }
}

const showProgress = (data, filename) => {
  if (PROGRESS) {
    console.log(
      `[${data.indexCount}/${data.totalCount}] ${filename} -> ${(100 * (data.indexSize / data.totalSize)).toFixed(0)}%`,
    )
  }
}

module.exports = { resetProgress, incrementProgress, showProgress }
