const path = require('path');

const EofolPlugin = require("./compiler")

const {PORT, BROWSER, HOST, PROTOCOL, PATH_SRC, PATH_PUBLIC, PATH_BUILD} = require("./config");

const views = ["index"]

const entry = views.reduce((acc, next) => ({...acc, [next]: path.resolve(PATH_SRC, `${next}.js`)}), {})

module.exports = {
    mode: 'development',
    entry,
    output: {
        filename: "assets/js/[name].js",
        path: PATH_BUILD
    },
    devServer: {
        static: PATH_PUBLIC,
        compress: true,
        hot: true,
        port: PORT,
        open: BROWSER,
        host: HOST,
        server: PROTOCOL,
    },
    plugins: [new EofolPlugin()]
};