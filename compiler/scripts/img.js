const sharp = require("sharp")
const { optimize } = require("svgo")
const { read } = require("../../util")
const { jpegOptions, pngOptions, svgOptions } = require("../options")

const processJpeg = (filePath) => sharp(filePath).jpeg(jpegOptions).toBuffer()

const processPng = (filePath) => sharp(filePath).png(pngOptions).toBuffer()

const processSvg = (filePath) => optimize(read(filePath).toString(), svgOptions(filePath)).data

module.exports = { processJpeg, processPng, processSvg }
