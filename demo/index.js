import fs from 'fs'
import path from 'path'
import Markdown from '../src'

class FooPlugin {
  get name () {
    return 'foo'
  }

  token (context, token, index, tokens) {
    return tokens
  }

  render (context, token) {
    return `<Foo data="${token.args}" />\n`
  }
}

const options = {
  // marked配置项
}

const md = new Markdown(options)

md.registerPlugin(new FooPlugin())

md.exec(fs.readFileSync(path.resolve(__dirname, './index.md'), { encoding: 'utf8' }))

// 渲染结果
console.log('output:', md.output)
console.log(`\n\n`)

// 词法分析结果
// console.log('tokens:', md.tokens)
// console.log(`\n\n`)

// 全局上下文
// console.log('context:', md.context)
// console.log(`\n\n`)

// 错误
// console.error('error:', md.error)
// console.log(`\n\n`)

