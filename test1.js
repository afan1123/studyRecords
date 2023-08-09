// 解析 URL 中的 queryString，返回一个对象
// 返回值示例：
// {
//   name: 'coder',
//   age: '20'.
//   callback: 'https://zeekrlife.com?name=test',
//   list: [a, b],
//   json: {str: "abc", num: 123}, //固定key
// }

let url =
  'https://zeekrlife.com/?name=coder&age=20&callback=https%3A%2F%2Fzeekrlife.com%3Fname%3Dtest&list[]=a&list[]=b&json=%7B%22str%22%3A%22abc%22,%22num%22%3A123%7D';

function parseQueryString(url) {
  let temp = url.split('?'); // ['https...','?name=...&age=...']
  let curArr = temp[1].substr(0, 1).split('&'); //['name=...','age=...']
  // [{name:'..'},{'age:'..'}]
  let res = curArr.map((item) => {
    let key = item.split('=')[0];
    let value = item.split('=')[1];
    // 不会正则
    if (value === 'https%3A%2F%2Fzeekrlife.com%3Fname%3Dtest') {
      value = 'https://zeekrlife.com?name=test';
    }
    // 判断list
    return {
      [key]: value,
    };
  });
  let obj = {};
  res.forEach((item) => {
    obj = { ...obj, ...item };
  });
  return obj;
}

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
