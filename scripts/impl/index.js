const build = require("./build")
const clean = require("./clean")
const serve = require("./serve")
const WebpackParams = require("./webpack-params")

module.exports = { build, clean, serve, ...WebpackParams }
