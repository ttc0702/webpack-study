// import { a } from './header.js'
// import { b } from './content.js'
// import counter from './counter'
// import number from './number'

// import nodejs from './nodejs.png'
// import './index.css'
// import './index.scss'
// import style from './index.scss'
import "@babel/polyfill";
import React, { Component } from 'react'
import ReactDom from 'react-dom'

// console.log(a)
// console.log(b)

// let img = document.createElement('img')
// img.src = nodejs
// img.classList.add('nodejs')
// img.className = 'nodejs'
// img.className = style.nodejs

// let root = document.getElementById('root')
// root.append(img)
// root.innerHTML = '<div class="iconfont icon-mode"></div>'

// var btn = document.createElement('button')
// btn.innerHTML = '新增'
// document.body.appendChild(btn)

// btn.onclick = function () {
//   var div = document.createElement('div')
//   div.innerHTML = 'item'
//   document.body.appendChild(div)
// }

// counter()
// number()
// 如果开启了 HMR，并且检测到 number 文件发生了变化，执行回调
// if (module.hot) {
//   module.hot.accept('./number', () => {
//     var num = document.getElementById('number')
//     document.body.removeChild(num)
//     number()
//   })
// }

// const arr = [
//   new Promise(() => { }),
//   new Promise(() => { }),
// ]

// arr.map(item => {
//   console.log(item)
// })
class App extends Component {
  render() {
    return <div>change the world</div>
  }
}
ReactDom.render(<App/>, document.getElementById('root'))