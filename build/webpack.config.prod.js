'use strict'
const utils = require('./utils')
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
        path: config.build.assetsRoot,
        filename: utils.assetsPath('js/[name].[chunkhash].js'),
        chunkFilename: utils.assetsPath('js/[id].[chunkhash].js')
    },
    optimization: {
        splitChunks: {
            cacheGroups: {
                    vendors: {
                        test: /[\\/]node_modules[\\/]/,
                        chunks: 'initial',
                        name: 'vendors',
                        minChunks: 2
                    },
                    'async-vendors': {
                        test: /[\\/]node_modules[\\/]/,
                        minChunks: 2,
                        chunks: 'async',
                        name: 'async-vendors'
                    }
            }
        },
        runtimeChunk: { name: 'runtime' }
    },
    plugins: [
        // 删除dist下所有目录，保留monitor.html
        // 新版CleanWebpackPlugin会根据output中的path定位打包文件夹，需要path use full path. path.join(process.cwd(), 'build/**/*')
        new CleanWebpackPlugin({
            dry: false, // true 为模拟删除
            cleanOnceBeforeBuildPatterns:['**/*', '!monitor.html']
        }),
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
