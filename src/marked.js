import marked from 'marked'
import merge from './merge'

export default function myMarked (src, opt, tokensHandler, resultHandler) {
  // throw error in case of non string input
  if (typeof src === 'undefined' || src === null) {
    throw new Error('marked(): input parameter is undefined or null')
  }

  if (typeof src !== 'string') {
    throw new Error('marked(): input parameter is of type ' + Object.prototype.toString.call(src) + ', string expected')
  }

  opt = merge({}, marked.defaults, opt || {})

  const { highlight, tokenizeOnly } = opt
  let tokens

  try {
    tokens = marked.Lexer.lex(src, opt)
  } catch (e) {
    return resultHandler(e)
  }

  tokens = tokensHandler(tokens)

  if (tokenizeOnly) {
    return resultHandler(null, '')
  }

  let pending = tokens.length

  const done = function done (err) {
    if (err) {
      opt.highlight = highlight
      return resultHandler(err)
    }

    let out

    try {
      out = marked.Parser.parse(tokens, opt)
    } catch (e) {
      err = e
    }

    opt.highlight = highlight

    return resultHandler(err, out)
  }

  if (!highlight || highlight.length < 3) {
    return done()
  }

  delete opt.highlight

  if (!pending) return done()

  for (let i = 0; i < tokens.length; i++) {
    ;(function (token) {
      if (token.type !== 'code') {
        return --pending || done()
      }
      return highlight(token.text, token.lang, function (err, code) {
        if (err) return done(err)
        if (code == null || code === token.text) {
          return --pending || done()
        }
        token.text = code
        token.escaped = true
        --pending || done()
      })
    })(tokens[i])
  }
}

