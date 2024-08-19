const jpegOptions = { quality: 25 }

const pngOptions = { compressionLevel: 9, quality: 60, effort: 10 }

const svgOptions = (filePath) => ({
  path: filePath,
  multipass: true,
})

module.exports = { jpegOptions, pngOptions, svgOptions }
