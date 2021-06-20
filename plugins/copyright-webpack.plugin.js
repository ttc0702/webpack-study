class CopyrightWebpackPlugin {
  constructor(options) {
    console.log(options)
  }

  // compiler 中存放了打包的所有相关内容
  apply(compiler) {
    // compilation 中存放了本次打包的相关内容
    // 异步钩子 emit
    compiler.hooks.emit.tapAsync('CopyrightWebpackPlugin', (compilation, cb) => {
      debugger
      compilation.assets['copyright.txt'] = {
        source: () => {
          return 'copyright by Neo'
        },
        size: () => {
          return 16
        }
      }
      cb()
    })

    // 同步钩子 compile
    compiler.hooks.compile.tap('CopyrightWebpackPlugin', (compilation) => {
      console.log(compilation.assets)
    })
  }
}

module.exports = CopyrightWebpackPlugin