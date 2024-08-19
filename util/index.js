const Ext = require("./ext")
const Fs = require("./fs")
const DevUtil = require("./dev-util")
const Func = require("./func")

const mergeDeep = require("./merge-deep")

module.exports = { ...Ext, ...Fs, ...DevUtil, ...Func, mergeDeep }
