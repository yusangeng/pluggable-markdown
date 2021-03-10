import { default as originalMarked } from 'marked';
import myToken from './token';
import myMarked from './marked';

originalMarked.Lexer.prototype.token = myToken;

export const marked = myMarked;

export default marked;
