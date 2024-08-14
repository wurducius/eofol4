const path = require("path");

const webpack = require('webpack');

const webpackConfig = require("../../webpack.config")
const {PATH_BUILD, PATH_PUBLIC} = require("../../config");
const {touch, readDir, cp} = require("../../util");
const clean = require("./clean");

const build = () => {
    clean()

    touch(PATH_BUILD)

    Promise.all(readDir(PATH_PUBLIC).map((publicFile) => cp(path.resolve(PATH_PUBLIC, publicFile), path.resolve(PATH_BUILD, publicFile)))).then(() => {
        webpack(webpackConfig, (err, stats) => {
            if (err || stats.hasErrors()) {
                console.log("Webpack error: " + err)
            }
            console.log("Webpack finished")
        });
    })

}


module.exports = build