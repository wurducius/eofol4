const Webpack = require("webpack")
const WebpackDevServer = require("webpack-dev-server")

const webpackConfig = require("../../webpack/webpack.config.serve")

const serve = () => {
  const server = new WebpackDevServer(webpackConfig.devServer, Webpack(webpackConfig))

  const runServer = async () => {
    console.log("Serving...")
    await server.start()
  }

  runServer()
}

module.exports = serve
