import marked from 'marked'

function merge (obj) {
  var i = 1
  var target
  var key

  for (; i < arguments.length; i++) {
    target = arguments[i]
    for (key in target) {
      if (Object.prototype.hasOwnProperty.call(target, key)) {
        obj[key] = target[key]
      }
    }
  }

  return obj
}

export default function myMarked (src, opt, tokensHandler, resultHandler) {
  // throw error in case of non string input
  if (typeof src === 'undefined' || src === null) {
    throw new Error('marked(): input parameter is undefined or null')
  }

  if (typeof src !== 'string') {
    throw new Error('marked(): input parameter is of type ' + Object.prototype.toString.call(src) + ', string expected')
  }

  opt = merge({}, marked.defaults, opt || {})

  var highlight = opt.highlight
  var tokens
  var pending
  var i = 0

  try {
    tokens = marked.Lexer.lex(src, opt)
  } catch (e) {
    return resultHandler(e)
  }

  tokens = tokensHandler(tokens)

  pending = tokens.length

  var done = function (err) {
    if (err) {
      opt.highlight = highlight
      return resultHandler(err)
    }

    var out

    try {
      out = marked.Parser.parse(tokens, opt)
    } catch (e) {
      err = e
    }

    opt.highlight = highlight

    return err ? resultHandler(err) : resultHandler(null, out)
  }

  if (!highlight || highlight.length < 3) {
    return done()
  }

  delete opt.highlight

  if (!pending) return done()

  for (; i < tokens.length; i++) {
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

