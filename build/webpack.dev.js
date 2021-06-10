const path = require('path')
const webpack = require('webpack')
const { merge } = require('webpack-merge')
const commonConfig = require('./webpack.common.js')

const devConfig = {
  // mode 默认为 production，打包完的代码是被压缩过的，可选 development
  mode: 'development',
  devtool: 'cheap-module-eval-source-map',
  module: {
    rules: [
      {
        test: /\.(css)$/i,
        // css-loader 可以分析出 css 文件之间的关系（如在 css 文件中，通过 @import 引入其他 css 文件而形成的依赖关系），最终将所有 css 文件合并成一段 css。
        // style-loader 可以将 css-loader 生成的 css 内容挂载到页面的 head 标签中。
        use: [
          'style-loader',
          'css-loader',
          'postcss-loader'
        ]
      },
      {
        test: /\.(scss)$/i,
        // sass-loader 可以将 sass 的代码转译成 css
        // loader 的执行顺序是从右到左，从下到上，先 sass-loader，再 css-loader，最后 style-loader
        use: [
          'style-loader',
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
    ]
  },
  output: {
    // filename: 'bundle.js',
    filename: '[name].js',
    // chunkFilename: '[name].chunk.js',
    path: path.resolve(__dirname, '../dist'),
    // 表示所有打包成的文件之间的引用前，都加一个路径
    // 如果需要引入上传到 cdn 的 js 文件，需要在 html 文件中引入的 js 文件地址前加上 cdn 前缀。
    // publicPath: 'https://cdn.com'
    // publicPath: '/'
  },
  devServer: {
    overlay: true,
    contentBase: './dist',
    port: 8091,
    // 自动打开浏览器
    open: true,
    proxy: {
      'api': 'http://test.cn',
      '/react/api': {
        // 此时页面请求 /react/api/xxx 实际上是请求 http://www.dell-lee.com/react/api/xxx
        target: 'http://www.dell-lee.com',
        // 对 https 协议网址关闭校验，以使 proxy 生效
        secure: false,
        // demo.json 为后端提供的临时接口，为避免在源代码中修改 header.json 为 demo.json，而之后又忘记改回去，可以用 pathRewrite 来改写路径。
        pathRewrite: {
          'header.json': 'demo.json'
        },
        // 突破某些网站对 origin 的限制
        changeOrigin: true,
      }
    },
    // 开启 Hot Module Replacement，热模块更新
    hot: true,
    // 即使 HMR 没有生效，也不让浏览器自动刷新（默认没有生效会自动刷新）
    // 宜在写 css 时打开，写 js 时建议关闭
    // hotOnly: true,
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin()
  ],
  optimization: {
    usedExports: true
  }
}

module.exports = merge(commonConfig, devConfig)