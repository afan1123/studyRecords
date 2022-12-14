## 手写数组的方法

### Array.isArray

- 基本使用：判断一个值是否是数组类型

```js
const arr = [1, 2, 3];
const proxy = new Proxy(arr, {});
console.log(proxy.__proto__ === Array.prototype); // true
console.log(proxy instanceof Array); // true
console.log(Object.prototype.toSrting.call(Proxy)); // [object Function]
console.log(Proxy.prototype); // undefined
console.log(proxy instanceof Proxy); // 报错，没有原型
```

- 实现

```js
Array.isArray = function (obj) {
  if (typeof obj !== 'obj' || obj === null) {
    return false;
  }
  return obj instanceof Array;
};
```

### Array.prototype.entries

- 定义：返回一个新的 Array Iteator 对象，该对象包含数组中每个索引的键值对
- 举例

```js
const arr = ['', undefined, null, {}];
console.log(arr.entries()); // Object [Array Iterator] {}
// next访问
const iter = arr.entries();
console.log(iter.next()); // {value: [0, ''], done:false}

// for of 迭代
for (let [k, v] of arr.entries()) {
  console.log(k, v); // 0 ''  1 undefined   2 null   3 {}
}
```

- next 实现

```js
// 未优化：
Array.prototype.entries = function () {
  const O = Object(this);
  let index = 0;
  const length = O.length;
  function next() {
      if (index < length) {
        return { value: [index, O[index++]], done: false };
      }
      return { value: undefined, done: true };
    },
  return {
  next,
    [Symbol.iterator](){
    return next
    }
  };
};
// 优化后：
Array.prototype[Symbol.iterator]=function(){
  const O = Object(this);
  let index = 0;
  const length = O.length;
  function next() {
      if (index < length) {
        return { value: [index, O[index++]], done: false };
      }
      return { value: undefined, done: true };
    },
  return {
    next,
  };
}


Array.prototype.entries = function () {
  const O = Object(this);
  const length = O.length;
  var entries = [];
  for (var i = 0; i < length; i++) {
    entries.push([i, O[i]]);
  }
  const itr = this[Symbol.iterator].bind(entries)();
  return {
    next: itr.next,
    [Symbol.iterator]() {
      return itr;
    },
  };
};

```

- 考察点：
  - 迭代器本质和实现
  - ES6 Symbol 符号
  - 逻辑复用

### Array.prototype.includes

- 实现

```js
Number.isNaN = function (num) {
  if (typeof num === 'number') {
    return isNaN(num);
  }
  return false;
};
Array.prototype.includes = function (item, fromIndex) {
  // call、apply调用，严格模式
  if (this == null) {
    throw new Error('无效的this!');
  }
  var O = Object(this);
  var len = O.length >> 0;
  if (length < 0) return false;

  const isNaN = Number.isNaN(item);
  for (let i = 0; i < len; i++) {
    if (O[i] === item) {
      return true;
    } else if (isNaN && Number.isNaN(O[i])) {
      return true;
    }
  }
  return false;
};
```

### Array.from

- 三个参数 Array.from(arrayLike,mapFn,thisArg)
  - arrayLike：类数组对象或者可遍历对象(Map,Set 等)
  - mapFn：可选参数，在最后生成数组后执行一次 map 方法后返回
  - thisArg；可选参数，实际是 Array.from(obj).map(mapFn，this.Arg)
- 实现

```js
function isCallable(fn) {
  return (
    typeof fn === 'function' ||
    Object.prototype.toString.call(fn) === '[object Function]'
  );
}
Array.from = function (arrayLike, mapFn, thisArg) {
  const C = this;
  // 判断对象是否为null
  if (arrayLike == null) {
    throw new Error('对象为空');
  }
  // 判断mapFn是否为函数
  if (typeof mapFn !== 'function' && typeof mapFn !== 'undefined') {
    throw new Error('mapFn不是方法');
  }
  const items = Object(arrayLike);
  const len = items.length >> 0;
  if (len <= 0) return [];
  const A = isCallable(C) ? Object(new C(len)) : new Array(len);
  for (let i = 0; i < len; i++) {
    var value = items[i];
    if (mapFn) {
      A[i] =
        typeof thisArg === 'undefined'
          ? mapFn(value, i)
          : mapFn.call(thisArg, value, i);
    } else {
      A[i] = value;
    }
  }
  return A;
};
```

- 观察点
  - 类数组的特征
  - length 为字符串的处理（2 的 32 次方-1）
  - from 函数本身 this 也是可以被改写的

### Array.prototype.flat

- 定义：指定的深度递归遍历数组，并将所有元素与遍历到的子数组中的元素合并为一个新数组返回

- 实现：

```js
// 网络版：
const arr = [1, [1, , ,]];
// reduce遇到空位会跳过
const flat = (arr) => {
  return arr.preduce((pre, cur) => {
    return pre.concat(Array.isArray(cur) ? flat(cur) : cur);
  }, []);
};
console.log(flat(arr)); // [1,1]

// 靠谱版：
function has(obj, key) {
  return Object.hasOwn(obj, key);
}
Array.prototype.flat = function (deep) {
  var O = Object(this);
  var sourceLen = O.length;
  var depthNum = 1;
  if (deep !== 'undefined') {
    depthNum = deep;
  }
  if (depthNum <= 0) {
    return O;
  }
  var arr = [];
  var val;
  for (let i = 0; i < sourceLen; i++) {
    if (has.call(O, i)) {
      val = O[i];
      if (Array.isArray(val)) {
        Array.prototype.push.apply(arr, val.flat(depthNum - 1));
      } else {
        arr.push(val);
      }
    } else {
      arr.push(undefined);
    }
  }
};
```

## 数据合并

- 双层 for 循环 + key
- 单层 for 循环 + map + key
- 求助开源

## IIFE，闭包，作用域等等概念

## 执行上下文

- 定义：JS 代码被解析和执行时的环境（程序角度）
- 环境分类
  - this
  - 变量环境
    - var
  - 词法环境
    - let
    - const
  - 外部环境
- 上下文分类
  - 全局上下文
  - 函数执行上下文
  - eval 函数执行上下文

### 执行栈/调用栈

- 定义：是一个拥有数据结构的栈，被用来存储代码运行时创建的所有执行上下文。

### 作用域

- 定义：一个独立的区域。主要用途就是隔离变量。
- 分类：
  - 全局作用域：window/global
  - 函数作用域：函数
  - 块级作用域：{}包裹的代码块

### 作用域链

- 定义：作用域根据代码层次分层，以便于作用域可以访问父作用域，而不能从父作用域引用子作用域中的变量和引用。

### 执行上下文和作用域的区别

- 创建时间：
  - 作用域：函数创建时已确定
  - 上下文：运行时创建
- 运行机制：
  - 作用域：静态（代码分析阶段就确定了）
  - 上下文：动态（边执行边变化）

### 变量提升

- 定义：能够访问后声明的变量。

```js
console.log(name); // undefined
var name = 'jack';
console.log(name); // 'jack'
```

### 暂时性死区

- 定义：let 和 const 显示赋值之前，不能读写变量，否则报错。

### 闭包

- 定义：内部函数能够访问上层作用域的变量对象。

### IIFE

- 定义：立即执行函数表达式。

```js
(function (num1, num2) {
  console.log(num1 + num2);
})(1, 2);
```

## name,length,caller 等重要属性

### Function.name

- 使用场景：查看日志、性能优化、错误排查等需要精确到函数的地方

```js
function sum(num1, num2) {
  return num1 + num2;
}
console.log(sum.name); // 'sum'
```

- 分类
  - 函数声明：函数名
  - 匿名函数：空字符串
  - 动态赋值：属性名
  - new Function：'anonymous'
  - bind 改变 this：bound + 函数名

## this 解析

- 定义：执行上下文（global，function，eval）的一个属性
- 在非严格模式下，总是指向一个对象。
- 严格模式下，可以是任意值。

### this 绑定规则

- 规则列表：

  - 默认绑定
  - 隐式绑定
  - 显示绑定
  - new
  - 箭头函数

#### 默认绑定

- 非严格模式
  - 浏览器：this 指向 window
  - nodejs：this 指向 global 对象
- 严格模式
  - 浏览器：undefined
  - nodejs：undefined

#### 隐式绑定

- 作为某个对象属性被调用的那个对象
- 多级，就近原则

#### 显示绑定

- 几种方式：
  - Function.prototype.call
  - Function.prototype.apply
  - Function.rototype.bind
  - 属性绑定符

```js
var name = 'sam';
function getName() {
  return this.name;
}
const obj = { name: 'jack' };
const obj1 = { name: 'rose' };
// call：直接调用函数，后面的参数是单个形式
console.log(getName.call(obj)); // 'jack'
console.log(getName.call(null)); // 'sam' 全局的this
console.log(getName.call(undefined)); // 'sam' 全局的this
// apply：直接调用函数，后面的参数是数组形式
console.log(getName.apply(obj)); // 'jack'
// bind：间接调用函数，后面的参数是单个形式
console.log(getName.bind(obj)()); // 'jack'
console.log(getName.bind(obj).bind(obj1)); // 'jack' 只会绑定第一个bind
```

#### new

- 实例化一个函数或者 ES6 的 class
- 对于 Function，return 会影响返回值
  - return 的是一个非对象，直接返回内部的值
  - return 的是一个对象，直接返回该对象

```js
function Person(name) {
  this.name = name;
  this.getName = function () {
    return this.name;
  };
}
var person = new Person('jack');
console.log(person.name); // 'jack'
// return 的影响
function myObj1() {
  this.name = 'obj1';
}
function myObj2() {
  this.name = 'obj2';
  return {
    name: 'jack',
  };
}
function myObj3() {
  this.name = 'obj3';
  return undefined;
}
console.log(new myObj1()); // myObj1 {name:'obj1'}
console.log(new myObj2()); // {name:'jack'}
console.log(new myObj3()); // myObj3 {name:'obj3'}
```

- new 实现原理
  - 创建一个空对象
  - 设置空对象的原型
  - 执行构造函数，把相关属性和方法添加到对象上
  - 返回对象。如果构造函数返回的值是对象类型，就直接返回该对象；反之，返回第一步创建的对象。

```js
function myNew(constructor) {
  var args = [].slice.call(arguments, 1);
  var obj = {};
  obj.__proto__ == constructor.prototype;
}
var res = constructor.apply(obj, args);
return res instanceof Object ? res : obj;
```

#### 箭头函数

- 特征：
  - 简单
  - 没有自己的 this,arguments,super,new.target
  - 适合需要匿名函数的地方
  - 不能用于构造函数

```js
var name = 'global name';
var person = {
  name: 'person name',
  getName() {
    return () => this.name; // this跟getName的this一样
  },
};
console.log(person.getName()()); // 'person name'
console.log(person.getName.call({ name: 'name' })()); // 'name'
```

### this 绑定的优先级

- 优先级
  1. 箭头函数
  2. 显示绑定
  3. new
  4. 隐式绑定
  5. 默认绑定

```js
var name = 'window';
var obj = { name: '张三' };
function logName() {
  console.log(this.name);
}
function logName2() {
  'use strict';
  console.log(this.name);
}
var person = {
  name: 'person',
  logName,
  logName2: () => logName(),
};
logName(); // window
person.logName(); // person
person.logName2(); // window
logName.bind(obj)(); // '张三'
logName2(); //  报错
```

## call 知识点

```js
function a() {
  console.log(this, 'a');
}
function b() {
  console.log(this, 'b');
}
a.call(b); // 'a'
a.call.call(b, 'b'); // 'b'
a.call.call.call(b, 'b'); // 'b'
a.call.call.call.call(b, 'b'); // 'b'
```

```js
fun.call(obj,...args)=== (obj.fun=fun;obj.fun(...args))
```

```js
a.call(b): a被调用
a.call.call(b)：a.call被调用
a.call.call.call(b)：a.call.call被调用
//
a.call === Function.prototype.call // true
a.call === a.call.call // true
a.call === a.call.call.call // true
```

## 纯函数，副作用，高阶函数等函数式编程概念

### 编程范式 - 面向过程编程

- 特点：主要采用过程调用或函数调用的方式来进行流程控制。流程则由包含一系列的运算步骤的过程，子程序，方法或者函数控制。

### 编程范式 - 面向对象编程

- 特点：它将对象作为程序的基本单元，将程序和数据封装其中，以提高软件的重用性，灵活性和扩展性，对象里可以访问经常修改对象相关连的数据。在面向对象程序编程里，计算机程序会被设计成彼此相关的对象。

### 编程范式 - 函数式编程

- 特点：函数式编程更加强调程序执行的结果而非执行的过程，倡导利用若干简单的执行单元让计算结果不断渐进，逐层推到复杂的计算，而不是设计一个复杂的执行过程。
- 优点：
  - 代码简洁，优雅
  - 语法灵活，复用性高
  - 容易测试
  - 易升级
  - 并发友好
  - 可维护性好

### 纯函数

- 定义：纯函数就是相同的输入，永远得到相同的输出，并且没有任何副作用。
- 优点：
  - 安全：无副作用，不破坏外面的状态
  - 可测试：入参固定，输出固定，好断言
  - 可缓存：同入同出，便于缓存，提升效率

### 函数副作用

- 定义：函数调用时，除了返回函数值之外，还对外界产生附加的影响。
- 举例：
  - 修改变量
  - 修改参数
  - 输出日志
  - 操作 DOM
  - 发送了 http 请求
  - 操作客户端存储
  - 与 service,iframe 通讯
  - 其他不该做的事情

### 高阶函数

- 定义：就是一个接受函数作为参数或则函数作为输出返回的函数
- 特征：函数入参或者返回函数
- 数组中的高阶函数
  - Array.prototype.filter
  - Array.prototype.find
  - Array.prototype.map
- 应用：
  - 柯里化
  - Function.prototype.bind

# 深入原型链

- 原型的好处
  - 共享数据，减小空间占用，节省内存
  - 实现继承

## 原型三件套

- 三个属性
  - prototype：原型
  - constructor：构造函数
  - \_\_proto\_\_：访问器属性（getter 函数 + setter 函数），用于暴露 prototype 内部

### prototype

- 特征：

  - prototype 属性是一个普通对象
  - 普通对象都有一个\_\_proto\_\_属性
  - 普通函数或者 class 既有 prototype 属性，又有\_\_ptoto\_\_

- 理解：
  <image src="./images/02.png" ></image>

## 总结

- 知识点：
  - 函数本质是对象
  - 普通对象的 constructor 指向自己的构造函数，可以被改变，不安全
  - 函数和 class 的 prototype.constructor 指向函数自身
  - Function，Object，Regexp，Error 等本质是函数，Function.constructor === Function
  - 普通对象都有\_\_proto\_\_，其等于构造函数的原型，推荐使用 Object.getPrototypeOf
  - 原型链的尽头是 null，Object.prototype.\_\_proto\_\_ === null
  - Function.\_\_proto\_\_指向 Function.prototype
  - 普通对象的二次\_\_proto\_\_指向 null
  - 普通函数的三次\_\_proto\_\_指向 null
  - 经过 n 次显式继承，被实例化的对象，n+3 的\_\_proto\_\_是 null

## 纯净对象

- 定义：没有原型的对象
- 优点：节约内存空间
- 创建：Object.create(null)

## 组合与继承

### 组合（has-a 关系）

- 定义：在一个类/对象内使用其他的类/对象
- has-a：包含关系，体现的是**整体和部分**的思想
- **黑盒复用**：对象内部的细节不可见，只要知道怎么使用，调 api 就行

```js
class Logger {
  log() {
    console.log(...arguments);
  }
  error() {
    console.error(...arguments);
  }
}
class Report {
  constructor(logger) {
    this.logger = logger || new Logger();
  }
  report() {
    this.logger.log('report');
  }
}
```

- 优点：
  - 功能相对独立，松耦合
  - 扩展性好
  - 符合单一职责，复用性好
  - 支持动态组合，即程序运行中组合
  - 具备按需组装的能力
- 缺点：
  - 使用上相比继承，更为复杂
  - 容易产生过多的类和对象

### 继承（is- a 关系）

- 特征
  - 继承是 is-a 关系，比如人和动物
  - 白盒复用：你需要了解弗雷具体实现，从而决定怎么重写父类
- 优点：
  - 初始化简单，子类具备父类的能力
  - 无需显式初始化父类
- 缺点：
  - 继承层级多，导致代码可读性差
  - 耦合紧
  - 扩展性相对较差

### 组合与继承的目的：逻辑复用，代码复用

### 多态

- 定义：事物在运行过程中存在不同的状态
- 形成条件：
  - 需要有继承关系
  - 子类重写父类的方法
  - 父类指向子类

### 使用场景

- 有多态需求时，使用继承
- 有多重继承的需求，使用组合
- 有多态 + 多重继承需求时，继承 + 组合

### ES5 继承方式

- 原型链继承
- 构造函数继承
- 原型式继承
- 组合继承
- 寄生式继承
- 寄生组合继承
  - 各个实例属性相互独立，不会发生修改一个实例，影响另一个实例
  - 实例化过程中没有多余的函数调用
  - 原型上的 constructor 属性指向正确的构造函数

```js
// 寄生组合继承
function Animal(options) {
  this.age = options.age || 0;
  this.sex = options.sex || 0;
  this.testProperties = [1, 2, 3];
}
Animal.prototype.eat = function (something) {
  console.log('eat:', something);
};
function Person(options) {
  // 初始化父类，独立各自属性
  Animal.call(this, options);
  this.name = options.name || '';
}
// 设置原型
Person.prototype = Object.create(Animal.prototype);
// 修改构造函数
Person.prototype.constructor = Person;
Person.prototype.eat = function eat(something) {
  console.log(this.name, something);
};
Person.prototype.walk = function walk() {
  console.log(this.name, 'walking');
};
var person = newPerson({ age: 19, name: 'jack', sex: 1 });
person.eat('rice');
person.walk();
var person = newPerson({ age: 19, name: 'rose', sex: 2 });
person.testProperties.push(4);
```

### es6 继承

- 特征
  - extends 关键字
  - super 访问父类
- 注意点：
  - 构造函数 this 使用前，必须先调用 super 方法
  - 注意箭头函数形式的属性
  - class 想在原型上添加非函数的属性，还得依赖 prototype

## 柯里化

- 定义：柯里化是将一个 N 元函数转换为 N 个一元函数，它持续的返回一个新的函数，直至所有的参数用尽为止，然后柯里化链中最后一个函数返回并且执行，才会全部执行。
  - 元：指的是函数参数的数量
- 简而言之：就是将多元函数转为一元函数

```js
// 简单举例
function calcSum(num1, num2, num3) {
  return num1 + num2 + num3;
}
function currySum(num1) {
  return function (num2) {
    return function (num3) {
      return num1 + num2 + num3;
    };
  };
}
calSum(1, 2, 3);
currySum(1)(2)(3);
```

```js
var slice = Array.prototype.slice;
var curry = function (fn, length) {
  var args = slice.call(arguments, 1);
  return _curry.apply(this, [fn, length || fn.length].concat(args));
};
function _curry(fn, len) {
  var oArgs = slcie.call(arguments, 2);
  return function () {
    var args = oArgs.concat(slice.call(arguments));
    if (args.length >= len) {
      return fn.apply(this, args);
    } else {
      return _curry.apply(this, [fn, len].concat(args));
    }
  };
}
// 使用
function calSum(num1, num2, num3) {
  return num1 + num2 + num3;
}
const currySum = curry(calSum, 3);
console.log(currySum(4, 6));
console.log(currySum(4)(6));
```

### 反柯里化

```js
function unCurry(fn) {
  return function (context) {
    return fn.apply(context, Array.prototype.slice.call(arguments, 1));
  };
}
```

- 反柯里化使用场景
  - 借用数组方法
  - 复制数组
  - 发送事件

## 链式调用

- 举例
  - jquery
  - 数组
  - es6 异步操作
  - EvenetEmiter
- 本质
  - 返回对象本身
  - 返回同类型的实例对象
- 案例
  - lodash
  - axios
- 优点
  - 可读性强，语义好理解
  - 代码简洁，
  - 易于维护
- 缺点
  - 编码门槛高
  - 调试不方便
  - 消耗大
- 使用场景
  - 需要多次计算或赋值
  - 逻辑上有特定的顺序
  - 相似的业务的集中处理
- 实现的其他方式
  - compose
  - pipe

```js
class Calculator {
  constructor(value) {
    this.value = value;
  }
  add(num) {
    // 方式1：返回自身
    // this.value = this.value + num;
    // return this;
    // 方式2：返回实例
    const value = this.value + num;
    return new Calculator(value);
  }
  minus(num) {
    // this.value = this.value - num;
    // return this;
    const value = this.value - num;
    return new Calculator(value);
  }
  // ES5 getter 表现得像属性，实则是一个方法
  get value() {
    return this.value;
  }
}
const cal = new Calculator(10);
const val = cal.add(10).minus(5).double().value;
console.log(val);
```

## 解析代码

### eval

- 作用：将传入的字符串当作 js 代码执行
- 语法：eval(string)
- 基本使用：eval('2 + 2')
- 使用场景：
  - 系统内部的 setTimeout 或者 setInterval
  - JSON 字符串转对象
  - 前端模板
  - 动态生成函数或者变量
  - 有需要跳出严格模式的场景
  - ......
- 注意事项：
  - 安全性
  - 调试困难
  - 性能低
  - 门槛高
  - 可读性和可维护性差
- 直接调用与间接调用区别
  - 直接调用：
    - 作用域：正常的作用域链
    - 是否严格模式：继承当前
    - 方式
      - eval
      - (eval)
      - eval=window.eval
      - {eval}=window
      - with({eval})
  - 间接调用：
    - 作用域：只有全局作用域
    - 是否严格模式：非严格模式

## new Function

- 作用：创建一个新的 Function
- 语法：new Function([arg1,[arg2,[arg3,[...]]]],functionBody)
- 基本用法：new Function("a","b","return a+b")(10,20 )
- 注意事项：
  - new Function 基于全局环境创建
  - 方法的 name 属性是 anonymous
- 使用场景：
  - 获取 this
  - 在线运行代码
  - 模板引擎

# 操作 dom

```js
// 查看继承关系的方法(手写版)
function getParents (el) {
  if (typeof el !== 'object' || el === null) {
    throw new Error('el应该是一个对象');
  }
  var _el = el;
  var result = [];
  while (_el.__proto__ !== null) {
    result.push(_el.__proto__.constructor.name){
      _el = _el.__proto__
    }
  }
}
getParents(document)
```

## nodeType

### 主要类型

- 元素节点：Node.ELEMENT_NODE，1
- 文本:NODE.TEXT_NODE，3
  - 访问：childNodes
  - 取值：nodeValue
  - 拆解文本：splitText
  - 合并文本：Element.normailze
- 注释:NODE.COMMENT_NODE，8
  - 取值：nodeValue
- 文档类型:DOCUMENT_NODE，9
  - 节点查找：document.querySelector，document.querySelectorAll 等
  - 节点结合信息：document.all，ducument.scripts,document.images 等
  - cookie：document.cookie
- 文档:DOCUMENT_TYPE_NODE，10
  - 访问：document.type，document.firstChild
- 文档碎片:DOCUMENT_FRAGMENT_NODE，11
  - 所有节点都会一次性的插入文档 ducument 中，仅发生一次重渲染
  - 常用于批量创建大量节点，提高性能

## element 系列

- 创建：document.createElement
- children(nodeType = 1)和 childNodes(全部)
- 获取属性 getAtribute，设置属性：setAttribute

### Node 与 element

- node 定义：node 是一个接口，成为节点
- lelement 定义：nodeType===1，是元素，为 element

### HTMLCollection 和 NodeList

- HTMLCollection：子类的集合，元素集合
- NodeList：所有 node 子类的集合，节点列表

# 操作 dom/node 节点

## 增加与查找总结

| 方法名                 | 单个元素 | 节点列表 | 元素集合 | 元素也拥有 | 实时更新 |
| ---------------------- | -------- | -------- | -------- | ---------- | -------- |
| getElementById         | √        |
| querySelector          | √        |          |          | √          |
| getElementsByClassName |          |          | √        | √          | √        |
| getElementsByName      |          | √        |          |            | √        |
| getElementsByTagName   |          |          | √        | √          | √        |
| querySelectorAll       |          | √        |          | √          | √        |

## 查询伪元素

- 不能查询为元素
- 但是能获取到样式：window.getComputedStyle

## 元素集合与 Nodelist 遍历

- for/while 遍历
- NodeList.prototype.forEach
- 也可以转为数组进行遍历：Array.from，Array.prototypr.slice 等等

## 某节点/元素所有子节点/元素

- children/childNodes
- Nodelterator 或者 TreeWalker
- 区别：
  - TreeWalker 是 nodeLterator 的更高版本
  - 额外有：parentNode，firstChild，lastChild，nextSibling

## node 对象方法

- appendChild
- insertBefore
- replaceChild
- textContent

## Element 对象方法

- after&before
- append&prepend
- insertAdjacent 系列
- replaceChildren&replaceWith
- insertHTML&innerText

## 节点复制

- Node.cloneNode
  - 节点克隆
  - 分为浅克隆与深克隆
- Document.importNode
- Document.adoptNode
- Element.innerHTML

## 批量删除

- outerHTML&innerHTML
- 循环删除

## 创建节点

- 对象模型直接 new
- document.create 系列

## 删除节点

- Node.removeNode
- Element.remove
- outerHTML&innerHTML
- Document.adoptNode

## 内存泄露

```js
// dom元素或者时间监听操作手动清空
var root = document.createElement('div');
var div = document.createElement('div');
div.appendChild(new Text('文本'));
root.appendChild(div);
// 经过一系列操作
root.removeChild(div); // 挂载到window上，未清除

// 检查div是否回收
const wkRef = new WeakRef(div);
console.log(wkRef.deref()); // <div>文本</div> 存在
div = null; // 手动清除
setInterval(() => {
  console.log(wkRef.deref());
}, 1000);
// 闭包：立即执行函数来清除
```

## 相似的知识点

### 文本

- HTML.element.innerText
- Node.textContent
  </br>| Node.textContent|HTMLElement.innerText
  -|-|-
  style,script 标签，隐藏的内容（diplay:none）|包含|不包含
  br 标签|无效|有效
  \t、\n 等转义字符|有效|不包含
  连续空格|有效|合并为一个

### 节点值

- value：是特定的 HTMLElement 元素属性
- Node.nodeValue：是节点的值

### 宽高

- element.clientWidth/clientHeight
  - 元素的宽高：width + padding（不包含 border，margin，滚动条）
- HTMLElement.offsetWidth/offsetHeight
  - 元素局部宽高：width + padding + border + 滚动条（不包含 margin）
- Element.scollWidth/scrollHeight
  - 元素内容宽高：width + padding + 溢出内容（包括由于元素内容 overflow 溢出屏幕的不可见内容）
    <img src='./images/03.png'>

### 位置关系

- Node.contains
  - 定义：返回值为布尔值，传入节点是否为该节点的后代节点
- Node.compareDocumentPosition
  - 定义：返回值是数字，比较当前节点与任意文档中的另一个节点的位置关系
- Element.getBoundingClientRect
  - 定义：返回元素大小及其相对可视化窗口（导航栏下面的窗口）（视口）的位置
- Element.getClientRects
  - 定义：返回盒子编剧矩形集合

### 加载

- window.onload（后）
  - 在文档加载完成后会触发 onload 事件。此时，在文档中的所有对象在 DOM 中，所有图片，脚本，链接以及子框架完成了装载。
- DOMContentLoaded（先）
  - 在初始化的 HTML 文档被完全加载和解析完成之后，DOMContentLoaded 事件被触发，而无需等待样式表，图像和子框架（iframe）的完全加载。

### 子节点集合

- Node.childNodes
  - 节点的子节点集合，包括元素节点，文本节点...
- Element.children
  - 返回的只是节点的元素节点集合，即 nodeType 为 1 的节点

### 添加节点

- Node.appendChild
  - 将一个子节点附加到指定父节点的子节点列表的末尾
- Element.append
  - 在父节点的最后一个子节点插入一组 node 对象或者 DOMString 对象

### 克隆和导入

- Document.adoptNode
  - 从外部文档拷贝一份到当前文档
- Document.importNode
  - 从外部文档获取一个节点并删除外部文档节点
- Node.cloneNode
  - 从本文档进行复制，分为浅克隆与深克隆

## web component

### 使用步骤

- 编写 Web Component 组件
- 注册 Web Component 组件
- 使用

```js
<my-test></my-test> // 使用
<script>
    // 自定义
    class myTest extends HTMLElement{
        constructor(){
            super()
            this.append('文本')
        }
    }
    window.customElements.define("my-test",myTest) // 注册
</script>
```

### 优点

- W3C web 标准
- 兼容性相对较好
- 天然模块化，自带样式隔离
- 开箱即用

## 适用场景

- 组件库
- 微前端

## custom elements

- 自主定制元素
- 自定义内置元素
- 生命周期
- name 必须包含一个：-

## HTML templates

- 标签 template
  - 节点
  - 样式
- slot：需要配合 shadowDoms
- 样式隔离
  - shadow DOM

```js
// template
<template id="tpl-product-item">
  <div class="name"></div>
  <div class="price"></div>
</template>
<product-item name="产品" price="90"></product-item>
<script>
class ProductItem extends HTMLElement {
  constructor() {
    super();
  }
  connectedCallback() {
    const content = document
      .getElementById('tpl-product-item')
      .connect.cloneNode(true);
    this.append(content);
    this.querySelector('.name').innerText = this.getAttribute('name');
    this.querySelector('.price').innerText = this.getAttribute('price');
  }
}
window.customElements.define('product-item', ProductItem);
</script>
```

```js
// slot
<template id='tpl-test'>
    <style type='text/css'>
.title{color:red}

    </style>
<div class='title'>标题</div>
<slot name='slot-des'>默认内容</slot>
</template>
<test-item>
<div slot="slot-des">不是默认内容</div>
</test-item>
<script>
class TestItem extends HTMLElement {
  constructor() {
    super();
  }
  connectedCallback() {
    const content = document.getElementById('tpl-test').content.cloneDeep(true);
    // this.append(content); // 不生效
    const shadow = this.attachShadow({ mode: 'open' });
    shadow.append(content);
  }
}
window.customElements.define('test-item', TestItem);

</script>
```

## 生命周期

- connectedCallback：插入文档时
- disconnectedCallback：从文档删除时
- adoptedCallback：被移入新文档时
- attributeChangedCallback：属性变化时

- 场景：
  - 插入文档时：
    1. attributeChangedCallback
    2. connectedCallback
  - 属性更新时：
    1.attributeChangedCallback
  - 删除时：
    1.disconnectedCallback
  - 随文档移动时：
    1.disconnectedCallback
    2.adoptedCallback
    3.connectedCallback

## shadow DOM

- 影子 DOM，其内部样式不共享
- 影子 DOM，其内部元素不可以直接被访问到
- 参数：mode（'open'/'closed'）
  - open：shadow root 元素可以从 js 外部访问根节点
  - closed：拒绝从 js 外部访问关闭的 shadow root 节点

# DOM 事件原理

BOM：包含 window，location，navigator，screen，history 等
DOM：文档对象模型，W3C 标准，HTML 和 XML 文档的编程接口。

- 关系：
  - window 属于 BOM，document 是 DOM 核心，但是 window 饮用者 document，仅此而已

## DOM0 级事件

- 定义：以“onclick”形式在元素属性上的事件
- 优点：
  - 效率高
  - 移除事件非常简单
  - 节点上 onclick 属性可以被 Node.cloneNode 克隆，但通过 js 动态添加的 onclick 不可以
- 注意：
  - 事件处理函数中，this 是当前的节点
  - 如果调用函数，会在全局作用域中查找
  - 唯一性，只能定义一个事件的回调函数

## DOM2 级事件

<image src="./images/04.png"/>
- 事件注册

```js
// useCapture:true，捕获阶段传播到目标的时候触发，反之冒泡阶段传到目标的时候触发。默认值为false，即冒泡时
target.addEvenetListener(type, listener, useCapture);
// options:
// - once：是否只响应一次，典型：视频播放
// - passive:true 时，事件处理不会调用 preventDefault，提升滚动性能
// - signal:abortSignal 的 abort()方法被调用时，监听器会被移除
target.addEvenetListener(type, listener, options);
```

- event.preventDefault：阻止默认的行为，如 a 标签不会跳转，checkbox 不会选中等等
- stopPropagation：阻止捕获和冒泡中当前事件的进一步传播。
- stopImmediatePropagation：阻止监听同一事件的其他事件监听被调用。
- target：触发事件的元素。
- currentTarget：事件绑定的元素。
- 事件委托：利用事件传播的机制，利用外层节点处理事件的思路
  - 优点：
    - 减少内存消耗
    - 动态性更好

## DOM3 级事件

- 用户界面事件：涉及 BOM 交互的通用浏览器事件，如 load，scroll......
- 焦点事件：元素获得和失去焦点触发，如 focus，blur
- 鼠标事件：使用鼠标在页面上执行某些操作触发
- 滚轮事件
- 输入事件
- 键盘事件
- 合成事件：在使用某种 IME（输入法编辑器）输入字符触发

## 注意事项

- DOM0 级事件，在一定程度上可以复制
- DOM2 级事件不可复制
- 合理使用 once 选项
- 合理使用 passive 选项提升性能
- capture 选项相同并且事件回调函数相同，事件不会被添加
- 因为都是继承于 EventTarget，任何一个节点都是事件中心
- 合理利用事件代理
