const Webpack = require('webpack');
const WebpackDevServer = require('webpack-dev-server');

const webpackConfig = require("../webpack.config")

const server = new WebpackDevServer(webpackConfig.devServer, Webpack(webpackConfig));

const runServer = async () => {
    console.log('Starting server...');
    await server.start();
};

runServer();
