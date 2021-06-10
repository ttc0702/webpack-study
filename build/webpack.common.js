const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
// const webpack = require('webpack')

const configs = {
// module.exports = {
  // entry: './src/index.js',
  entry: {
    // lodash: './src/lodash.js',
    list: './src/list.js',
    index: './src/index.js',
  },
  module: {
    rules: [
      // {
      //   test: /\.(png|jpe?g|gif)$/i,
      //   use: {
      //     loader: 'file-loader',
      //     options: {
      //       name: '[name].[ext]',
      //       outputPath: 'images/'
      //     }
      //   }
      // },
      {
        test: /\.(png|jpe?g|gif)$/i,
        use: {
          loader: 'url-loader',
          options: {
            limit: 10000,
            name: '[name]_[hash].[ext]',
            outputPath: 'images/',
          }
        }
      },
      {
        test: /\.(woff|woff2|eot|ttf|otf|svg)$/i,
        use: {
          loader: 'file-loader',
          options: {
            name: '[name].[ext]',
            outputPath: 'font/',
          }
        }
      },
      {
        // test: /\.m?js$/,
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: [
          "babel-loader",
          "eslint-loader"
        ]
      },
    ]
  },
  // plugins 可以在 webpack 运行到某些时刻时，帮我们执行一些任务
  plugins: [
    // html-webpack-plugin 会在打包结束后，自动生成一个 html 文件，并把打包生成的 js 文件自动引入到这个 html 文件中。
    // new HtmlWebpackPlugin({
    //   template: 'src/index.html',
    //   filename: 'index.html',
    //   chunks: ['vendors', 'main'],
    // }),
    // new HtmlWebpackPlugin({
    //   template: 'src/index.html',
    //   filename: 'list.html',
    //   chunks: ['vendors', 'list'],
    // }),
    // clean-webpack-plugin 会在打包之前，删除 dist 目录
    // new CleanWebpackPlugin({
    //   // verbose: true
    // }),
    // new webpack.ProvidePlugin({
    //   // 当发现一个模块中使用了 _ 时，自动在该模块中引入 lodash，并命名为 _
    //   _: 'lodash'
    // })
  ],
  optimization: {
    splitChunks: {
      chunks: 'all',
      cacheGroups: {
        vendors: {
          test: /[\\/]node_modules[\\/]/,
          priority: -10,
          name: 'vendors',
          // filename: 'vendors.js',
        },
        default: false
      }
    },
  },
  // 关闭文件大小限制的控制台提醒
  performance: false,
}

configs.plugins = addPlugins(configs)

function addPlugins(configs) {
  const plugins = [new CleanWebpackPlugin({})]
  Object.keys(configs.entry).forEach(entry => {
    plugins.push(
      new HtmlWebpackPlugin({
        template: 'src/index.html',
        filename: `${entry}.html`,
        chunks: ['vendors', entry],
      }),
    )
  })

  return plugins
}

module.exports = configs