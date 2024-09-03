const EofolPlugin = require("../plugin")
const BundleAnalyzerPlugin = require("webpack-bundle-analyzer").BundleAnalyzerPlugin
const { resolve, parse, exists, sep } = require("../util")
const { DIRNAME_ASSETS, DIRNAME_JS, PATH_SRC, PATH_BUILD, MODE, ANALYZE } = require("../config")
const { getVIEWS } = require("../config/internal")

const getWebpackConfig = () => {
  const VIEWS = getVIEWS()
  const entry = VIEWS.reduce((acc, next) => {
    const parsed = parse(next.path)
    let viewPath = undefined
    const viewPathTs = resolve(PATH_SRC, parsed.dir, `${parsed.name}.ts`)
    const viewPathJs = resolve(PATH_SRC, parsed.dir, `${parsed.name}.js`)
    if (exists(viewPathTs)) {
      viewPath = viewPathTs
    } else if (exists(viewPathJs)) {
      viewPath = viewPathJs
    }
    if (viewPath) {
      return { ...acc, [[parsed.dir.replace(sep, "/"), parsed.name].filter(Boolean).join("/")]: viewPath }
    } else {
      return acc
    }
  }, {})

  return {
    mode: MODE ?? "development",
    entry,
    output: {
      filename: `${DIRNAME_ASSETS}/${DIRNAME_JS}/[name].js`,
      path: PATH_BUILD,
    },
    module: {
      rules: [
        {
          test: /\.ts?$/,
          use: {
            loader: "ts-loader",
            options: {
              transpileOnly: true,
            },
          },
          exclude: /node_modules/,
        },
      ],
    },
    resolve: {
      extensions: [".ts", ".js"],
    },
    plugins: [new EofolPlugin(), ANALYZE && new BundleAnalyzerPlugin()].filter(Boolean),
    optimization: {
      moduleIds: "deterministic",
      runtimeChunk: "single",
      splitChunks: {
        cacheGroups: {
          dependencies: {
            test: /[\\/]node_modules[\\/]/,
            name: "dependencies",
            chunks: "all",
            reuseExistingChunk: true,
            idHint: "dependencies",
          },
        },
      },
    },
    devtool: MODE === "development" ? "source-map" : false,
  }
}

module.exports = getWebpackConfig
