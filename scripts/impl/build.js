const webpack = require('webpack');

const webpackConfig = require("../../webpack/webpack.config")
const {PATH_BUILD, PATH_PUBLIC} = require("../../config");
const {resolve,touch, isDirectory,readDir, cp} = require("../../util");
const clean = require("./clean");

// @TODO handle better tree structure
const copyPublic = () => Promise.all(readDir(PATH_PUBLIC, {recursive: true}).map((publicFile) => {
    const source = resolve(PATH_PUBLIC, publicFile)
    if(!isDirectory(source)){
        return cp(source, resolve(PATH_BUILD, publicFile))
    }
}))

const build = () => {
    clean()

    touch(PATH_BUILD)

    // @TODO dont do this
    touch(resolve(PATH_BUILD, "fonts"))

    const webpackConfigImpl = { ...webpackConfig, mode: "production" }

    copyPublic().then(() => {
        webpack(webpackConfigImpl, (err, stats) => {
            if (err || stats.hasErrors()) {
                console.log("Webpack error: " + err)
            }
            console.log("Eofol4 project built at "+PATH_BUILD)
        });
    })

}


module.exports = build