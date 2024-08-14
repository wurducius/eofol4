// const EofolPlugin = require("./compiler")

const { PORT, BROWSER, HOST, PROTOCOL, PATH_BUILD } = require("../config")

module.exports = {
  mode: "development",
  entry: {},
  output: {
    //  filename: "assets/js/[name].js",
    //  path: PATH_BUILD
  },
  devServer: {
    static: PATH_BUILD,
    compress: true,
    hot: true,
    port: PORT,
    open: BROWSER,
    host: HOST,
    server: PROTOCOL,
  },
  // plugins: [new EofolPlugin()]
}
