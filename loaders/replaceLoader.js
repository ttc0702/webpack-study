// const loaderUtils = require('loader-utils')

module.exports = function (source) {
  // 可以通过 this.query 获取 webpack.config.js 中的 options
  // return source.replace('hello', `${this.query.name} change the`)
  return source.replace(' (http://hart-dev.com)', '')

  // const options = loaderUtils.getOptions(this)

  // const res = source.replace('hello', `${options.name} change the`)
  // return res
  // this.callback(null, res)
  // this.callback 相当于 return，但是可以向外传递更多的信息
  // this.callback(
  //   err: Error | null,
  //   content: string | Buffer,
  //   sourceMap?: SourceMap,
  //   meta?: any
  // );
  

  // 异步
  // const callback = this.async()
  // setTimeout(() => {
  //   const res = source.replace('hello', `${options.name} change the`)
  //   callback(null, res)
  // }, 1000)
}
