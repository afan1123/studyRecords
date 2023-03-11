function myCall() {
  if (typeof this !== 'function') {
    throw new Error('....');
  }
  let args = [...arguments].slice(1);
  let context = {};
  context.fn = this || window;
  let res = context.fn(args);
  return res;
}
