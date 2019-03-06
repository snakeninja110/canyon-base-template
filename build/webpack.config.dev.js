const webpack = require('webpack')
const config = require('../config')
const merge = require('webpack-merge')
const baseWebpackConfig = require('./webpack.config.base')
const portfinder = require('portfinder')
const FriendlyErrorsPlugin = require('friendly-errors-webpack-plugin')

const env = config.dev.env
const HOST = process.env.HOST
const PORT = process.env.PORT && Number(process.env.PORT)

let devWebpackConfig = merge(baseWebpackConfig, {
    mode: JSON.parse(env.NODE_ENV),
    devtool: config.dev.devtool,
    devServer: {
        clientLogLevel: 'warning',
        compress: true,
        contentBase: false,
        hot: true,
        host: HOST || config.dev.host,
        port: PORT || config.dev.port,
        open: config.dev.autoOpenBrowser,
        publicPath: config.dev.assetsPublicPath,
        proxy: config.dev.proxyTable,
        open: config.dev.autoOpenBrowser,
        watchOptions: {
            poll: config.dev.poll
        }
    },
    plugins: [
        new webpack.DefinePlugin({
            'process.env': env
        }),
        new webpack.NamedModulesPlugin(),
        new webpack.HotModuleReplacementPlugin()
    ],
})

module.exports = new Promise((resolve, reject) => {
    portfinder.basePort = process.env.PORT || config.dev.port
    portfinder.getPort((err, port) => {
        if (err) {
        reject(err)
        } else {
        // publish the new Port, necessary for e2e tests
        process.env.PORT = port
        // add port to devServer config
        devWebpackConfig.devServer.port = port

        // Add FriendlyErrorsPlugin
        devWebpackConfig.plugins.push(new FriendlyErrorsPlugin({
            compilationSuccessInfo: {
            messages: [`Your application is running here: http://${devWebpackConfig.devServer.host}:${port}`]
            },
            onErrors: config.dev.notifyOnErrors ? utils.createNotifierCallback() : undefined
        }))

        resolve(devWebpackConfig)
        }
    })
})
