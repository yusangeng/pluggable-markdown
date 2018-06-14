# pluggable-markdown

[![Build Status](https://travis-ci.org/Y3G/pluggable-markdown.svg?branch=master)](https://travis-ci.org/Y3G/pluggable-markdown) [![Standard - JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)

[![Npm Info](https://nodei.co/npm/pluggable-markdown.png?compact=true)](https://www.npmjs.com/package/pluggable-markdown)

## 综述

基于marked, 在其转译markdown的流程中增加插件语法, 用于自定义渲染和内容修改.

## 安装

``` shell
npm install pluggable-markdown --save
```

## 使用

### 插件语法

plugggable-markdown的插件语法如下:

``` markdown
@foo
## title2

@bar(a, b, c)

some paragraph.
```

其中`@foo`和`@bar(a, b, c)`是插件调用语句.

### 配置和调用

plugggable-markdown底层基于marked, 其option配置项, 与marked保持一致.

详见：https://github.com/markedjs/marked

调用方式如下:

``` js
import Markdown from 'plugggable-markdown'
import fs from 'fs' 

const options = {
  // marked配置项
}

const md = new Markdown(options)

md.registerPlugin(new FooPlugin())

md.exec(fs.readFileSync('path/to/document', {encode: 'utf8'}))

// 渲染结果
console.log(md.output)
// 词法分析结果
console.log(md.tokens)
// 全局上下文
console.log(md.context)
// 错误
console.error(md.error)

// 插件类
class FooPlugin {
  // 插件名称, 必须存在的属性
  get name () {
    return 'foo'
  }

  /** 
   * 词法分析后处理函数, 用于根据当前plugin token处理其他token, 实现类似装饰器的效果.
   * 
   * @param {Object} context 上下文, 即markdown.context
   * @param {Object} token 当前的plugin token
   * @param {Number} index 当前的token数组下表 
   * @param {Array<Object>} tokens token数组
   * 
   * @returns {Array<Object>} 处理后的token数组
   */
  token (context, token, index, tokens) {
    // 必须返回一个token数组
    return tokens
  }

  /** 
   * 渲染函数, 用于将插件渲染成字符串.
   * 
   * @param {Object} context 上下文, 即markdown.context
   * @param {Object} token 当前的plugin token
   * 
   * @returns {String} 渲染结果
   */
  render (context, token) {
    return ''
  }
}

```