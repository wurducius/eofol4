const sharp = require("sharp")
const { optimize } = require("svgo")
const { read } = require("../../util")
const { IMAGE_PROCESSING_INCLUDE_METADATA } = require("../../config")
const { jpegOptions, pngOptions, svgOptions, gifOptions } = require("../options")

const processGeneral = (callback) => (filePath) => {
  const data = callback(sharp(filePath))
  const processed = IMAGE_PROCESSING_INCLUDE_METADATA ? data.withMetadata() : data
  return processed.toBuffer()
}

const processJpeg = processGeneral((x) => x.jpeg(jpegOptions))

const processPng = processGeneral((x) => x.png(pngOptions))

const processGif = processGeneral((x) => x.gif(gifOptions))

const processSvg = (filePath) => optimize(read(filePath).toString(), svgOptions(filePath)).data

module.exports = { processJpeg, processPng, processSvg, processGif }
