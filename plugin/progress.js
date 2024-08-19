const { PROGRESS } = require("./config")

const resetProgress = (total) => {
  if (PROGRESS) {
    return {
      index: 0,
      total,
    }
  } else {
    return {}
  }
}

const incrementProgress = (data) => {
  if (PROGRESS) {
    return { ...data, index: data.index + 1 }
  } else {
    return {}
  }
}

const showProgress = (data, filename) => {
  if (PROGRESS) {
    console.log(`[${data.index}/${data.total}] ${filename} -> ${(100 * (data.index / data.total)).toFixed(0)}%`)
  }
}

module.exports = { resetProgress, incrementProgress, showProgress }
