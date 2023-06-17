/**
 * 1. new
 * 2. instanceof
 * 3. call
 * 4. bind
 * 5. apply
 * 6. 节流
 * 5. 防抖
 * 7. 深拷贝
 * 8. 柯里化函数
 * 9. promise
 * **/

function myNew() {
  let con = [...arguments].shift();
  if (typeof con !== 'function') {
    throw Error('error');
  }
  let o = Object.create(con.prototype);
  let res = con.apply(o, [...arguments].slice(1));
  let flag = typeof res === 'function' || typeof res === 'object';
  return flag ? res : o;
}

function myInstanceof(l, r) {
  let l = Object.getPrototypeOf(l);
  let r = r.prototype;
  while (true) {
    if (l === null) return false;
    if (l === r) return true;
    l = Object.getPrototypeOf(l);
  }
}

function myThrollte(fn, delay) {
  let curTime = Date.now();
  return function () {
    let context = this,
      args = arguments,
      nowTime = Date.now();
    if (nowTime - curTime > delay) {
      fn.apply(context, args);
    }
  };
}
function debounce(fn, delay) {
  let timer = null;
  return function () {
    let context = this,
      args = arguments;
    if (timer) {
      clearTimeout(timer);
      timer = null;
    } else {
      timer = setTimeout(() => {
        fn.apply(context, args);
      }, delay);
    }
  };
}
function myCall(context) {
  if (typeof context !== 'function') {
    new Error('error');
  }
  context = context || window;
  let args = [...arguments].slice(1);
  let fn = this;
  context.fn = fn;
  let res = context.fn(...arguments);
  delete context.fn;
  return res;
}
