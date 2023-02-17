# 面试复习

## js

### 解释一下原型链

- 函数或者对象的身上会存在原型，就是 prototype 属性，prototype 属性上挂在着一些方法，当函数或者对象访问时，可以写成 function/object.prototype 的形式，来访问里面的方法。还存在**proto**的属性，用来指向对象的原型，当调用 prtotype 访问不到想要的方法/属性时，会调用**proto**来查找其原型上的方法/属性。

### 寄生组合继承

#### 组合继承

- 缺点：两次构造函数的执行，第二次执行会把原先的实例属性覆盖

```js
// 会调用两次构造函数：1、创建子类原型时  2、子类型构造函数内部
function SuperType(name) {
  this.name = name;
  this.colors = ['red', 'blue'];
}
SuperType.prototype.sayName = function () {
  console.log(this.name);
};
function SubType(name, age) {
  SuperType.call(this, name); // 第二次调用SuperType
  this.age = age;
}
SubType.prototype = new SuperType(); // 第一次调用SuperType
SubType.prototype.sayAge = function () {
  console.log(this.age);
};
```

#### 解决方案：寄生组合继承

原理：

- 通过借用构造函数来继承属性；
- 通过原型链来继承方法

```js
function inheritPrototype(subType, superType) {
  // 1、创建超类型原型的副本
  var protoType = Object.create(superType.prototype); // 创建对象
  // 2、为创建的副本添加constructor属性，弥补因重写原型而失去的默认的constructor属性
  protoType.constructor = subType; // 增强对象
  // 3、将新创建的对象（即副本）赋值给子类型的原型
  subType.prototype = protoType; // 指定对象
}
function SuperType(name) {
  this.name = name;
  this.colors = ['red', 'blue'];
}
SuperType.prototype.sayName = function () {
  console.log(this.name);
};
function SubType(name, age) {
  SuperType.call(this, name);
  this.age = age;
}
inheritPrototype(SubType, SuperType);
SubType.prototype.sayAge = function () {
  console.log(this.age);
};
const instance = new SubType('Bob', 18);
instance.sayName();
instance.sayAge();
```

### instanceof 原理

```js
function myInstanceof(left, right) {
  let proto = L.__proto__;
  let prototype = R.prototype;
  while (true) {
    if (L == null) return false;
    if (prototype == proto) return true;
    L = L.__proto__;
  }
}
```

### 具体原型链判断

### Object.prototype.\_\_proto\_\_ ===null

### Function.prototype.\_\_proto\_\_ === Object.prototype

### 构造函数自身的\_\_proto\_\_ === Function.prototype

### Object 的\_\_proto\_\_ === Function.prototype

### Object instanceof Function === true

### Function instanceof Object === true

### Function.prototype === Function.\_\_proto\_\_

### New 操作符

```js
function myNew() {
  // 1、获取构造函数，判断函数
  const constructor = [...arguments].shift();
  if (typeof constructor !== 'function') {
    console.error('type error');
    return;
  }
  // 2、新建一个空对象
  let obj = {};
  // 3、对象的原型为构造函数的 prototype 对象
  obj = Object.create(constructor.prototype);
  // 4、 将 this 指向新建对象，并执行函数
  let result = constructor.call(obj, ...arguments);
  // 5、判断是否返回对象/函数
  let flag =
    result && (typeof result === 'object' || typeof result === 'function');
  return flag ? result : obj;
}
// myNew(函数，参数...)
```

### this 指向

- this 是执行上下文的一个属性，用来表示执行这个函数的最后一个对象。有四种模式：
  - 函数调用模式：当一个函数不是对象的属性时，直接调用函数，this 指向全局
  - 方法调用模式：当一个函数是对象的属性时，this 指向这个对象
  - 构造器调用模式：当一个函数被 new 出来时，根据 new 实现原理，会创建一个新对象，this 指向这个新创建的对象
  - call、apply、bind：会改变 this 指向
  - 注意：
    - 优先级：构造器调用模式>call、apply、bind> 方法调用模式>函数调用模式

### const、let、var 区别

- var
  - 变量/函数提升：在最近得上下文最前面添加变量。
  - 未声明，直接初始化，则添加到全局上下文。
- let
  - 适用于块级作用域
  - 不能重复声明变量
  - 不会有提升效果，会形成暂时性死区
- const
  - 不能重复声明
  - 不能更改，但可以更改对象键值。
  - 没有提升效果

### 闭包的作用和原理以及使用场景

- 定义：可以让另一个上下文访问该函数内部的方法和变量
- 原理：在函数内部再 return 一个可以访问内部变量的函数
- 作用：
  - 使函数外部网文函数内部的变量
  - 让已经执行完上下文中的变量持续留在内存中
- 场景：
  - 使用定时器回调，如防抖
  - IIFE 自执行函数
  - 函数作为参数，如事件监听，Promise.then...
  - 返回函数,如：递归..

### js 垃圾回收机制

当 js 代码运行时，需要为变量和值分配内存空间。当变量和值不参与运行时，就需要垃圾回收机制回收内存空间。
回收的主要有两种变量：局部变量和全局变量。全局变量的内存空间会随着页面的卸载而释放；局部变量的内存空间会随着函数的执行结束而释放。但是闭包，当外部变量指向函数内部变量时，其内存永远不会被回收。

- 主要的回收机制

  - 标记清楚法：
    - 原理：将变量标记为‘进入环境’和‘离开环境’两种，定时清理‘离开环境’标记的变量
    - 优点：设计简单方便
    - 缺点：
      - 分配效率低
      - 内存碎片化
  - 引用计数法：
    - 原理：跟踪每个值被引用的次数。当一个变量被引用类型赋值或者再赋值给别的变量后，这个值的引用次数+1；当这个变量设置为 null 就-1 或者其他的变量赋值为 null 就-1
    - 优点：只需要计数器，为 0 立即回收
    - 缺点：引用数量上限权问题，循环引用无法解决。
  - 分代式回收：
    - 新生代、老生代
      - 新生代原理：新加入的对象会进入使用区，然后对所有对象标记，复制对象进入空闲区。使用区写满就会清理一次。最后空闲区和使用区会互换内容，多次未被清理的对象转入老生代区。
      - 老生代原理：标记清楚法和标记整理（优化清除法的空间）
    - 优点：活跃区小且清理频繁，老生代很少接受检查，提高垃圾回收的频率
    - 并行回收
    - 增量标记与懒性清理

- 垃圾回收的代价比较大，所以应该尽量减少垃圾回收
  - 清空数组时，使用 length=0 的方式
  - 清空对象时，使用 null 的方式
  - 在循环中的函数表达式，如果可以复用，尽量放在函数的外面。

### 作用域的理解

- 定义：主要是存储函数\变量的地方，有全局作用域、局部作用域和块级作用域
- 作用域链：在当前作用域寻找变量，如果当前没有，则向上查找腹肌作用域，一直放文档 window 对象为止。

### apply\call\bind 区别

- 相同点：都是用来改变指向
- apply：
  - 直接调用
  - 后一个参数为数组
- call：
  - 直接调用
  - 后参数可以传很多
- bind：
  - 间接调用
  - 后参数可以传很多

### call 实现

```js
function myCall(context) {
  if (typeof this !== 'function') return;
  const args = [...arguments].slice(1);
  let result = null;
  context = context || window;
  context.fn = this;
  result = context.fn(args);
  delete context.fn;
  return result;
}
```

### 连续多个 bind，最后 this 指向是什么

- 只会是第一次绑定 bind 生效

```js
function foo1() {
  console.log(this.name);
}
let o1 = {
  name: 'jack',
};
let o2 = {
  name: 'rose',
};
const foo2 = foo1.bind(o1).bind(o2);
foo2(); // 'jack'
let o2 = {
  name: 'dan',
};
const foo3 = foo1.bind(o1).bind(o2).bind(o3);
foo3(); // 'jack'
```

### es6 新特性

- let const 关键字
- 解构赋值：...
- 箭头函数
  - 与普通函数与别
    - 普通函数有变量提升，他没有
    - 普通函数的 this 指向，谁调用就指向谁；箭头函数在哪里定义就指向谁
    - 普通函数可以当构造函数，箭头函数不行，因为没有 argumengts
- promise
- class 关键字
- 简单数据类型 symbol

### promise.all 和 promise.allsettled 区别

- promise.all：返回的是包裹 resolve 内容的数组，只要有一个 promise 对象报错，就报错
- promise.allsettled：返回的是包裹着对象的数组，不管里面有没有错，都会返回；如果是 resolve 的数据，则 status 为 fulfilled，否则是 rejected

### substr 和 string 区别

substr(startIndex,lenth)
substring(startIndex, endIndex)

### symbol 这个新增的基础数据类型有什么用

作用：

- 生成全局唯一的值
- symbol 作为键名，不被常规方法遍历，如 Object.keys()或者 for...in

场景：

- 可以在 class 里封装私有属性/方法

### js 脚本异步加载如何实现 有什么区别

js 文件与其他文件是同步加载的，会阻塞其他文件的加载，所以需要用到异步加载

- 三种方式：
  - defer 属性：需要等到 dom 文档全部解析完才会执行
  - async 属性：加载完就执行
  - 自己封装一个函数兼容性的异步加载 js 文件且可以根据 document 的状态来按需执行里面的函数
    - document 文档周期
      - loading：加载中状态，dom 树正在绘制
      - interactive：活跃状态，dom 树绘制完成
      - complete：完成状态，dom 树绘制完成且所有资源下载完成

### typeof 和 instanceof 区别

- typeof 只能准确比较基本数据类型
- instanceof 只能比较引用数据类型，根据左边的对象的\_\_proto\_\_是否在右边的对象原型链上来比较

### for in/for of 的区别

- 相同点：
  - 都能循环数组
- 不同点：
  - for in
    - 遍历键名
      - 可以遍历对象
  - for of
    - 遍历值
    - 不能遍历对象，只能遍历有 iterator 接口，如 Set，Map，String 等等
- map 和 forEach 不能通过 break 跳出，只能通过 return 跳出本次循环，通过 throw 跳出当前循环

### 判断数组类型

- Array.isArray()
- instanceof
- Object.prototype.toString.call()
- arr.constructor===Array

### sort 算法

默认排序顺序是先将元素转换为字符串，然后再进行排序
规则：
1、当 n<=10 时，采用插入排序
2、当 n>10 时，采用三路快速排序
3、10<n<=1000，采用中位数作为哨兵元素
4、n>1000，每隔 200~215 个元素挑出一个元素，放到一个新数组中，然后对它排序，找到中间位置的数，以此作为中位数

### 如何拷贝一个对象

- 将对象递归遍历，复制给一个新对象
- JSON.parse(JSON.toStringify(obj))
- 扩展运算符（浅拷贝）

### 改变原数组的方法

- pop
- push
- shift
- unshift
- sort
- reverse
- splice

### 0.1+0.2 为什么不等于 0.3

- 精度缺失：浏览器按照二进制进行计算，0.1 和 0.2 的二进制是无尽的，所以加起来不等于 0.3
- 解决方案：（0.1 + 0.2）.toFixed(2)===0.3

### ==和===有什么区别

- == 会先进行类型比较，若不同，则隐式转换；相同，则比较值

  - 隐式转换规则：
    1. 会先判断是否在对比 null 和 undefined，是的话就会返回 true
    2. 判断两者类型是否为 string 和 number，是的话就会将字符串转换为 number
    3. 判断其中一方是否为 boolean，是的话就会把 boolean 转为 number 再进行判断
    4. 判断其中一方是否为 object 且另一方为 string、number 或者 symbol，是的话就会把 object 转为原始类型再进行判断
  - 引用类型比较，转为原始值的方法：
    - Symbol.toPrimitive：若存在，优先调用且无视 valueOf 和 toString。
    - Object.prototype.toString：若期望值为 string，则优先调用；若返回值不是原始值，调用 valueOf。
    - Object.prototype.valueOf：若期望值为 number 或者 default，先调用 valueOf；若返回值不是原始值，调用 toString。
  - hint（期望值） - "string"
    - 模板字符串`${}`
    - test[obj] = 123
  - hint（期望值） - "number"
    - 一元+，位移
    - -，\*，/，关系运算符
    - Math.pow，String.prototype.slice 等很多内部方法
  - hint（期望值） - "default"
    - 二元 +
    - ==，!=
  - 注意：
    - 两个对象 ===，!== 不会触发隐式转换（比的是引用）
    - 两个对象 ==，!= 不会触发隐式转换（只有一边是对象的时候，才会触发）

- === 直接比较类型和值，不会隐式转换

### 解释 requestAnimationFrame/requestIdleCallback，分别有什么用？

- requestAnimationFrame：为了实现更流畅和性能更好的动画
- requestIdleCallback：为了在渲染空闲时间执行优先级不高的操作，以避免阻塞渲染。

### 谈下事件循环机制

事件循环分为同步任务与异步任务；所有同步任务在主线程上执行，形成任务栈。异步任务放到任务队列。任务队列有宏任务与微任务

- 宏任务：setTimeout、setInterval、I\O、UI 交互
- 微任务，promise.then 事件
- 执行过程：第一次循环，先执行同步任务，过程中遇到异步任务，则将异步任务放到任务战里，再接着执行同步任务，等到任务栈清空，再执行异步任务；异步任务先执行所有的微任务，再执行宏任务。过程中又产生微任务，则放到队列尾部，依次执行

### 浏览器缓存策略是怎样的（强缓存 协商缓存）

- 请求流程：再第一次请求后缓存资源，再次请求时：
  1. 浏览器会读取该缓存资源中的 header 信息，根据命中策略来判断是否命中强制缓存，要是命中则直接从缓存中获取资源，没命中则进行协商缓存
  2. 协商缓存会发送请求到服务器，请求会带上 IF-Modified-Since 或者 IF-None-Match，服务器分别返回 Last-Modified 和 E-Tag。服务器来对比这一对字段来判断是否命中，如果命中，返回 304，不会返回资源内容，浏览器会直接从缓存获取。否则会返回资源内容，并更新 header 中的相关缓存字段
- 强制缓存的命中策略：
  - Cache-Control：max-age=3600；（缓存时间为 3600 秒，当时间过期之后，会再次请求资源。）
  - Expires: Thu, 25 May 2020 12:30:00 GMT （该资源在未来某个时间点失效）

### 浏览器内核是什么 包含什么 常见的有哪些

- 浏览器内核：浏览器采用的渲染引擎和 JS 引擎
  - 渲染引擎：负责获取网页的内容并显示，不同的浏览器内核对网页的解析渲染也不同
  - JS 引擎：负责解析 Javascript 语言，执行 javascript 语言来实现网页的动态效果
- 种类：
  - IE：Trident 内核
  - Chrome：Blink 内核
  - Firefox：Gecko 内核
  - Safari：Webkit 内核
  - Opera：Blink 内核
- 打开了两个标签页是进程还是线程 ：多进程，包括 1 个浏览器进程，1 个 GPU 进程，1 个网络进程，和 1 个渲染进程，一共 4 个进程

### 输入网址网页发生的变化

1. 解析 URL
2. 缓存判断
3. DNS 解析
4. 获取 MAC 地址
5. TCP 三次握手
6. HTTPS 握手
7. 返回资源
8. 页面渲染
9. TCP 四次握手

- DNS 解析：判断 URL 中的域名 IP 地址是否有本地缓存，有则使用；若没有，向本地 DNS 服务器发起请求，本地 DNS 服务器也会检查有没有缓存。若没有，向根域名服务器发请求，获得权威域名服务器地址后，再向权威域名服务器发送请求，获得域名的 IP 地址后，再把这个 IP 地址返回给用户
- TCP 三次握手：客户端向服务端发送一个 SYN 和随机序列号，服务端接收请求后返回一个 SYN ACK 报文段和随机序列号，客户端接收响应，进入连接建立状态，向服务端发送一个 ACK 确认报文段，服务端进入连接状态。
- HTTPS 握手：客户端向服务端发送协议版本号、一个随机数和使用的加密方法；服务端收到后，确认加密方法，向客户端发送随机数和数字证书；客户端收到后，检查数字证书是否有效，有效则生成一个随机数，并使用证书中的公钥对随机数进行加密，将一个 hash 值和加密后的数据发送给服务端；服务端收到后，用自己的私钥解密，同时校验 hash 值。此时双方有了三个随机数，使用这三个随机数生成密钥，以后通信前，需要用密钥对数据加密后再传输
- TCP 四次握手：客户端发送连接释放请求，服务端发送 ACK 包并进入 CLOSE_WAIT 状态，此时服务端已经释放请求不再接受客户端数据。但服务端可以向客户端发送释放连接请求，并进入 LAST_ACK 状态，客户端收到后，向服务端发送确认应答，客户端进入 TIME_WAIT 状态。要是一段时间内没有收到服务端请求，则关闭连接，进入 CLOSED 状态
- 页面渲染：现根据 HTML 文件生成 DOM 树，再根据 CSS 文件解析样式，生成 CSSOM，将两者结合生成渲染树，然后进行布局，最后浏览器 GPU 进行渲染。

### 前端模块化机制有哪些

- CommonJS
  - 定义：主要是 Nodejs 使用，将每个文件视作为一个模块，通过 require 同步加载模块，exports 导出内容
  - 特点：
    - 所有代码都在模块作用域，不存在全局污染作用域
    - 模块可以多次加载，但只会再第一次加载时运行一次，结果会被缓存，之后加载会读取缓存，想再次运行模块，只有先清除缓存
    - 模块加载的顺序，按照其在代码中出现的顺序
  - 注意：
    - 输入的是被输出值的拷贝，因此模块内部的变化不会影响这个值
- ES6 模块化
  - 定义：通过 import 加载模块，export 导出内容
  - 特点：
    - 输出的是值的引用
    - 编译时输出接口
    - 是动态引用，无缓存
  - 注意：
    - 支持静态化分析，编译时就能确定模块的依赖关系，以及输入输出的变量，而 commonjs 和 AMD 只能在运行时知道
- AMD

  - 定义：异步加载模块，允许指定回调函数，核心是 require.js
  - 特点：
    - 加载更快

- CMD
  - 定义：异步加载模块，核心是 sea.js

### cookie session localStorage sessionStorage 区别

- cookie、session 是参与服务端通信的，localStorage sessionStorage 不参与
  - cookie 用于客户端保持状态，保存在客户端，内存最大为 4K
    - session 用于服务端保持状态，保存在服务端，存储在服务器上
- cookie：
  - 应用场景
    - 用户登录，用户自定义设置，跟踪用户行为
  - 特性：
    - 支持跨域名访问：前端设置 withCredentials 为 true， 后端设置 Header 的方式来让 ajax 自动带上不同源的 cookie
    - 只能保存字符串类型，文本的方式
    - 单个 cookie 内存不能超过 4kb
    - 安全性低
  - 可以设置的字段：
    - name : 字段为一个 cookie 的名称。
    - value : 字段为一个 cookie 的值。
    - domain : 字段为可以访问此 cookie 的域名。
    - path : 字段为可以访问此 cookie 的页面路径
    - expires/Max-Age : 字段为此 cookie 超时时间
    - Size : 字段 此 cookie 大小
    - secure: 字段 设置是否只能通过 https 来传递此条 cookie
- session：
  - 应用场景：
    - 购物车
    - 保存用户登录信息
    - 放入 session 中，不同页面能够共享数据
    - 防止用户非法登录
  - 特点：
    - 内存大小没有限制
    - 不支持跨域名访问
- localStorage:
  - 应用场景：
    - 长期登录
    - 判断用户是否已登陆
  - 特点：
    - 永久保存，无论浏览器关不关，都存在这个数据
    - 在所有同源窗口中都是共享的
    - 大小为 5MB
    - 只能存字符串
- sessionStorage:
  - 应用场景：
    - 敏感账号一次性登录
  - 特点
    - 临时保存，只有当浏览器关闭或者标签关闭，数据才会删除
    - 在不同窗口之间，不共享数据
    - 大小为 5MB
    - 只能存字符串

### CORS

- 简介：CORS 就是跨域资源共享，允许不同源的服务器访问这个网页上的资源。
- 同源策略：浏览器为阻止恶意文件，规定了同源策略，即协议、域名、端口号相同
- 简单请求（不会触发 CORS 预检请求）：
  - 方法类型：get、post、head
  - 人为设置的请求头：Accept、Accept-Language、Content-Language、Content-Type、DPR、Downlink、Save-Data、Viewport-Width、Width
  - Content-Type 的值：text/plain、multipart/form-data、application/x-www-form-urlencoded
  - XMLHttpRequestUpload 对象均没有注册任何事件监听器
  - XMLHttpRequestUpload 对象可以使用 XMLHttpRequest.upload 属性访问
  - 请求中没有使用 ReadableStream 对象。
- 复杂请求（会触发 CORS 预检请求）：除了简单请求之外的

- 实现方案

  - Node
  - 第三方中间件：koa-cors
  - cookie：web 请求设置 withCredentials，Access-Control-Allow-Credentials 为 true，Access-Control-Allow-Origin 为非\*
  -

- 预检请求用的方法是'OPTIONS'，表示这个请求是用来询问的，里面有几个字段
  - Origin：表示请求来自哪个源
  - Access-Control-Request-Method：列出浏览器的 CORS 请求会用到哪些 HTTP 方法
  - Access-Control-Request-Headers：指定浏览器 CORS 请求会额外发送的头信息字段，如 X-Custom-Header

### 跨域

- CORS
- Node 正向代理
  - ````js
      // vue.config.js
        module.exports = {
      devServer: {
        port: 8000,
        proxy: {
          "/api": {
            target: "http://localhost:8080"
          }
        }
      }
    };
        ```
    ````
- Nginx 反向代理
- JSONP
  - 原理：利用了 script 标签没有跨域限制的这个特性来完成的
  - 步骤：
    - 前端定义解析函数（例如 jsonpCallback=function(){....}）
    - 通过 params 形式包装请求参数，并且声明执行函数(例如 cb=jsonpCallback)
    - 后端获取前端声明的执行函数（jsonpCallback），并以带上参数并调用执行函数的方式传递给前端。
- websocket：客户端和服务器之间存在持久的连接，而且双方都可以随时开始发送数据
- window.postMessage
- ducument.domain + Iframe
- window.location.hash + Iframe
- window.name+ Iframe

### 如何检查内存泄露

利用谷歌调试工具：https://www.jianshu.com/p/e8cea7088820

### 常见状态码

- 204：服务器成功处理了请求，但没有返回任何内容
- 301：永久移动。请求的网页已永久移动到新位置
- 302：临时移动。 服务器目前从不同位置的网页响应请求，但请求者应继续使用原有位置来进行以后的请求
- 304：未修改。
- 400：错误请求。服务器不理解请求的语法
- 401：未授权。请求要求身份验证
- 403：禁止。服务器拒绝请求
- 404：未找到。服务器找不到请求的网页

### get post 区别

- 服务器资源：get 不影响服务器资源，post 影响
- 缓存：get 缓存，post 不缓存
- 报文格式：get 报文为空，post 是发送的数据
- 安全性：将请求的参数放入 url 向服务器发送，不安全；post 安全
- 请求长度：get 请求长度受限于 url，post 更长
- 参数类型：post 支持更多

### http2.0

- 采用二进制格式传输数据，而非 http1.1 的文本格式，更利于二进制格式在协议的解析和优化扩展
- 对消息头采用 HPACK 进行压缩传输，能够节省消息头占用的网络的流量
- 多路复用，就是多个请求都是通过一个 TCP 连接并发完成，做到了真正的并发请求，同时，流还支持优先级和流量控制
- 服务端能够更快的把资源推送给客户端

### XSS 和 CSRF 是什么 怎么防御

- XSS：
  - 定义：跨网站脚本攻击，在网上注入恶意的客户端代码，达到获取用户隐私的目的
  - 防御措施：
    - 对用户提交内容进行校验
    - 使用 HttpOnly Cookie：重要的 cookie 标记为 httponly，浏览器向 Web 服务器发起请求的时就会带上 cookie 字段，但是在 js 脚本中却不能访问这个 cookie
- CSRF：
  - 定义：跨站请求伪造，冒充用户在站内的正常操作
  - 防御措施：
    - 验证 HTTP Referer 字段，利用 HTTP 头中的 Referer 判断请求来源是否合法，Referer 记录了该 HTTP 请求的来源地址
    - 在请求地址中添加随机产生的 token 并验证
    - 在 HTTP 头中自定义属性并验证

### 进程和线程的区别

- 进程是资源分配的最小单位，线程是资源调度的最小单位
- 线程是在进程下运行的。一个进程可以包含多个线程。
- 进程有自己的独立地址空间，每启动一个进程，系统就会为它分配地址空间。而线程是共享进程中的数据的，使用相同的地址空间。
- 同一进程下不同线程间数据容易共享，不同进程间数据很难共享。

### 进程通信方式有哪些

- 管道（效率最差）
- 消息队列（效率低下）
- 共享内存：共享内存解决了消息队列存在的内核态和用户态之间数据拷贝的问题
- 信号量：本质上是一个整型的计数器，用于实现进程间的互斥和同步
- 信号
- Socket：不仅可以跨网络和不同主机进行进程间通信，还可以在同一主机进行进程间通信

### node require 的实现原理

将要加载的代码内容先拷贝到当前代码中，只不过用一个函数将代码内容包裹住，然后通过 eval 函数执行包裹函数，包裹函数传入的参数是 module, module.exports，这两个对象恰好就是加载模块用于导出内容的对象，当 eval 执行后，加载模块要导出的内容就已经存储在 module 和 module.exports 中，可以直接使用了

- 注意：require 采用了缓存功能，如果给定模块已经加载过了它就直接返回，这意味着无论模块在代码中被加载多少次，它实际上只加载了一次

### node 事件循环与浏览器的哪些不一样

宏任务：

1. timers 定时器检测阶段：在这个阶段执行 timer 的回调，即 setTimeout、setInterval 里面的回调函数
2. I/O 事件回调阶段(I/O callbacks)：此阶段会执行几乎所有的回调函数，除了 close callbacks（关闭回调）和那些由 timers 与 setImmediate()调度的回调
3. 限制阶段(idel，prepare)：仅系统内部使用
4. 轮询阶段(poll)：检索新的 I/O 事件、执行与 I/O 相关的回调，其余情况 nide 将在适当的时候在此堵塞
5. 检查阶段(check)：setImmediate()回调函数在这里执行
6. 关闭事件回调阶段(close callback)：一些关闭的回调函数
   注意：每个阶段结束都会执行微任务。
   其余都一样

### MVVM、MVC、MVP 分别用于什么场景，区别是什么

- MVC（Model-View-Controller）：
  - 组成：
    - 视图：渲染 HTML，UI 交互
    - 控制器：业务逻辑，调度数据和数据模型
    - 数据模型：数据保存，更新之类
  - 流程：
    - 通过 View 接受指令，传给 Controller，对 Model 进行修改，最后渲染视图
    - 传给 Controller 指令，去修改 Model，最后渲染视图
  - 使用场景：
    - 适合大规模的项目
- MVP（Model-View-Presenter）：
  - 组成：
    - 视图层：渲染 HTML
    - 管理层：业务逻辑，调度数据和数据模型
    - 数据模型层：数据保存
  - 流程：
    - 视图层、管理层、数据模型层之间双向通信，但视图层与数据模型层不直接通信
    - 管理层根据视图层触发的事件来更新数据，分别返还给 Model 层和 View 层
  - 使用场景：
    - 可应用与 Android 开发
- MVVM（Model-View-ModelView）与 MVP 基本一致
  - 区别：View 与 ViewModel 实现了双向绑定，View 层变动自动反映在 ViewModel 层，反之亦然

### 发布-订阅模式

```js
var _Event = (function () {
  var clienlist = {},
    addlisten,
    trigger,
    remove;
  // 增加订阅者
  addlisten = function (key, fn) {
    if (!clienlist[key]) {
      clienlist[key] = [];
    }
    clienlist[key].push(fn);
  };
  // 发布消息
  trigger = function () {
    var key = [].shift(arguments), // 消息类型
      fns = clienlist[key]; // 取出该类型的对应的消息集合
    if (!fns || fns.length === 0) return false;
    for (let i = 0, fn; (fn = fns[i++]); ) {
      fn.apply(this, arguments);
    }
  };
  // 删除订阅
  remove = function (key, fn) {
    var fns = clienlist[key];
    if (!fns) return false;
    if (!fn) fns && fns.length === 0; // 没有传入具体函数，则取消该类型的所有订阅
    if (fn) {
      for (let i = 0; i < fns.length; i++) {
        if (fn === fns[i]) {
          fns.splice(i, 1);
        }
      }
    }
  };
})();
```

### 实现括号有效

```js
const str = '[]{}()';
const isValid = (str = '') => {
  const map = new Map();
  map.set('(', ')');
  map.set('[', ']');
  map.set('{', '}');
  const b = [];
  for (let i = 0; i < str.length; i++) {
    if (map.has(str[i])) {
      b.push(str[i]);
    } else {
      let pop = b.pop();
      if (map.get(pop) !== str[i]) return false;
    }
  }
  return b.length === 0;
};
```

### 柯里化函数

```js
const curry = (fn, ...args) =>
  // 函数的参数个数可以直接通过函数数的.length属性来访问
  args.length >= fn.length // 这个判断很关键！！！
    ? // 传入的参数大于等于原始函数fn的参数个数，则直接执行该函数
      fn(...args)
    : /**
       * 传入的参数小于原始函数fn的参数个数时
       * 则继续对当前函数进行柯里化，返回一个接受所有参数（当前参数和剩余参数） 的函数
       */
      (..._args) => curry(fn, ...args, ..._args);

function add1(x, y, z) {
  return x + y + z;
}
const add = curry(add1);
console.log(add(1, 2, 3));
console.log(add(1)(2)(3));
console.log(add(1, 2)(3));
console.log(add(1)(2, 3));
```

### 防抖

```js
function debounce(fn, delay) {
  let timer = null;
  return function () {
    if (timer) {
      clearTimeout(timer);
    }
    timer = setTimeout(() => {
      fn();
    }, delay);
  };
}
```

```js
function throttle(fn, delay) {
  let timer;
  return function () {
    let args = arguments;
    if (!timer) {
      timer = setTimeout(() => {
        fn.apply(this, args);
      }, delay);
    }
  };
}
```

## webpack

### tree-shaking

- 定义：是一种删除不需要的额外代码的优化方式

- 原理：
  - 根据 ES6 Module 静态分析，判断编译的时候加载了哪些模块
  - 判断哪些模块和变量未使用，进而删除
