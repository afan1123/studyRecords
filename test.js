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
 * 10. 数组扁平化
 * 11. 数组去重
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
// 最后一次也触发
function throllte(fn, delay) {
  let curTime = Date.now(),
    timer = null;
  return function () {
    let nowTime = Date.now(),
      args = arguments,
      context = this,
      restTime = delay + curTime - nowTime;
    if (restTime < 0) {
      if (timer) {
        clearTimeout(timer);
        timer = null;
      }
      fn.apply(context, args);
      curTime = Date.now();
    } else if (!timer) {
      timer = setTimeout(() => {
        fn.apply(context, args);
      }, delay);
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
  let res = context.fn(args);
  delete context.fn;
  return res;
}

function Promiseall(promises) {
  if (!Array.isArray(promises)) {
    return false;
  }
  let count = 0,
    results = [],
    len = promises.length;
  for (let i = 0; i < len; i++) {
    Promise.resolve(promises[i]).then(
      (val) => {
        count++;
        results[i] = val;
        if (count === len) {
          return res(results);
        }
      },
      (error) => {
        rej(error);
      }
    );
  }
}

function PromiseRace(promises) {
  return new Promise((res, rej) => {
    for (let i = 0; i < promises.length; i++) {
      promises[i].then(res, rej);
    }
  });
}

// 数组扁平化
function flatten(arr) {
  return arr.reduce(function (prev, next) {
    return prev.concat(Array.isArray(next) ? flatten(next) : next);
  }, []);
}
function flatten(arr) {
  return arr.toString().split(',');
}
function flatten(arr) {
  return arr.flat(Infinity);
}

// 柯里化
function curry(fn, ...args) {
  return fn.length <= args.length ? fn(...args) : curry.bind(null, fn, ...args);
}
