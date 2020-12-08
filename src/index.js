import { a } from './header.js'
import { b } from './content.js'
import nodejs from './nodejs.png'
// import './index.css'
import './index.scss'
// import style from './index.scss'

console.log(a)
console.log(b)

let img = document.createElement('img')
img.src = nodejs
// img.classList.add('nodejs')
// img.className = 'nodejs'
// img.className = style.nodejs

let root = document.getElementById('root')
// root.append(img)
root.innerHTML = '<div class="iconfont icon-mode"></div>'