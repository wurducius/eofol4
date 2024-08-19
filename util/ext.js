const isHtml = (ext) => ext === ".html" || ext === ".htm"

const isJpeg = (ext) => ext === ".jpg" || ext === ".jpeg"

const isPng = (ext) => ext === ".png"

const isGif = (ext) => ext === ".gif"

const isSvg = (ext) => ext === ".svg"

const isFont = (ext) => ext === ".woff2" || ext === ".woff" || ext === ".otp" || ext === ".ttf" || ext === ".eot"

module.exports = { isHtml, isJpeg, isPng, isGif, isSvg, isFont }
