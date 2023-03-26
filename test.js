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

async function async1() {
  console.log('async1 start');
  await async2();
  console.log('async1 end');
}
async function async2() {
  console.log('async2');
}
console.log('script start');
setTimeout(function () {
  console.log('setTimeout');
}, 0);
async1();
new Promise(function (resolve) {
  console.log('promise1');
  resolve();
}).then(function () {
  console.log('promise2');
});
console.log('script end');
