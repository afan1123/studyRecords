function myNew() {
  let constructor = [...arguments].shift();
  if (typeof constructor !== 'function') {
    throw Error('111');
  }
  let obj = {};
  obj = Object.create(constructor.prtotype);
  let res = constructor.call(obj, ...arguments);
  const flag = typeof res === 'object' || typeof res === 'function';
  return flag ? res : obj;
}
