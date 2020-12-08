const express = require('express')
const webpack = require('webpack')
const webpackDevMiddleware = require('webpack-dev-middleware')
const config = require('./webpack.config.js')

// webpack 传入 config，返回一个编译器，可以随时进行代码编译，编译器执行一次，就会重新打包一次代码。
const complier = webpack(config)

const app = express()
// 保存源文件会自动执行打包
app.use(webpackDevMiddleware(complier, {
  publicPath: config.output.publicPath
}))

app.listen(8090, () => {
  console.log('server is running')
})