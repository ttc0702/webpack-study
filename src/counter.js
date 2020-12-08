function counter() {
  var div = document.createElement('button')
  div.innerHTML = '0'
  div.onclick = function () {
    div.innerHTML = parseInt(div.innerHTML, 10) + 1
  }
  document.body.append(div)
}

export default counter