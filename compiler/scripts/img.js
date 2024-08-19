const sharp = require("sharp")
const { optimize } = require("svgo")
const { read } = require("../../util")
const { jpegOptions, pngOptions, svgOptions } = require("../../plugin/options")

const processJpeg = (filePath) => sharp(filePath).jpeg(jpegOptions).withMetadata().toBuffer()

const processPng = (filePath) => sharp(filePath).png(pngOptions).withMetadata().toBuffer()

const processSvg = (filePath) => optimize(read(filePath).toString(), svgOptions(filePath)).data

module.exports = { processJpeg, processPng, processSvg }
