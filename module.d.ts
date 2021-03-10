import { Tokens } from 'marked';

declare module 'pluggable-markdown' {
  type Token = {
    type: string;
    depth: number;
    text: string;
    handled: boolean;
    args: any;
  };

  type TransformerContext = Record<string, any>;

  interface TransformerPlugin {
    readonly name: string;

    token(context: TransformerContext, token: Token, index: number, tokens: Token[]): Token[];
    render(context: TransformerContext, token: Token): string;
  }

  type TransformerOptions = Record<string, any>;

  export declare class Transformer {
    readonly output: any;
    readonly error: any;
    readonly content: TransformerContext;
    readonly tokens: Token[];
    readonly options: TransformerOptions;

    constructor(options: TransformerOptions);

    registerPlugin(plugin: TransformerPlugin): void;
    exec(src: string): void;
    tokenize(src: string): void;
  }

  export default Transformer;
}
