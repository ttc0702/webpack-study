const path = require('path')
const CopyrightWebpackPlugin = require('./plugins/copyright-webpack.plugin')

module.exports = {
  mode: 'development',
  entry: {
    main: './src/index.js'
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].js'
  },
  resolveLoader: {
    modules: ['node_modules', 'loaders']
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        use: [
          "babel-loader",
          "eslint-loader",
          {
            // loader: path.resolve(__dirname, 'loaders/replaceLoader'),
            loader: 'replaceLoader',
            options: {
              name: 'Neo'
            }
          }
        ]
      },
    ]
  },
  plugins: [
    new CopyrightWebpackPlugin({
      name: 'Neo'
    })
  ]
}