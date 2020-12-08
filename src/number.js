function number() {
  var div = document.createElement('button')
  div.setAttribute('id', 'number')
  div.innerHTML = '300'
  document.body.append(div)
}

export default number