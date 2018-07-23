import fs from 'fs'
import path from 'path'
import Markdown from '../src'
import FooPlugin from './FooPlugin'

const options = {
  // marked配置项
}

const md = new Markdown(options)

md.registerPlugin(new FooPlugin())
md.tokenize(fs.readFileSync(path.resolve(__dirname, './index.md'), { encoding: 'utf8' }))

// 渲染结果
// console.log('output:', md.output)
// console.log(`\n\n`)

// 词法分析结果
console.log('tokens:', md.tokens)
console.log(`\n\n`)

// 全局上下文
// console.log('context:', md.context)
// console.log(`\n\n`)

// 错误
// console.error('error:', md.error)
// console.log(`\n\n`)

