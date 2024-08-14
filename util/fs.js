const fs = require("fs")
const path = require("path")

const rimraf = require("rimraf")

const resolve = path.resolve

const rm = rimraf.rimrafSync

const mkdir = fs.mkdirSync

const readDir = fs.readdirSync

const touch = (path) => {
  if (!fs.existsSync(path)) {
    mkdir(path)
  }
}

// @TODO unite async/sync - at this moment `cp` is the only async function
const cp = fs.promises.copyFile

const isDirectory = (path) => fs.lstatSync(path).isDirectory()

module.exports = { resolve, rm, mkdir, readDir, touch, cp, isDirectory }
