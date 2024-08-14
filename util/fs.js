const fs = require("fs")
const path = require("path")

const rimraf = require("rimraf")

const resolve = path.resolve

const exists = fs.existsSync

const rm = rimraf.rimrafSync

const mkdir = fs.mkdirSync

const readDir = fs.readdirSync

const touch = (path) => {
  if (!exists(path)) {
    fs.mkdirSync(path, { recursive: true })
  }
}

// @TODO unite async/sync - at this moment `cp` is the only async function
const cp = fs.promises.copyFile

const isDirectory = (path) => fs.lstatSync(path).isDirectory()

const stat = (path) => fs.statSync(path)

const read = (path) => fs.readFileSync(path)

const write = (path, content) => fs.writeFileSync(path, content)

module.exports = { resolve, exists, rm, mkdir, readDir, touch, cp, isDirectory, stat, read, write }
