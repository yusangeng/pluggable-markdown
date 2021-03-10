import marked from './custom-marked';

export default class Transformer {
  get output() {
    return this.output_;
  }

  get error() {
    return this.error_;
  }

  get context() {
    return this.context_;
  }

  get tokens() {
    return this.tokens_;
  }

  get options() {
    return this.options_;
  }

  constructor(options = {}) {
    this.options_ = options;
    this.plugins_ = {};
    this.output_ = '';
    this.error_ = null;
    this.context_ = {};
    this.tokens_ = [];
  }

  registerPlugin(plugin) {
    const { name } = plugin;

    if (this.plugins_[name]) {
      throw new Error(`${name}插件已经被注册.`);
    }

    this.plugins_[name] = plugin;
  }

  // 词法分析加转译
  exec(src) {
    // 这里必须清空, 否则本次执行会和上次有冲突
    this.context_ = {};

    marked(
      src,
      this.options,
      this._handleTokens.bind(this, src),
      this._handleResult.bind(this),
      this._handlePluginRender.bind(this)
    );
  }

  // 只做词法分析
  tokenize(src) {
    // 这里必须清空, 否则本次执行会和上次有冲突
    this.context_ = {};

    const { options } = this;
    const tokenizeOnly = true;
    marked(src, { ...options, tokenizeOnly }, this._handleTokens.bind(this, src), this._handleResult.bind(this));
  }

  _handleTokens(src, tokens) {
    const task = (toks) => {
      const index = toks.findIndex((tok) => tok.type === 'plugin' && !tok.handled);

      if (index < 0) {
        return [tokens, true];
      }

      const pluginToken = toks[index];

      return [this._handlePluginToken(pluginToken, index, tokens, src), false];
    };

    let toks = tokens;

    while (true) {
      const [newToks, finished] = task(toks);

      if (finished) {
        break;
      }

      toks = newToks;
    }

    this.tokens_ = toks.slice();

    return toks;
  }

  _handlePluginRender(pluginToken) {
    const { name } = pluginToken;
    const plugin = this.plugins_[name];

    if (!plugin) {
      console.warn(`[PLUGGABLE-MARKDOWN-WARN] render时找不到插件${name}`);
      return '';
    }

    if (!plugin.render) {
      return '';
    }

    console.log(`[PLUGGABLE-MARKDOWN] 执行插件 ${name} render流程...`);
    return plugin.render(this.context, pluginToken);
  }

  _handleResult(err, output) {
    this.error_ = err;
    this.output_ = output;
  }

  _handlePluginToken(pluginToken, pluginTokenIndex, tokens, src) {
    const { name } = pluginToken;
    pluginToken.handled = true;

    const plugin = this.plugins_[name];

    if (!plugin) {
      console.warn(`[PLUGGABLE-MARKDOWN-WARN] token时找不到插件${name}`);
      return tokens;
    }

    if (!plugin.token) {
      return tokens;
    }

    console.log(`[PLUGGABLE-MARKDOWN] 执行插件 ${name} token处理流程...`);
    return plugin.token(this.context, pluginToken, pluginTokenIndex, tokens, src);
  }
}
