const jpegOptions = { quality: 25, mozjpeg: true, force: true }

const pngOptions = { compressionLevel: 9, quality: 60, effort: 10, adaptiveFiltering: true, force: true }

const gifOptions = { force: true }

const svgOptions = (filePath) => ({
  path: filePath,
  multipass: true,
})

module.exports = { jpegOptions, pngOptions, gifOptions, svgOptions }
