const { merge } = require('webpack-merge')
const commonConfig = require('./webpack.common.js')

const prodConfig = {
  // mode 默认为 production，打包完的代码是被压缩过的，可选 development
  mode: 'production',
  // devtool: 'none',
  devtool: 'cheap-module-source-map',
}

module.exports = merge(commonConfig, prodConfig)