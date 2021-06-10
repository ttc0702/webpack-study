# 前言

### 问题

1. 网页各标签中 src 属性后的资源需要向服务器发起很多的二次请求，导致网页加载速度慢。
2. 需要处理项目各引入文件间复杂的依赖关系。



### 解决方案

1. css：合并、压缩。
2. image：精灵图、图片的 Base64 编码。



# 简介

webpack 是一个模块打包器（module bundler）。webpack 的主要目标是将符合规范（ES Module、CommonJS、CMD、AMD）的 JavaScript 文件打包在一起，打包后的文件用于在浏览器中使用，但它也能够胜任转换（transform）、打包（bundle）或包裹（package）任何资源（resource or asset）。

gulp 是基于 task 的。

webpack 是基于项目的。



安装 webapck 同时必须安装 webpack-cli，webpack-cli 提供了一组命令，用来帮助开发者在运行 webpack 时快速地加入一些自定义设置。



### 命令

### 使用方法

1. 命令行直接执行：

   如果没有全局安装 webpack，则无法直接在命令行中运行 `webpack`，需要运行 `npx webpack`

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
    filename: 'bundle.js',
    // 表示所有打包成的文件之间的引用前，都加一个路径
  	// 如果需要引入上传到 cdn 的 js 文件，需要在 html 文件中引入的 js 文件地址前加上 cdn 前缀。
  	// publicPath: 'https://cdn.com'
  	// publicPath: '/'
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

### 

### Hot Module Replacement

热模块替换是指当我们对代码修改并保存后，webpack 将会对修改的代码进行重新打包，并将新的模块发送到浏览器端，浏览器用新的模块替换掉旧的模块，以实现在不刷新浏览器的前提下更新页面。

相对于 `live reload` 刷新页面的方案，HMR 的优点在于可以保存应用的状态，提高了开发效率。

热模块更新可以使 webpack 在 css 文件改变时，不刷新浏览器，直接更新页面。

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
    // 宜在写 css 时打开，写 js 时建议关闭
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

配置完成后，css 的 HMR 可以自动生效，是因为 style-loader、vue-loader（vue）、babel-preset（react）中,帮我们实现了监听文件变化，更新页面的回调。



### 请求转发

```js
// webpack.dev.js
const devConfig = {
  devServer: {
    proxy: {
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
    }
  },
}
```

### 单页应用路由

使用 historyApiFallback，只能解决单页应用在开发环境中使用 devServer 时的路由问题，并没有解决线上环境的路由问题，此时需要后端在 nginx 或 apache 上进行同样的配置。

```js
// webpack.dev.js
const devConfig = {
  devServer: {
    // 无论访问路径是什么，始终请求 index.html
    // historyApiFallback: true,
    historyApiFallback: {
      rewrites: [
        {from: /\/.*/, to: '/index.html'}
      ]
    }
  },
}
```



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
    // 入口文件 index.js 以外的模块打包后生成文件的文件名
    chunkFilename: '[name].chunk.js',
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

options 中的配置也可以写在 bebel 的默认配置文件 babel.config.json（低版本为 .babelrc） 中

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

将 webpack.config.js 拆分为 webpack.common.js 、webpack.dev.js 和 webpack.prod.js

通过 webpack-merge 将 webpack.common.js 引入 webpack.dev.js 和 webpack.prod.js

```js
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
```



# Code Splitting

代码分割并不是 webpack 独有的概念，只是 webpack 内部实现了代码分割的功能，可以将业务逻辑和引入的包分别打包到不同的文件。

优点：

1. 解决打包文件过大，加载时间长的问题。
2. 页面 js 更新时，用户只需要加载有变化的 js 即可，没有变化的 js 会从缓存中读取。



同步引入的模块：需要在 webpack.common.js 中配置 optimization。

```js
import _ from 'lodash'

console.log(_.join([0, 1], '-'))
```

```js
module.exports = {
  optimization: {
    splitChunks: {
      chunks: 'all'
    }
  }
}
```

异步引入的模块：无需配置，SplitChunksPlugin 默认自动对异步引入的模块进行代码分割，如：

```js
function getComponent() {
  return import('lodash').then(({ default: _ }) => {
    let ele = document.createElement('div')
    ele.innerHTML = _.join([0, 1], '-')
    return ele
  })
}

getComponent().then(ele => {
  document.body.appendChild(ele)
})
```



### SplitChunksPlugin

Chunk 是 Webpack 打包过程中，一堆 module 的集合。

一个Chunk是一些模块的封装单元。Chunk在构建完成就呈现为bundle。

Chunk是过程中的代码块，Bundle是结果的代码块。

```js
module.exports = {
  optimization: {
    splitChunks: {
      // 对哪种类型的 chunk 进行打包，取值：async、initial、all
      // 默认为 async，因为对同步模块做代码分割意义不大，不能提高首屏加载速度，仅对利用浏览器缓存保存没有更新的模块有些微意义。
      chunks: "async",
      // 引入的库大于 30kb，则进行代码分割
      minSize: 30000,
      // 要求插件尝试将大于 50kb 的包二次分割成多个 50kb 的包
      maxSize: 50000,
      // 当模块至少被打包生成的 1 个文件（chunk）引用时，对其进行代码分割
      minChunks: 1,
      // 最多打包出 5 个文件
      maxAsyncRequests: 5,
      // 入口文件 index.js 最多被打包成 3 个文件
      maxInitialRequests: 3,
      // 打包出文件的文件名连接符
      automaticNameDelimiter: '~',
      // true 表示插件将自动根据 chunk 名和 cacheGroupKey 为打包出的文件命名
      name: true,
      cacheGroups: {
        // 打包后前缀为 vendors 的包的要求
        vendors: {
          test: /[\\/]node_modules[\\/]/,
          // 优先级，模块将优先被打包到优先级高的 cacheGroup 中
          priority: -10,
          name: 'vendors'
        },
        default: {
          minChunks: 2,
          priority: -20,
          // 插件运行过程中，如果遇到之前已经被打包过的模块，不再打包，而是复用之前打包好的模块
          reuseExistingChunk: true
        }
      }
    }
  }
}
```



# Lazy Loading

```js
function getComponent() {
  return import('lodash').then(({ default: _ }) => {
    let ele = document.createElement('div')
    ele.innerHTML = _.join([0, 1], '-')
    return ele
  })
}

// 用户点击页面之前，网页不会加载打包好的 vendors~lodash.js 文件
document.addEventListener('click', () => {
  getComponent().then(ele => {
    document.body.appendChild(ele)
  })
})
```

异步调用的代码写到单独的文件中，降低网页首次加载时用到的 js 文件的体积。

```js
// click.js
function handleClick() {
  const ele = document.createElement('div')
  ele.innerHTML = 'hello'
  document.body.appendChild(ele)
}

export default handleClick
```

```js
// index.js
document.addEvementListener('click', () => {
  import('./click.js').then(({ default: click }) => {
    click()
  })
})
```



# 打包分析

运行 `webpack --profile --json > stats.json --config ./build/webpack.dev.js`，生成 stats.json 文件，将该文件上传到不同的网站，可以获得多种可视化分析。

也可以安装插件 webpack-bundle-analyzer



# Prefetching/Preloading modules

prefetch 模块会利用父模块加载完成后的空闲时间，进行加载。

preload 模块会与父模块同时加载。

一般使用 prefetch 即可。

```js
document.addEventListener('click', () => {
  import(/* webpackPrefetch: true */ './click.js').then(({ default: click }) => {
    click()
  })
})
```



# MiniCssExtractPlugin

MiniCssExtractPlugin 可以让 css 文件被独立打包成 css，而不是被打包到 js 文件中去。

```js
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = {
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
  }
}
```



# OptimizeCssAssetsPlugin

用于压缩 css 代码

CssMinimizerPlugin 是一个类似的插件，但与 webpack4 似乎有兼容性问题，使用时报错

```js
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');

module.exports = {
  plugins: [
    new OptimizeCssAssetsPlugin({}),
  ]
}
```



# 浏览器缓存

如果 output 中设置 filename: [name].js，业务代码变更时，重新打包代码上传服务器后，由于文件名不变，用户浏览器访问页面时，会从上次页面的缓存中读取 js 文件，导致新的代码无法生效。故需要在 filename 中加入文件的 hash 值：

```js
module.exports = {
  output: {
    filename: [name].[contenthash].js
  }
}
```





# Shimming

shimming 垫片，指通过一些 loader 或 plugin 修改 webpack 的一些默认行为。

某些老的第三方库可能直接使用了一些第三方库而又没有引入，此时需要使用 webpack 自带的 ProvidePlugin。（实际上不使用此插件也可以正常打包？）

```js
module.exports = {
  plugins: [
    new webpack.ProvidePlugin({
      // 当发现一个模块中使用了 _ 时，自动在该模块中引入 lodash，并命名为 _
      _: 'lodash'
    })
  ]
}
```

使用 imports-loader 让模块中的 this 指向 window

```js
module.exports = {
  module: {
    rules: [
      {
        test: /\.m?js$/,
        exclude: /node_modules/,
        use: [
          "babel-loader",
          "imports-loader?this=>window"
        ]
      },
    ]
  }
}
```





# 环境变量

打包时可以统一使用 webpack.common.js 作为配置文件，再通过在 shell 中写环境变量，控制打包方式。

```js
// webpack.common.js
const { merge } = require('webpack-merge')
const devConfig = require('./webpack.dev.js')
const prodConfig = require('./webpack.prod.js')
const commonConfig = {
  
}

module.exports = env => {
  if (env && env.production) {
    return merge(commonConfig, prodConfig)
  } else {
    return merge(commonConfig, devConfig)
  }
}
```

```js
// package.json
{
  "scripts": {
    "dev": "webpack-dev-server --config ./build/webpack.common.js",
    "build": "webpack --env.production --config ./build/webpack.common.js"
  },
}
```



# Library

```js
module.exports = {
  output: {
    // 使库文件兼容各种协议（AMD、common js、ES MODULE），可以被模块化引入
    libraryTarget: 'umd',
    // 在 window 中加入 library 变量，使用户可以用 library. 的形式调用库
    libray: 'library'
  },
  // 打包过程中，如果遇到 lodash，忽略它，不要将其打包。
  externals: ['lodash']
}
```



# PWA

```js
// webpack.prod.js
const WorkboxPlugin = require('workbox-webpack-plugin')

const prodConfig = {
  plugins: [
    new WorkboxPlugin.GenerateSW({
      clientsClaim: true,
      skipWaiting: true
    })
  ],
}
```

```js
// index.js
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/service-worker.js')
      .then(registration => {
        console.log('service-worker registed')
      }).catch(err => {
        console.log('service-worker register error')
      })
  })
}
```





# Eslint

npm 安装 eslint、eslint-loader，vscode 安装 Eslint

npm 安装 eslint 后，可以命令行运行 npx eslint folder_name， 检测当前目录下某个文件夹中的文件是否符合 eslint。

```js
// webpack.common.js
module.exports = {
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: [
          "babel-loader",
          // "eslint-loader"
          {
            loader: 'eslint-loader',
            options: {
              // 自动修复错误
              fix: true
            }，
            // 强制 eslint-loader 先执行
            force: 'pre',
          }
        ]
      },
    ]
  }
}
```

```js
// webpack.dev.js
const devConfig = {
  devServer: {
    // 如果打包时 eslint-loader 报错，在浏览器中浮层提示
    overlay: true,
  }
}
```



# 多页面应用

```js
// webpack.common.js
const configs = {
  entry: {
    list: './src/list.js',
    index: './src/index.js',
  },
}

configs.plugins = addPlugins(configs)

// 用 addPlugins 函数自动根据 entry 向 plugins 中添加 HtmlWebpackPlugin
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
```





