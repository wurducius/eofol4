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

const cp = fs.cpSync

const isDirectory = (path) => fs.lstatSync(path).isDirectory()

const stat = (path) => fs.statSync(path)

const read = (path) => fs.readFileSync(path)

const write = (path, content) => fs.writeFileSync(path, content)

const parse = path.parse

module.exports = { resolve, exists, rm, mkdir, readDir, touch, cp, isDirectory, stat, read, write, parse }
