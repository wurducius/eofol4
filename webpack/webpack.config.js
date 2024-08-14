const EofolPlugin = require("../compiler")
const { resolve } = require("../util")
const { PORT, BROWSER, HOST, PROTOCOL, PATH_SRC, PATH_PUBLIC, PATH_BUILD } = require("../config")

const views = ["index", "index2", "404"]

const entry = views.reduce((acc, next) => ({ ...acc, [next]: resolve(PATH_SRC, `${next}.ts`) }), {})

module.exports = {
  mode: "development",
  entry,
  output: {
    filename: "assets/js/[name].js",
    path: PATH_BUILD,
  },
  devServer: {
    static: PATH_PUBLIC,
    compress: true,
    hot: true,
    port: PORT,
    open: BROWSER,
    host: HOST,
    server: PROTOCOL,
    historyApiFallback: true,
  },
  module: {
    rules: [
      {
        test: /\.ts?$/,
        use: "ts-loader",
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    extensions: [".ts", ".js"],
  },
  plugins: [new EofolPlugin()],
}
