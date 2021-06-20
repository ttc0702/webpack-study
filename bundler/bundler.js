const fs = require('fs')
const path = require('path')
const parser = require('@babel/parser')
const traverse = require('@babel/traverse').default
const babel = require('@babel/core')

const moduleAnalyser = (filename) => {
  const content = fs.readFileSync(filename, 'utf-8')
  const ast = parser.parse(content, {
    sourceType: 'module'
  })
  // ast.program.body 是一个数组，它存储了很多 Node 对象，每个对象对应源代码中的一行代码
  // console.log(ast.program.body)
  let dependencies = {}
  // traverse 可以方便的提取 ast.program.body 中符合条件的 node
  traverse(ast, {
    ImportDeclaration({ node }) {
      const dirname = path.dirname(filename)
      console.log(dirname)
      const newPath = path.join(dirname, node.source.value)
      dependencies[node.source.value] = newPath
    }
  })

  // 获取转换后的代码
  const { code } = babel.transformFromAst(ast, null, {
    presets: ['@babel/preset-env']
  })

  return {
    filename,
    dependencies,
    code
  }
}

const makeDependenciesGraph = entry => {
  const entryModule = moduleAnalyser(entry)
  const graphArr = [entryModule]
  // for 循环结合 push() 递归处理 dependencies
  for (let i = 0; i < graphArr.length; i++) {
    const item = graphArr[i]
    const { dependencies } = item
    if (dependencies) {
      for (let j in dependencies) {
        graphArr.push(moduleAnalyser(dependencies[j]))
      }
    }
  }

  const graph = {}
  graphArr.forEach(item => {
    graph[item.filename] = {
      dependencies: item.dependencies,
      code: item.code
    }
  })
  return graph
}

const generateCode = entry => {
  const graph = JSON.stringify(makeDependenciesGraph(entry))
  // 在闭包中执行代码，避免污染全局环境
  // 注意加分号
  return `
    (function(graph){
      function require(module) {
        function localRequire(relativePath) {
          return require(graph[module].dependencies[relativePath])
        }
        var exports = {};
        (function(require, exports, code) {
          eval(code)
        })(localRequire, exports, graph[module].code)

        return exports
      }
      require('${entry}')
    })(${graph})
  `
}

// console.log(makeDependenciesGraph('src/index.js'))
console.log(generateCode('src/index.js'))