const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const webpack = require('webpack')

module.exports = {
  // mode 默认为 production，打包完的代码是被压缩过的，可选 development
  mode: 'production',
  // entry: './src/index.js',
  entry: {
    main: './src/index.js',
    // sub: './src/index.js',
  },
  devtool: 'none',
  // devtool: 'cheap-module-eval-source-map',
  // devtool: 'cheap-module-source-map',
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
  output: {
    // filename: 'bundle.js',
    filename: '[name].js',
    path: path.resolve(__dirname, 'dist'),
    // 表示所有打包成的文件之间的引用前，都加一个路径
    // 如果需要引入上传到 cdn 的 js 文件，需要在 html 文件中引入的 js 文件地址前加上 cdn 前缀。
    // publicPath: 'https://cdn.com'
    // publicPath: '/'
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
        test: /\.(css)$/i,
        // css-loader 可以分析出 css 文件之间的关系（如在 css 文件中，通过 @import 引入其他 css 文件而形成的依赖关系），最终将所有 css 文件合并成一段 css。
        // style-loader 可以将 css-loader 生成的 css 内容挂载到页面的 head 标签中。
        use: ['style-loader', 'css-loader']
      },
      {
        test: /\.(scss)$/i,
        // sass-loader 可以将 sass 的代码转译成 css
        // loader 的执行顺序是从右到左，从下到上，先 sass-loader，再 css-loader，最后 style-loader
        use: [
          'style-loader',
          // 'css-loader',
          {
            loader: 'css-loader',
            options: {
              // 在 scss 文件中引入 scss 文件，被引入的文件在引入前，也会走前两个 loader
              // 保证所有 scss 都被全部编译
              importLoaders: 2,
              // 开启 css module,，避免样式污染
              // modules: true
            }
          },
          'sass-loader',
          // 结合 postcss-preset-env 或 autoprefixer，可以补充样式的厂商前缀，postcss-preset-env 是 autoprefixer 的超集
          'postcss-loader'
        ]
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
        test: /\.m?js$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
        }
      },
    ]
  },
  // plugins 可以在 webpack 运行到某些时刻时，帮我们执行一些任务
  plugins: [
    // html-webpack-plugin 会在打包结束后，自动生成一个 html 文件，并把打包生成的 js 文件自动引入到这个 html 文件中。
    new HtmlWebpackPlugin({
      template: 'src/index.html'
    }),
    // clean-webpack-plugin 会在打包之前，删除 dist 目录
    new CleanWebpackPlugin(),
    new webpack.HotModuleReplacementPlugin()
  ],
  // optimization: {
  //   usedExports: true
  // }
}