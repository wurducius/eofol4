const EofolPlugin = require("../plugin")
const { resolve } = require("../util")
const { PATH_SRC, PATH_BUILD } = require("../config")

const views = ["index", "index2", "404"]

const entry = views.reduce((acc, next) => ({ ...acc, [next]: resolve(PATH_SRC, `${next}.ts`) }), {})

module.exports = {
  mode: "development",
  entry,
  output: {
    filename: "assets/js/[name].js",
    path: PATH_BUILD,
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
