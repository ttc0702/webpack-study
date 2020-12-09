# 前言

### 问题

1. 网页中各标签中 src 属性后的资源需要向服务器发起很多的二次请求，导致网页加载速度慢。
2. 需要处理项目各引入文件间复杂的依赖关系。



### 解决方案

1. css：合并、压缩。
2. image：精灵图、图片的 Base64 编码。



# 简介

webpack 是一个模块打包器（module bundler）。webpack 的主要目标是将符合规范（ES Module、CommonJS、CMD、AMD）的 JavaScript 文件打包在一起，打包后的文件用于在浏览器中使用，但它也能够胜任转换（transform）、打包（bundle）或包裹（package）任何资源（resource or asset）。

gulp 是基于 task 的。

webpack 是基于项目的。



### 命令

### 使用方法

1. 命令行直接执行：

   ```bash
   npx webpack [entry_path] [-o output_name] [--config config_path]
   npx webpack index.js -o bundle.js --config webpack.config.js
   ```

2. 执行 package.json 中设置的 scripts 脚本：

   ```json
   {
     "scripts": {
       "wp": "webpack"
     }
   }
   ```

   ```bash
   npm run wp
   ```

3. 在 node 中运行：

   ```js
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
   ```

   



### webpack.config.js

```js
const path = require('path');

module.exports = {
  entry: './src/index.js',
  output: {
    path: path.join(__dirname, './dist'),
    filename: 'bundle.js'
  },
  mode: 'development',
};
```

webpack 中带 s 的选项都是数组，如 plugins。

# webpack-dev-server

webpack-dev-server 会启动一个 web 服务器，可以通过 http://localhost:8080 访问，保存源文件可以自动打包并刷新页面。同时能允许我们在项目中发送 ajax 请求，因为 ajax 请求基于 http 协议，如果通过 file 协议打开文件，如 file:///C:/Users/tctao/Desktop/，是无法发送请求的。

webpack-dev-server 打包生成的 bundle 文件，并没有存放到硬盘中，而是存放到了内存中，以提升打包速度，所以项目的根目录中没有 bundle.js。

```js
module.exports = {
  devServer: {
    contentBase: './dist', // 启动的服务器所在目录
    port: 8090,
    open: true, // 自动打开浏览器
    proxy: {
      'api': 'http://test.cn'
    }
  },
};
```

### Hot Module Replacement

```js
const webpack = require('webpack')

module.exports = {
  devServer: {
    contentBase: './dist', 
    port: 8090,
    open: true, 
    // 开启 Hot Module Replacement，热模块更新
    hot: true,
    // 即使 HMR 没有生效，也不让浏览器自动刷新
    hotOnly: true
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin()
  ]
};
```

js 文件的 HMR，number 模块的代码更新，可以不影响 counter 模块，独立刷新。

```js
import counter from './counter'
import number from './number'

counter()
number()
// 如果开启了 HMR，并且检测到 number 文件发生了变化，执行回调
// accept 接受给定依赖模块的更新，并触发一个回调函数来对这些更新做出响应。
if (module.hot) {
  module.hot.accept('./number', () => {
    var num = document.getElementById('number')
    document.body.removeChild(num)
    number()
  })
}
```

配置完成后，css 的 HMR 可以自动生效，是因为 style-loader、vue-loader（vue）、babel-preset（react）中,帮我们实现了监听文件变化，更新页面的回调

# entry

```js
module.exports = {
  entry: './src/index.js',
}
// 相当于
module.exports = {
  entry: {
    main: './src/index.js'
  }
}
```

# output

```js
module.exports = {
  output: {
    // filename: 'bundle.js',
    filename: '[name].js',
    path: path.resolve(__dirname, 'dist'),
    // 如果需要引入上传到 cdn 的 js 文件，需要在 html 文件中引入的 js 文件地址前加上 cdn 前缀。
    // publicPath: 'https://cdn.com'
  },
}
```

# sourceMap

sourceMap 是打包前 src 目录中源文件和打包后 dist 目录中文件间的映射关系，它知道 dist 目录下 main.js 文件的某一行，实际上对应的是 src 目录下 index.js 中的哪一行。这样在开发过程中报错时，可以正确定位到源文件中的报错位置。

```js
module.exports = {
  // source-map 模式会将映射关系存储在 main.js.map 文件中，该文件实际上是一个 vlq 的编码集合
  // inline 前缀表示不以 main.js.map 的形式存储映射关系，转而在 main.js 的底部，用 sourceMappingURL=base64 字符串的形式，存储映射关系
  // cheap 前缀表示报错精确到行，而不是默认的某一行的某个字符，可以提高打包性能；同时 cheap 也表示映射关系仅建立在业务代码中，而不管 loader 和第三方模块
  // module 前缀表示在 cheap 的前提下，映射关系不仅建立在业务代码中，也管 loader 和第三方模块，因此 module 出现的前提，是已经设置了 cheap。
  
  // eval 表示通过 eval 这种 js 的执行形式，来生成的 sourceMap 对应关系，性能最好，但针对复杂项目的错误提示可能并不全面
  
  // 最佳实践：
  // 开发环境：cheap-module-eval-source-map
  // 生产环境：none 或者 cheap-module-source-map（提示效果更好）
  devtool: 'source-map'
}
```



# loader

webpack 默认只能打包处理 js 类型的文件，无法处理其它的非 js 类型的文件，如果要处理非 js 类型的文件，需要手动安装一些对应的第三方 loader 加载器。

### 文件

file-loader：处理图片、字体等格式的文件

```js
module.exports = {
  module: {
    rules: [
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
    ]
  }
}
```

url-loader：处理图片、字体等格式的文件，并将体积较小的图片直接处理成 base64 格式，而不是转移到 dist 目录中，减少 http 请求数，提高网页加载速度。

```js
module.exports = {
  module: {
    rules: [
      {
        test: /\.(png|jpe?g|gif)$/i,
        use: {
          loader: 'url-loader',
          options: {
            limit: 10000,
            name: '[name].[ext]',
            outputPath: 'images/',
          }
        }
      },
    ]
  }
}
```



### 样式

style-loader：可以将 css-loader 生成的 css 内容挂载到页面的 head 标签中。

css-loader：可以分析出 css 文件之间的关系（如在 css 文件中，通过 @import 引入其他 css 文件而形成的依赖关系），最终将所有 css 文件合并成一段 css。

sass-loader：可以将 sass 翻译成 css。

postcss-loader：结合 postcss-preset-env 或 autoprefixer，可以补充样式的厂商前缀，postcss-preset-env 是 autoprefixer 的超集

```js
module.exports = {
  module: {
    rules: [
      {
        test: /\.(scss)$/i,
        // loader 的执行顺序是从右到左，从下到上，先 postcss-loader，再 sass-loader，再 css-loader，最后 style-loader
        use: [
          'style-loader',
          // 'css-loader',
          {
            loader: 'css-loader',
            options: {
              // 在 scss 文件中引入 scss 文件，被引入的文件在引入前，也会走前两个 loader
              // 保证所有 scss 都被全部编译
              importLoaders: 2,
              // 开启 css module，避免样式污染
              // modules: true
            }
          },
          'sass-loader',
          'postcss-loader'
        ]
      },
    ]
  }
}
```

### 逻辑

babel-loader：只是 webpack 和 babel 间通信的桥梁，它并不会将 js 代码中的 es6 语法翻译成 es5。

@babel/core：babel 核心库，可以让 babel 识别 js 代码的内容，并将代码转换为 ast 抽象语法树，再将抽象语法树编译转换成新的代码。

@babel/preset-env：babel 模块，可以将 ES2015+ 的代码翻译成 es5 代码。但 Babel 默认只转换新的 JavaScript 句法（syntax），而不转换新的 API，比如`Iterator`、`Generator`、`Set`、`Map`、`Proxy`、`Reflect`、`Symbol`、`Promise`等全局对象，以及一些定义在全局对象上的方法（比如`Object.assign`）都不会转码。

@babel/polyfill：将新的 API，比如`Iterator`、`Generator`、`Set`、`Map`、`Proxy`、`Reflect`、`Symbol`、`Promise`等全局对象，以及一些定义在全局对象上的方法（比如`Object.assign`）转码。使用时在需要使用的源文件顶部引入即可。

```js
module.exports = {
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
          options: {
            presets: [
              ['@babel/preset-env', {
                // @babel/polyfill 向浏览器全局变量注入对象和方法时，根据业务代码中使用到的添加，而不是全部添加。
                // useBuiltIns 的值默认为 false，设为 usage 或 entry 时，会自动在需要的文件中引入 polyfill，而无需手动在源文件顶部引入。
                useBuiltIns: 'usage',
                // 指定项目需要支持的浏览器，及支持到的最低版本，@babel/preset-env 会检查指定版本号及以上的浏览器对 es6 语法的支持度，如果已经支持的很好了，则不使用 @babel/preset-env 和 @babel/polyfill 进行转义
                targets: {
                  "chrome": "58",
                  "ie": "11"
                }
              }]
            ]
          }
        }
    ]
  }
}
```

options 中的配置也可以写在 bebel 的默认配置文件 babel.congfig.json（低版本为 .babelrc） 中

```js
{
  "presets": ["@babel/preset-env"]
}
```

开发 ui 组件库或类库时，@babel/polyfill 不是很适用，因为它会向浏览器全局变量注入对象和方法，这会污染全局变量，影响库的开发。宜使用 @babel/plugin-transform-runtime，它会以闭包的形式引入对象和方法，不会污染全局变量。

打包 react 代码：

```js
module.exports = {
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
          options: {
            presets: [
              ['@babel/preset-env', {
                useBuiltIns: 'usage',
                targets: {
                  "chrome": "58",
                  "ie": "11"
                }
              }],
              '@babel/preset-react'
            ]
          }
        }
    ]
  }
}
```



# plugins

plugins 可以在 webpack 运行到某些时刻时，帮我们执行一些任务。

### html-webpack-plugin

会在打包结束后，自动生成一个 html 文件，并把打包生成的 js 文件自动引入到这个 html 文件中。

```js
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  plugins: [
    new HtmlWebpackPlugin({
      template: 'src/index.html'
    }),
  ]
}
```



### clean-webpack-plugin

会在打包之前，删除 dist 目录

```js
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

module.exports = {
  plugins: [
    new CleanWebpackPlugin(),
  ]
}
```



# Tree Shaking

Tree Shaking 可以只将模块中被引入的部分打包入 main.js 中，可以降低 main.js 文件的大小，减少打包时间。

Tree Shaking 只支持 ES Module（即使用 import 语法引入的模块），不支持 Commonjs 模块（即使用 require 语法引入的模块），因为 ES Module 底层是静态引入，而 Common js 底层是动态引入，Tree Shaking 只支持静态引入。

development 模式下 Tree Shaking **不会删除没有引入的部分**，而只会在打包生成的 main.js 中用注释给出提示 /*! exports used: add */，这是为了方便调试，避免少打包一部分内容而导致的 sourceMap 行号错误。

production 模式下不需要配置 optimization，只需要设置 devtool 为 cheap-module-source-map 或 none 即可让 tree shaking 生效。

```js
module.exports = {
  optimization: {
    usedExports: true
  }
}
```



packjson.json：防止引入的模块中，没有导出任何内容的模块被忽略，如 @babel/polyfill（它向浏览器全局变量注入对象和方法，没有导出）。sideEffects 可以设置对哪些模块，不使用 Tree Shaking。

```json
{
  "sideEffects": [
    "@babel/polyfill",
    "*.css"
  ]
}
```

```json
{
  "sideEffects": false
}
```

# mode

