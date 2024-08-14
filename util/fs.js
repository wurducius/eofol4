const fs = require("fs")

const rimraf = require("rimraf")

const rm = rimraf.rimrafSync

const mkdir = fs.mkdirSync

const readDir = fs.readdirSync

const touch = (path) => {
    if(!fs.existsSync(path)){
        mkdir(path)
    }
}

const cp = fs.promises.copyFile

module.exports = { rm, mkdir, readDir,touch,cp }