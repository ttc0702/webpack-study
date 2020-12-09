const webpack = require('webpack')
const { merge } = require('webpack-merge')
const commonConfig = require('./webpack.common.js')

const devConfig = {
  // mode 默认为 production，打包完的代码是被压缩过的，可选 development
  mode: 'development',
  devtool: 'cheap-module-eval-source-map',
  devServer: {
    contentBase: './dist',
    port: 8090,
    // 自动打开浏览器
    open: true,
    proxy: {
      'api': 'http://test.cn'
    },
    // 开启 Hot Module Replacement，热模块更新
    hot: true,
    // 即使 HMR 没有生效，也不让浏览器自动刷新（默认没有生效会自动刷新）
    // 宜在写 css 时打开，写 js 时建议关闭
    // hotOnly: true
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin()
  ],
  optimization: {
    usedExports: true
  }
}

module.exports = merge(commonConfig, devConfig)