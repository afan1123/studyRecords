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

### babel 是什么，怎么做到的

- 作用：帮助浏览器解决 js 兼容问题的技术
- 工作机制：
  - 语法检查
    - 会按照自己 babel 的版本和配置对代码进行解析
    - 有不支持的语法，会报错
  - 语法转译
    - 按照你配置的目标环境，将语法转换降级到目标环境可以解析的语法
  - polyfill 导入
    - 用来解决浏览器各种新方法、对象的兼容，如 Array.from，Promise 等等(现在用 core.js)
- 注意：
  - 主要依靠的是 AST 语法树，会按照你的配置，遍历相关节点，语法检查就是在 AST 语法树做的；polyfill 阶段是找出不支持的方法和 API，将其对应的 polyfill 模块进行导入

### webpack 工作流程

#### 初始化阶段

- 初始化参数：配置文件、配置对象与默认参数进行合并
- 创建编译对象：用上一步得到的参数创建 Compiler 对象
- 初始化编译环境：注入内置插件，加载配置的插件

#### 构建阶段

- 开始编译：执行 Compiler 对象的 run 方法，创建 Compilation 对象。
- 确认编译入口：进入 entryOption 阶段，读取配置的 Entries，递归遍历所有的入
  口文件，调用 Compilation.addEntry 将入口文件转换为 Dependency 对象
- 编译模块：调用 normalModule 中的 build 开启构建，从 entry 文件
  开始，调用 loader 对模块进行转译处理，然后调用 JS 解释器（acorn）将内容转 化为 AST 对象，然后递归分析依赖，依次处理全部文件。
- 完成模块编译：在上一步处理好所有模块后，得到模块编译产物和依赖关系图

#### 生成阶段

- 输出资源：根据入口和模块之间的依赖关系，组装成多个包含多个模块的
  Chunk，再把每个 Chunk 转换成一个 Asset 加入到输出列表，这步是可以修改输 出内容的最后机会。
  写入文件系统（emitAssets） ：确定好输出内容后，根据配置的 output 将内容写
  入文件系统。

### webpack 热更新机制原理

- 定义：不需要刷新整个页面，只要更新页面的局部完成更新
- 实现原理：
  - 启动 webpack，生成 compiler 实例，compiler 实例的功能很多，比如用来启动 webpack 的编译工作，监听文件变化等。
  - 使用 Express 启动一个本地服务，使得浏览器可以访问本地服务
  - 启动 websocket 服务，用于浏览器和本地 node 服务进行通讯。

### 谈下 webpack loader 机制

- 作用：loader 可以使你在 import 或加载模块时预处理文件，用于对模块的源代码进行转换
- 机制
  - 输入就是加载到的资源文件内容，输出就是我们加工后的结果

### webpack loader 和 plugin 有什么区别

|        | 功能                  | 运行时机     |
| ------ | --------------------- | ------------ |
| loader | 将其他格式文件转为 js | 打包文件之前 |
| plugin | 功能更丰富            | 整个编译周期 |

### uglify 原理

- 简单来说
  - 将 code 转换成 AST
  - 将 AST 进行优化，生成一个更小的 AST
  - 将新生成的 AST 再转化成 code
- 压缩规则：
  - 移除注释
  - 移除额外的空格
  - 细微优化
  - 表达式语句合并
  - 标识符替换（函数名和变量名）

### babel 原理

- 步骤：
  - 解析阶段：将代码解析成 AST（词法分析和语法分析阶段）
  - 转换阶段：AST 变换的操作，babel 接收得到的 AST 并通过 babel-traverse 对其进行遍历，进行增删改查等操作
  - 生成阶段：用 babel-generator 将变换后的 AST 再转成 JS 代码

### webpack 插件机制

### webpack loader 机制

### 前端微服务

## CSS

### 重排和重绘是什么，有什么区别

- 重排：
  - 定义：改变页面布局
  - 操作：
    - DOM 几何属性变化
    - DOM 树的结构变化
    - 改变元素的一些样式
- 重绘：

  - 定义：改变元素外观的行为
  - 操作：
    - background 之类的

- 规避措施：
  - 将多次改变样式属性的操作，合成一次操作
  - 将需要多次重排的元素脱离文档流
  - 内存中多次操作节点，再添加到文档中去，fregment 标签
  - 在需要经常获取那些引起浏览器重排的属性值时，要缓存到变量

### 重排和重绘是什么，有什么区别

- 重排：
  - 定义：改变页面布局
  - 操作：
    - DOM 几何属性变化
    - DOM 树的结构变化
    - 改变元素的一些样式
- 重绘：

  - 定义：改变元素外观的行为
  - 操作：
    - background 之类的

- 规避措施：
  - 将多次改变样式属性的操作，合成一次操作
  - 将需要多次重排的元素脱离文档流
  - 内存中多次操作节点，再添加到文档中去，fragment 标签
  - 在需要经常获取那些引起浏览器重排的属性值时，要缓存到变量

### 盒子模型

- 标准盒子模型：width/height= margin + content；box-sizing：content-box
- IE 盒子模型：width/height=padding + border + margin + content；box-sizing：border-box

### CSS 选择器有哪些

- 元素选择器
- id 选择器
- class 选择器
- 通配选择器
- 子元素选择其
- 伪类选择器
- 属性选择器
- 兄弟选择器

### 伪类和伪元素区别

- 伪类：根据用户行为而动态变化的对应样式，如：:hover，:focus，:checked
- 为元素：用于创建一些不在 DOM 树中的元素，并为其添加样式，如：::before

### css 优先级是怎么计算的

- !important>内联样式>id 选择器>类选择器>属性选择器>类选择器>伪类选择器>标签选择器>伪元素选择器>相邻兄弟选择器>子选择器>后代选择器>通配符选择器
- 规则：
  - id 选择器：0100
  - 类选择器，属性选择器，伪类：0010
  - 元素，为元素：0001
  - 通配选择器：0000
  - !important，行内样式：1000

### scss 和 less 与 css 的区别

- less 和 scss 都是 css 预处理语言
- less 变量符是@，scss 变量符是$
- scss 支持条件语句，less 不支持
- scss 有输出设置，less 没有

### 什么是 BFC，BFC 有什么作用，如何形成 BFC

- 定义：块级格式化上下文，是一个独立的渲染区域，里面元素不会影响页面布局，可以理解成一个独立的容器
- 作用
  - 防止外边距重叠
  - 清除浮动影响：子元素设置 float 之后成为 bfc，父容器也需要设置成 bfc
  - 防止文字缠绕
- 创建方式：
  - float 不为 none
  - position 不为 static 和 relative
  - overflow 不为 visible
  - display 为 inline-block，table ，table-caption, flex, inline-flex

### position 有哪些值，作用分别是什么

- absolute：绝对定位，需要一个 static 定位之外的元素进行定位
- relative：相对定位，相对于原来的位置进行定位
- fixed：绝对定位，相对于屏幕视口进行定位
- static：默认，没有定位
- inherit：规定从父元素继承 position 属性的值

### flex 布局有什么好处

- 方便，好上手
- 快速等分
- 上下居中

### flex:1 是什么组成的

- flex-grow：定义项目的放大比例，默认为 0，即如果存在剩余空间，也不放大
- flex-shrink：定义了项目的缩小比例，默认为 1，即如果空间不足，该项目将缩小。
- flex-basic：定义了在分配多余空间之前，项目占据的主轴空间。浏览器根据这个属性，计算主轴是否有多余空间。它的默认值为 auto，即项目的本来大小

### css 三角形和省略号

- 三角形：只需要 div 四个 border 很宽或者宽高为 0，且一个有颜色另外三个没颜色
- 省略号：{white-space:nowrap;overflow:hidden;text-overflow:ellipsis;}

### 怎么在浏览器可视区域画一个最大的正方形

- {width:30%;height:30vw;}
- {width:30%;height:0;padding-bottom:30%}

### css3 新特性

- 圆角 border-radius
- 阴影 box-shadow
- 阴影 text-shadow
- 转换 transform
  - 移动 translate
  - 旋转 rotate
  - 缩放 scale
  - 倾斜 skew
  - 3D 转换 translate3d
- 动画 animation
- 过度 transition
- 媒体查询

### 浮动元素会造成什么影响，如何清除浮动

- 影响：
  - 会漂浮到父容器之上，脱离文档流
  - 会一行显示，多个则显示多行
  - 会具有行内块级元素特性
- 清除浮动：
  - 父级元素添加 overflow
  - 父级元素添加 after 伪元素（content：'';clear：both）

### 行内元素、块级元素有哪些，区别是什么

- 块级元素：div，form，h1，hr，ul 等等

- 行内元素：span，a，br，img 等等

- 区别：
  - 行内元素不能设置宽高，margin，padding 左右有效，上下无效，不自动换行
  - 块级元素以上都行

### rem 与 em 的区别 vw、vh 是什么

- em：相对于根元素

- rem：相对于根元素
-
- vw/vh：相对视图窗口的尺寸（100vw：视图窗口的宽度）

### link 与@import 区别与选择

- @import：在页面加载完后再加载样式，不支持 DOM 修改，可以在 CSS 中调用样式表，进行 CSS 的模块化管理

- link：和页面同时加载样式，并支持 DOM 修改样式

### CSS 相关的性能优化

- 加载性能：

  - css 压缩
  - css 的样式单一化：当需要上外边距和左外边距时，写成：margin-top：10px；margin-left：10px；更好
  - 减少使用@import，建议使用 link

- 选择器性能：

  - 尽量避免使用通配符选择器
  - 多使用 class 类选择器
  - 少用后代选择器
  - 了解继承的样式，避免重复制定规则

- 渲染性能：

  - 慎重使用高性能属性：定位，浮动
  - 减少页面的重绘、回流
  - 去除空规则：{}，能够减小文件体积
  - 属性值为 0，不加单位
  - 属性值为浮动小数时（0.111），可以省略小数点之前的 0
  - 标准化各种浏览器前缀：带浏览器前缀的在前。标准属性在后
  - 不使用@import 前缀，它会影响 css 的加载速度
  - 选择器优化嵌套，避免嵌套过深
  - 不滥用 web fonts，会阻塞页面渲染，损伤性能

- 可维护性，健壮性：
  - 将具有相同属性的样式抽离出来，整合并通过 class 在页面中进行使用，提高 css 的可维护性。
  - 样式与内容分离：将 css 代码定义到外部 css 中。

### 渲染合成层是什么

### css3 怎么开启硬件加速(GPU 加速)

- 原因：Chrome 的内核 webkit，Chrome 下的动画比 IE9 和 FF 都要慢很多，所以要开启硬件加速，提升动画的流畅性
- 方式：只要使用特定的 CSS 语句就可以开启硬件加速
  - -webkit-transform:
  - -webkit-backface-visibility
  - -webkit-perspective

### 让浏览器立即进行渲染更新的方法

- 让浏览器更新页面的方法：
  - window.reload()
  - window.goback(-1)

### RAF 和 RIC 是什么

- RAF（requestAnimationFrame）：
  - 目的：为了实现更流畅和性能更好的动画
  - 原理：告诉浏览器，执行一个动画，并且在下一次重绘之前执行指定的回调函数更新动画
  - 注意
    - 事件循环：1 个宏任务-->所有微任务-->是否需要渲染-->渲染 UI
    - requestAnimationFrame 其实就是在 ui 渲染中执行得
    - 执行次数与浏览器刷新次数匹配，一般 1 秒 60 次
  - 优点
    - dom 操作与浏览器刷新频率保持一致，保障动画流畅
    - 在隐藏或不可见元素中，requestAnimationFrame 将不进行重绘回流，节省 cpu，gpu
    - 页面不是激活状态，动画会自动暂停，节省 CPU 开销
- RIC（requestIdleCallback）：
  - 目的：为了在渲染空闲时间执行优先级不高的操作，以避免阻塞渲染。
  - 原理：将在浏览器空闲时间段调用函数排队

### 图片的预加载和懒加载

- 预加载：
  - 定义：提前加载图片资源，加载后缓存到本地，需要就立马显示
  - 场景：
    - 连翻漫画
  - 实现：
    - 将需要预加载的图片 URL 保存到数组，用到时，指定图片的 URL
- 懒加载：
  - 定义：用户需要看到时，才进行加载
  - 场景：
    - 电商的分页
    - 图片画廊
  - 实现：
    - 检查图片是否显示（看看是否在可视区域），在进行加载

## 性能

### 前端性能优化指标 RAIL

- 定义：R 为 response 响应 A 为 animation 动画 I 为 Idle 空闲 L 为 load 加载
  - R：处理时间 50ms 以内，超过 50ms 为长任务
  - A：1/60fps
  - I：尽可能的增加空闲时间，来响应用户的操作（计算相关让后端完成）
  - L：5s 内完成所有内容加载并且可以交互

### 前端性能优化手段

- webpack 优化
- 图片加载
- 重绘回流
- 防抖节流

### 重排和重绘（同上）

### 白屏优化

- 原因：浏览器发送请求时，需要将用户输入的域名地址转换为 IP 地址，这个时间太长就会出现白屏
- 解决方案：
  - DNS 查询优化：<meta http-quiv='x-dns-prefetch-control' content='on'><link ref='dns-prefetch' href='http://www.baidu.com'>
  - 使用骨架屏

### 大量图片加载优化

- 使用图片服务器，否则浏览器会因为高 I/O 负载而崩溃
- 项目中使用图片压缩再上传
- 图片懒加载，当可视区域需要图片时，再加载
- 使用雪碧图、字体图标、base64 来有效减少连接数
- http2 解决了连接数限制。每个请求为一个流，每个请求被分为多个二进制帧，不同流可以交错发送，实现多路复用。

### 图片过大优化

- link 的 perload 属性。 <link rel='preload' href='./img/01.png' as='image'>
- 图片拆分。
- 图片的 onload 事件。先选一张默认图进行展示，当图片触发 onlad 事件即完成加载后，替换图片。
- 转 base64

### 动画性能

- 背景：浏览器的渲染进程是多线程的，主要有两个线程：GUI 线程和 js 线程
- GUI 线程：

  - 负责解析 HTML,CSS,合成 DOM 树，Render 树，布局和绘制等
  - 当界面重绘回流时，该线程就会执行
  - 与 JS 线程执行时，GUI 线程会阻塞，等到 JS 执行完后再执行该线程

- 合格的动画：每秒 30-60 帧的动画会让人感到流畅
- 渲染过程：
  - 解析 html，形成 DOM 树
  - 解析 CSS，形成 CSSOM 树
  - 合成 Render 树
  - 布局 Render 树，负责元素的位置，大小等计算（回流发生阶段）
  - 绘制 Render 树，负责页面像素信息（重绘发生阶段）
  - 将各层信息发送给 GPU（GPU 进程），GPU 将各层信息显示在屏幕上
- GPU 做的事：

  - 绘制位图到屏幕上
  - 可不断的绘制相同的位图
  - 将同一位图进行位移、旋转和缩放

- GPU 与 CPU 的渲染区别：
  - GPU：更适合 3D 渲染，因为对图形计算和并行处理进行了优化，且渲染任务容易并行操作，还有上千个内核。
  - CPU：串行操作，只有 64 个内核
- 渲染层：当 DOM 树中的节点都会对应一个渲染对象，当渲染对象处于同一个 Z 轴坐标时，就会形成 RenderLayer（渲染层），以保证正确的顺序堆叠。
- 图形层：生成一个最终呈现内容图形的层模型，有一个图形上下文，负责输出该层的位图。存储在共享内存的位图将交给 GPU 进行合成，最后显示到屏幕上
- 合成层：满足特殊条件的渲染层，称之为合成层。拥有单独的图形层。
  - 特殊条件：
    - 3Dtransforms
    - video，canvas，iframe 等
    - CSS 动画实现的 opacity 动画转换
    - position:fixed
    - 具有 will-change 的属性
    - 对 opacity、transform、fliter、backdropfilter 应用了 animation 或者 transition
- 将渲染层提升为合成层的方式：
  - 进行 3D 或者透明转换的 CSS 属性
  - 具有 3d（WebGL）上下文或者硬件加速的 2d 上下文的元素
  - 组合型插件（flash）
  - CSS3 的转换或者动画属性
  - 使用了硬件加速的 CSS filters 技术
- 提升为合成层的优势：
  - 合成层的位图，会交给 GPU 处理，比 CPU 快
  - 当需要重绘时，只需要重绘本身层，不影响其他层
  - 对于 transform 和 opacity 效果，不会触发 layout 和 paint

## Vue

### vue 父子组件传值有哪些方法

- props/emit
- provide/inject
- ref/$refs
- $parent/$children

### vue 开发中常用的指令有哪些

- v-once：只执行一次渲染，当数据变化时，不会再改变
- v-cloak：防止页面加载时出现 vuejs 的变量名
- v-show：相当于 display
- v-if，v-else，v-ele-if：生成 VNode 时，会忽略这个节点
- v-html：往节点上添加 innerHTML 属性
- v-for：循环
- v-bind：将后面的属性解析成 js，缩写（：），语法：v-bind:<属性>="<值>"
- v-on：事件绑定，写法：v-on:<事件类型>="<函数名>"
- v-model：双向绑定
  - 原生文本框：<input type='text/textarea' v-bind:value='val' v-on:input='val=$event.target.value' />
  - 原生单选/复选框：<input type='radio/checkbox' v-bind:checked='val' v-on:change='val=$event.target.value' />
  - 原生选择框：<input type='select' v-bind:value='val' v-on:change='val=$event.target.value' />

### vue 的组件加载和渲染顺序

- 挂载顺序：父 beforeCreate => 父 created => 父 beforeMount => 子 beforeCreate => 子 created => 子 beforeMount => 子 mounted => 父 mounted
- 更新顺序：父 beforeUpdate => 子 beforeUpdate => 子 updated => 父 updated
- 销毁顺序：父 beforeDestroy -> 子 beforeDestroy -> 子 destroyed -> 父 destroyed

### vue 的数据绑定机制是如何实现的

- 核心：Object.defineProperty(obj, prop, descriptor)
- ```js
  // 简单实现
  var obj = {};
  var val = 'jack';
  Object.defineProperty(obj, 'val', {
    get: function () {
      return val;
    },
    set: function (newVal) {
      val = newVal;
    },
  });
  ```

- 思路：vue 双向数据绑定是通过 数据劫持 结合 发布订阅模式的方式来实现的
  1. 将 vue 中的 data 中的内容绑定到输入文本框和文本节点中
  2. 当文本框的内容改变时，vue 实例中的 data 也同时发生改变
  3. 当 data 中的内容发生改变时，输入框及文本节点的内容也发生变化

#### 第一步：data 绑定输入框与文本内容

使用 DocumentFragment 来劫持子节点，这样可以只回流一次。遍历每个节点，看是对否有 v-model 属性或者{{}}这个符号，如果有且有修改，则替换为 data 中的内容。

#### 第二部：视图中的输入框导致数据模型更改

```js
// 1. 实现响应式监听属性的函数
function defineReactive(obj, key, val) {
  Object.defineProperty(obj, key, {
    get() {
      return val;
    },
    set(newVal) {
      if (newVal === val) {
        return;
      }
      val = newVal;
    },
  });
}
// 2. 实现观察者，对每一个实例属性都监听
function observe(obj, vm) {
  for (let key of Object.keys(obj)) {
    defineReactive(vm, key, obj[key]);
  }
}
// 3. 实现编译函数compile，即视图中的输入框与文本节点与数据绑定
// 4. Vue的构造函数
function Vue(options) {
  this.data = options.data;
  var data = this.data;
  observe(data, this);
  var id = options.id;
  // 编译HTML：利用碎片文档将多次操作合并为一次，最后一次性添加到里面
  var dom = nodeToFragment(document.getElementById(id), this);
  document.getElementById(id).appendChild(id);
}
```

#### 第三步：data 数据变动导致输入框和文本节点变动

1. 在 observe（监听数据）中为每个属性添加 dep
2. 在 nodeToFragment（HTML 编译）中，给每个数据绑定的相关节点生成一个订阅者 watcher，watcher 会将自己添加到 dep 中
3. 当属性的改变时，就会触发 set 事件，里面触发 dep.notify()也就是 watcher 的 update()方法，从而更新视图

```js
// 订阅者
function Watcher(vm, node, name) {
  Dep.target = this;
  this.vm = vm;
  this.name = name;
  this.update();
  Dep.target = null; // 全局变量，使用完必须清空，保证唯一性
}
Watcher.prototype = {
  update() {
    this.get();
    this.node.nodeValue = this.value;
  },
  get() {
    this.value = this.vm[this.name]; // 触发相应的get，get中将相应的watcher加入到对应的dep中
  },
};
// defineReactive改写
function defineReactive(obj, key, val) {
  var dep = new Dep();
  Object.defineProperty(obj, key, {
    get() {
      if (Dep.target) {
        dep.addSub(Dep.target);
      }
      return val;
    },
    set(newVal) {
      if (newVal === val) {
        return;
      }
      val = newVal;
      // 通知
      dep.notify();
    },
  });
}
function Dep() {
  this.subs = [];
}
Dep.prototype = {
  addSub() {
    this.subs.push(sub);
  },
  notify() {
    this.subs.forEach((sub) => {
      sub.update();
    });
  },
};
```

### vue 的 computed 和 watch 的区别

|          | computed       | watch                              |
| -------- | -------------- | ---------------------------------- |
| 定义     | 计算属性       | 监听数据变化                       |
| 缓存     | 支持缓存       | 不支持缓存                         |
| 异步     | 不支持异步     | 支持异步                           |
| 首次监听 | 首次监听       | 默认首次不监听                     |
| 使用场景 | 同步、加工属性 | 高性能消耗、异步操作、数据变化响应 |

### 说下 vue 的 keep alive

- 定义：是 Vue 的内置组件，当它包裹动态组件时，会缓存不活动的组件实例在内存中，防止重复渲染 DOM，而不是销毁它们。
- 原理：在 created 函数调用时将需要缓存的 VNode 节点保存在 this.cache 中／在 render（页面渲染） 时，如果 VNode 的 name 符合缓存条件（可以用 include 以及 exclude 控制），则会从 this.cache 中取出之前缓存的 VNode 实例进行渲染。
- 属性：
  - include：相关名称会被缓存
  - exclude：相关名称会不被缓存
  - max：最多缓存多少组
- 生命周期：
  - actived：在 keep-alive 组件激活时调用/在组件第一次渲染时也会被调用，  该钩子函数在服务器端渲染期间不被调用。
  - deactived：在 keep-alive 组件停用时调用，  该钩子函数在服务器端渲染期间不被调用。
- 生命周期顺序：钩子的触发顺序 created -> mounted -> activated，退出时触发 deactivated。
  当再次进入（前进或者后退）时，只触发 activated。
- 何时生效：activated 中执行才会生效

### v-model 的原理（同上）

### vue next tick 实现原理

- 定义：在 DOM 更新完毕之后执行一个回调
- 原理：
  - vue 用异步队列的方式来控制 DOM 更新和 nextTick 回调先后执行
  - 微任务因为其高优先级特性，能确保队列中的微任务在一次事件循环前被执行完毕
  - 因为浏览器和移动端兼容问题，vue 不得不做了 microtask 向 macrotask 的兼容(降级)方案
    - 降级方案
      - 先判断 Promise
      - 再判断 MutationObserver
      - 再判断 setImmediate
      - 最后判断 setTimeout

### vue diff 算法原理

- 背景：进行虚拟节点对比，并返回一个 patch 对象，用来存储两个节点不同的地方，最后用 patch 记录的消息去局部更新 Dom。
- 步骤：

1. 首先，对比节点本身，判断是否为同一节点，如果不为相同节点，则删除该节点重新创建节点进行替换
2. 如果为相同节点，进行 patchVnode，判断如何对该节点的子节点进行处理，先判断一方有子节点一方没有子节点的情况(如果新的 children 没有子节点，将旧的子节点移除)
3. 比较如果都有子节点，则进行 updateChildren，判断如何对这些新老节点的子节点进行操作（diff 核心）。
4. 匹配时，找到相同的子节点，递归比较子节点

注意：在 diff 中，只对同层的子节点进行比较，放弃跨级的节点比较，使得时间复杂从 O(n3)降低值 O(n)，也就是说，只有当新旧 children 都为多个子节点时才需要用核心的 Diff 算法进行同层级比较。

### vue mixin 解决什么问题 原理 缺点
