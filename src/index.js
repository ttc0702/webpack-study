// import { add, test } from './math.js'
// add(1, 3)

// import { test } from './lodash.js'
// test()
// import _ from 'lodash'
// console.dir(_)
// console.log(_.join(['a', 'b', 'c'], '*'))

// import './index.css'
// function getComponent() {
//   return import(/* webpackChunkName: 'lodash' */ 'lodash').then(({ default: _ }) => {
//   // return import('lodash').then(({ default: _ }) => {
//     const ele = document.createElement('div')
//     ele.innerHTML = _.join([0, 1], '-')
//     return ele
//   })
// }

// getComponent().then(ele => {
//   document.body.appendChild(ele)
// })

// document.addEventListener('click', () => {
//   getComponent().then(ele => {
//     document.body.appendChild(ele)
//   })
// })

// document.addEventListener('click', () => {
//   import(/* webpackPrefetch: true */ './click.js').then(({ default: click }) => {
//     click()
//   })
// })

// if ('serviceWorker' in navigator) {
//   window.addEventListener('load', () => {
//     navigator.serviceWorker.register('/service-worker.js')
//       .then(registration => {
//         console.log('service-worker registed')
//       }).catch(err => {
//         console.log('service-worker register error')
//       })
//   })
// }

import React, { Component } from 'react'
import ReactDom from 'react-dom'
import axios from 'axios'

class App extends Component {
  componentDidMount() {
    axios.get('/react/api/header.json')
      .then(res => {
        console.log(res)
      })
  }
  render() {
    return <div>change the world</div>
  }
}
ReactDom.render(<App/>, document.getElementById('root'))

