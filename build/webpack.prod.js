const path = require('path')
const { merge } = require('webpack-merge')
const commonConfig = require('./webpack.common.js')
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
// const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');
// const WorkboxPlugin = require('workbox-webpack-plugin')

const prodConfig = {
  // mode 默认为 production，打包完的代码是被压缩过的，可选 development
  mode: 'production',
  // devtool: 'none',
  // devtool: 'cheap-module-source-map',
  output: {
    filename: '[name].[contenthash].js',
    // chunkFilename: '[name].chunk.js',
    path: path.resolve(__dirname, '../dist'),
  },
  module: {
    rules: [
      {
        test: /\.(css)$/i,
        use: [
          // 'style-loader',
          MiniCssExtractPlugin.loader,
          'css-loader',
          'postcss-loader'
        ]
      },
      {
        test: /\.(scss)$/i,
        use: [
          // 'style-loader',
          MiniCssExtractPlugin.loader,
          {
            loader: 'css-loader',
            options: {
              importLoaders: 2,
            }
          },
          'sass-loader',
          'postcss-loader'
        ]
      },
    ]
  },
  plugins: [
    new MiniCssExtractPlugin(),
    // new OptimizeCssAssetsPlugin({}),
    // new WorkboxPlugin.GenerateSW({
    //   clientsClaim: true,
    //   skipWaiting: true
    // })
  ],
  optimization: {
    minimizer: [
      // new CssMinimizerPlugin(),
      new OptimizeCssAssetsPlugin({}),
    ],
  }
}

module.exports = merge(commonConfig, prodConfig)