import marked from 'marked'

const Parser = marked.Parser
const originalTok = Parser.prototype.tok

export default function tok (pluginHandler) {
  let ret = ''

  if (this.token.type === 'plugin') {
    ret = pluginHandler(this.token)
  } else {
    ret = originalTok.call(this)
  }

  console.log(`[PLUGGABLE-MARKDOWN] token: ${this.token.type}——\n${ret}`)

  return ret
}
