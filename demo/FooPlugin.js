export default class FooPlugin {
  get name() {
    return 'foo';
  }

  token(context, token, index, tokens) {
    return tokens;
  }

  render(context, token) {
    return `<Foo data="${token.args}" />\n`;
  }
}
