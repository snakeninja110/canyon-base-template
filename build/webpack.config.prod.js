'use strict'
const path = require('path')
const config = require('../config')
const merge = require('webpack-merge')
const webpack = require('webpack')
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin')
const baseWebpackConfig = require('./webpack.config.base')

const env = require('../config/prod.env')

let webpackConfig = merge(baseWebpackConfig, {
    mode: JSON.parse(env.NODE_ENV),
    devtool: config.build.productionSourceMap ? config.build.devtool : false,
    output: {
        filename: '[name].[chunkhash].js',
        path: path.resolve(__dirname, '../dist'),
        publicPath: '/'
    },
    plugins: [
        new CleanWebpackPlugin(['dist'], { root: path.resolve(__dirname , '..') }),
        new webpack.HashedModuleIdsPlugin(),
        new UglifyJSPlugin(),
        new webpack.DefinePlugin({
            'process.env': env
        }),
    ],
})

if (config.build.bundleAnalyzerReport) {
    const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin
    webpackConfig.plugins.push(new BundleAnalyzerPlugin())
}

module.exports = webpackConfig;
