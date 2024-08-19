const EofolPlugin = require("../plugin")
const BundleAnalyzerPlugin = require("webpack-bundle-analyzer").BundleAnalyzerPlugin
const { resolve, parse } = require("../util")
const { PATH_SRC, PATH_BUILD } = require("../config")
const { exists } = require("../util/fs")
const { sep } = require("path")

const getWebpackConfig = (params) => {
  const { views, mode, analyze } = params

  // @TODO handle also .js scripts
  const entry = views.reduce((acc, next) => {
    const parsed = parse(next)
    const viewPath = resolve(PATH_SRC, parsed.dir, `${parsed.name}.ts`)
    if (exists(viewPath)) {
      return { ...acc, [[parsed.dir.replace(sep, "/"), parsed.name].filter(Boolean).join("/")]: viewPath }
    } else {
      return acc
    }
  }, {})

  return {
    mode: mode ?? "development",
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
    plugins: [new EofolPlugin(), analyze && new BundleAnalyzerPlugin()].filter(Boolean),
    optimization: {
      moduleIds: "deterministic",
      runtimeChunk: "single",
      splitChunks: {
        cacheGroups: {
          vendors: {
            test: /[\\/]node_modules[\\/]/,
            name: "dependencies",
            chunks: "all",
            reuseExistingChunk: true,
            idHint: "dependencies",
          },
        },
      },
    },
  }
}

module.exports = getWebpackConfig
