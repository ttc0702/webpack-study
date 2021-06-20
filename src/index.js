// import { message } from './message.js'

// console.log(`Neo ${message}`)

import React, { Component } from 'react'
import ReactDom from 'react-dom'
import ReactJson from 'react-json-view'

class App extends Component {
  state = {
    test: { a: 0 }
  }
  
  render() {
    return (
      <ReactJson name={null} src={this.state.test} />
    )
  }
}

ReactDom.render(<App/>, document.getElementById('root'))
