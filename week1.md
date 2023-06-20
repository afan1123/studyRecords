## ES6+

### Proxy 和 Reflect 区别

- Reflect
  - 定义：是内置对象，不需要实例化，提供了方法来操作对象。
  - 使用场景：对对象的属性获取、设置、删除
  - Api：
    - Reflect.ownKeys(target)：返回对象属性
    - Reflect.getOwnPropertyDescriptor(target, name)：指定属性的描述对象。
    - Reflect.getPrototypeOf(target)：相当于获取、\_\_proro\_\_属性
    - Reflect.setPrototypeOf(target, prototype)：设置目标对象的原型
    - Reflect.has(target, name)：for in
    - Reflect.get(target, name, receiver)：获取属性
    - Reflect.set(target, name, value, receiver)：设置属性
    - ......
- Proxy
  - 定义：Proxy 是一个构造函数，需要实例化，创造一个代理对象，代理对象通过拦截器方法来定制对目标对象的操作行为
  - 使用场景：实现数据绑定、拦截器、缓存等高级的元编程功能。Proxy 的使用场景包括属性拦截、函数调用拦截、构造函数拦截等。
  - Api：
    - get(target, propKey, receiver)：获取属性
    - set(target, propKey, value, receiver)：设置属性
    - has(target, propKey)：判断是否有属性
    - ownKeys(target)：返回自身属性
    - setPrototypeOf(target, proto)：设置目标对象的原型
    - ......

### set 和 weakSet 区别

- set
  - 定义：是一个构造函数，需要实例化，创造一个 set 集合，其中元素不能重复
  - 使用场景：去重
  - Api：
    - add：添加元素
    - delete：删除
    - has：判断是否有值
    - size：长度
    - clear：清空
    - keys/values：遍历属性，结果都一样
    - forEach/entries：遍历属性，结果都一样
- weakSet：
  - 定义：同上，但不用垃圾回收
  - 区别：没有 size，clear，不能用 for ... of 进行遍历

## OOP（面向对象编程）

### 设计模式

#### 工厂模式

- 简单工厂模式：将构建对象的过程单独的封装，解耦用户与对象。

  ```js
  function User(name , age, career, work) {
  this.name = name
  this.age = age
  this.career = career
  this.work = work
  }
  //实现了不同职业对应不同实例的逻辑
  function Factory(name, age, career) {
  let work
  switch(career) {
      case 'coder':
          work =  ['写代码','写系分', '修Bug']
          break
      case 'product manager':
          work = ['订会议室', '写PRD', '催更']
          break
      case 'boss':
          work = ['喝茶', '看报', '见客户']
      case 'xxx':
          // 其它工种的职责分配
          ...

  return new User(name, age, career, work)
  }
  ```

- 抽象工厂模式：围绕一个超级工厂创建其他工厂（继承）

  ```js
  // 定义操作系统这类产品的抽象产品类
  class OS {
    controlHardWare() {
      throw new Error('抽象产品方法不允许直接调用，你需要将我重写！');
    }
  }

  // 定义具体操作系统的具体产品类
  class AndroidOS extends OS {
    controlHardWare() {
      console.log('我会用安卓的方式去操作硬件');
    }
  }

  class AppleOS extends OS {
    controlHardWare() {
      console.log('我会用🍎的方式去操作硬件');
    }
  }
  // 这是我的手机
  const myPhone = new FakeStarFactory();
  // 让它拥有操作系统
  const myOS = myPhone.createOS();
  // 让它拥有硬件
  const myHardWare = myPhone.createHardWare();
  // 启动操作系统(输出‘我会用安卓的方式去操作硬件’)
  myOS.controlHardWare();
  // 唤醒硬件(输出‘我会用高通的方式去运转’)
  myHardWare.operateByOrder();
  ```

#### 单例模式

- 定义：保证一个类仅有一个实例，用于模态框等

```js
class SingleDog {
  show() {
    console.log('我是一个单例对象');
  }
  static getInstance() {
    // 判断是否已经new过1个实例
    if (!SingleDog.instance) {
      // 若这个唯一的实例不存在，那么先创建它
      SingleDog.instance = new SingleDog();
    }
    // 如果这个唯一的实例已经存在，则直接返回
    return SingleDog.instance;
  }
}

const s1 = SingleDog.getInstance();
const s2 = SingleDog.getInstance();

// true
s1 === s2;
```

### 原型模式

- 定义：用原型克隆的方式来实现对象的创建和原型的继承，如 Object.create

### 装饰器模式

- 定义：不会对原有的功能产生任何影响，仅仅是使产品具备了一种新的能力

```js
// 定义打开按钮
class OpenButton {
  // 点击后展示弹窗（旧逻辑）
  onClick() {
    const modal = new Modal();
    modal.style.display = 'block';
  }
}

// 定义按钮对应的装饰器
class Decorator {
  // 将按钮实例传入
  constructor(open_button) {
    this.open_button = open_button;
  }

  onClick() {
    this.open_button.onClick();
    // “包装”了一层新逻辑
    this.changeButtonStatus();
  }

  changeButtonStatus() {
    this.changeButtonText();
    this.disableButton();
  }

  disableButton() {
    const btn = document.getElementById('open');
    btn.setAttribute('disabled', true);
  }

  changeButtonText() {
    const btn = document.getElementById('open');
    btn.innerText = '快去登录';
  }
}

const openButton = new OpenButton();
const decorator = new Decorator(openButton);

document.getElementById('open').addEventListener('click', function () {
  // openButton.onClick()
  // 此处可以分别尝试两个实例的onClick方法，验证装饰器是否生效
  decorator.onClick();
});
```

## 适配器模式

- 定义：将原来的逻辑兼容新逻辑

  ```js
  // Ajax适配器函数，入参与旧接口保持一致
  async function AjaxAdapter(type, url, data, success, failed) {
    const type = type.toUpperCase();
    let result;
    try {
      // 实际的请求全部由新接口发起
      if (type === 'GET') {
        result = (await HttpUtils.get(url)) || {};
      } else if (type === 'POST') {
        result = (await HttpUtils.post(url, data)) || {};
      }
      // 假设请求成功对应的状态码是1
      result.statusCode === 1 && success
        ? success(result)
        : failed(result.statusCode);
    } catch (error) {
      // 捕捉网络错误
      if (failed) {
        failed(error.statusCode);
      }
    }
  }

  // 用适配器适配旧的Ajax方法
  async function Ajax(type, url, data, success, failed) {
    await AjaxAdapter(type, url, data, success, failed);
  }
  ```

## 代理模式

- 定义：通过创建代理对象来拦截行为，在有代理对象对目标对象进行操作行为

```js
<div id="father">
  <a href="#">链接1号</a>
  <a href="#">链接2号</a>
  <a href="#">链接3号</a>
  <a href="#">链接4号</a>
  <a href="#">链接5号</a>
  <a href="#">链接6号</a>
</div>;
// 获取父元素
const father = document.getElementById('father');

// 给父元素安装一次监听函数
father.addEventListener('click', function (e) {
  // 识别是否是目标子元素
  if (e.target.tagName === 'A') {
    // 以下是监听函数的函数体
    e.preventDefault();
    alert(`我是${e.target.innerText}`);
  }
});
```

## 策略模式

- 定义：将原先逻辑抽离，解耦，通过封装的方式，去调用对应的逻辑处理

```js
// 定义一个询价处理器对象
const priceProcessor = {
  pre(originPrice) {
    if (originPrice >= 100) {
      return originPrice - 20;
    }
    return originPrice * 0.9;
  },
  onSale(originPrice) {
    if (originPrice >= 100) {
      return originPrice - 30;
    }
    return originPrice * 0.8;
  },
  back(originPrice) {
    if (originPrice >= 200) {
      return originPrice - 50;
    }
    return originPrice;
  },
  fresh(originPrice) {
    return originPrice * 0.5;
  },
};

// 询价函数
function askPrice(tag, originPrice) {
  return priceProcessor[tag](originPrice);
}
```

## 状态模式

- 定义：允许一个对象在其内部状态改变时改变它的行为，可以把复杂的判断逻辑简化。

```js
class CoffeeMaker {
  constructor() {
    /**
    这里略去咖啡机中与咖啡状态切换无关的一些初始化逻辑
  **/
    // 初始化状态，没有切换任何咖啡模式
    this.state = 'init';
    // 初始化牛奶的存储量
    this.leftMilk = '500ml';
  }
  stateToProcessor = {
    that: this,
    american() {
      // 尝试在行为函数里拿到咖啡机实例的信息并输出
      console.log('咖啡机现在的牛奶存储量是:', this.that.leftMilk);
      console.log('我只吐黑咖啡');
    },
    latte() {
      this.american();
      console.log('加点奶');
    },
    vanillaLatte() {
      this.latte();
      console.log('再加香草糖浆');
    },
    mocha() {
      this.latte();
      console.log('再加巧克力');
    },
  };

  // 关注咖啡机状态切换函数
  changeState(state) {
    this.state = state;
    if (!this.stateToProcessor[state]) {
      return;
    }
    this.stateToProcessor[state]();
  }
}

const mk = new CoffeeMaker();
mk.changeState('latte');
```

## 观察者模式（约等于发布-订阅模式）

- 定义：开启事件时，需要通知相关依赖
- 代码：参考 vue 源码的响应式原理

## 迭代器模式

- 定义：提供迭代器去遍历对象

```js
// for ..of 等价于如下：
// 通过调用iterator，拿到迭代器对象
const iterator = arr[Symbol.iterator]();

// 初始化一个迭代结果
let now = { done: false };

// 循环往外迭代成员
while (!now.done) {
  now = iterator.next();
  if (!now.done) {
    console.log(`现在遍历到了${now.value}`);
  }
}
```

## OOP 面向编程

### OOP 原则

#### 开闭原则

- 定义：对祖先元素，主张对修改关闭，对拓展开放

#### 里氏替换原则

- 定义：父类出现的地方，子类也能取而代之，且不会报错
- 条件：
  - 子类与父类有相同的行为
  - 子类可以通过父类来拓展功能

#### 依赖倒置原则

- 定义：高层模块不依赖底层模块，因为底层模块一改变，高层模块也会随之改变
- 示例：
  ```js
  // C不应该依赖于A，所以通过中间的B来解耦A和C之间的关系，之后底层模块的修改只需要重新定义类来继承B
  // 抽象类B
  class B {}
  // 底层模块A
  class A extends B {}
  // 高层模块C
  class C {
    constructor(d) {
      this.d = d;
    }
    const newA=new A();
    const newC=new C(newA);
  }
  ```

#### 接口隔离原则

- 定义：根据需求设计不同的接口，避免接口之间的依赖，让接口的颗粒度更小，接口之间的耦合度更小。(强调避免使用用不到的接口)
- 示例：
  ```js
  class A {
    swim() {}
    run() {}
    fly() {}
  }
  // 改造成
  class B extends A{
    swim(){
        ...
    }
  }
  class C extends A{
    run(){
        ...
    }
  }
  class D extends A{
    fly(){
        ...
    }
  }
  ```

#### 单一职责原则

- 定义：一个类应该只有一个职责，将模块划分的单一(强调一个对象的职责)
- 例子

```js
class Student {
  constructor(name) {
    this.name = name;
  }

  getName() {
    return this.name;
  }

  updateName(name) {
    this.name = name;
  }
}
class Info(){
    constructor(student){
        this.student=student;
    }
    show(){
        console.log('名字是：'+this.student.getName())
    }
}
const student=new Student('jack',10);
const info=new Info(student);
info.show()
```

#### 迪米特法则

- 定义：多个类之间尽可能保持互相独立，只需要知道如何交互(强调多个类之间独立)
- 例子：类似于上面的例子，只是强调的点不同

#### 合成/聚合复用原则

- 定义：强调通过组合现有的对象来构建更复杂的对象，而不是通过继承来实现复用
  - 合成：表示一个对象包含其他对象，被包含的对象是该对象的一部分，并且只能属于该对象。
  - 组合：表示一个对象包含其他对象，被包含的对象可以属于多个不同的对象，它们之间是一种弱耦合关系。
- 例子

  ```js
  // Device被用于其他两个类
  class Device {
    constructor(model, price) {
      this.model = model;
      this.price = price;
    }
  }

  class Warehouse {
    constructor() {
      this.devices = [];
    }

    addDevice(device) {
      this.devices.push(device);
    }

    removeDevice(device) {
      const index = this.devices.indexOf(device);
      if (index !== -1) {
        this.devices.splice(index, 1);
      }
    }
  }

  class Order {
    constructor() {
      this.devices = [];
    }

    addDevice(device) {
      this.devices.push(device);
    }

    removeDevice(device) {
      const index = this.devices.indexOf(device);
      if (index !== -1) {
        this.devices.splice(index, 1);
      }
    }
  }
  ```

# FP

## Map & Reduce & forEach & pick

- 共同点：
  - 都有回调函数作为参数
  - 支持链式调用
- 区别：
  - map 会返回操作后的一个数组
  - reduce 会有一个初始值，最终输出一个累计计算后的结果
  - forEach 对原数组的每个值进行操作
  - 从对象中挑选属性，从而返回新的对象（浅拷贝）

## filter & find

- filter：找出符合条件的元素并组成新的数组返回
- find：找出第一个符合条件的元素，没有就是 undefined

## flow & compose & curry

### flow

- 定义：是一个函数组合工具，用于将多个函数按照从左到右的顺序组合成一个新的函数。它接受多个函数作为参数，并返回一个新的函数。调用这个新函数时，会按照参数顺序依次调用每个函数，并将前一个函数的返回值作为下一个函数的输入。
- 实现：

  ```js
  function flow(...funcs) {
    return function (arg) {
      return funcs.reduce((result, func) => func(result), arg);
    };
  }
  const add = (x) => x + 1;
  const multiply = (x) => x * 2;
  const subtract = (x) => x - 3;

  const result = flow(add, multiply, subtract)(5);
  console.log(result); // 输出: ((5 + 1) \* 2) - 3 = 9
  ```

### compose

- 定义：同上，就是执行函数顺序是从右到左
- 实现：用 reduceRight

### curry

- 定义：将一个多参数的函数转化为一系列只接受一个参数的函数；每次只传递一个参数时，返回一个新的函数等待下一个参数的传递，直到所有参数都传递完毕后执行原始函数并返回结果
- 实现：

  ```js
    function curry(fn,...args){
        rturn fn.length<=args.length?fn(...args):curry.bind(null,fn,...args);
    }
  ```

# 元编程

## Object.defineProperty

- 定义：用于对象的描述符属性配置

```js
let o={age:10,}
Object.defineProperty(o,'name',{
  value
  get(){},
  set(value){},
  writable:true, // 属性值是否可改写
  enmurable:true, // 可枚举，可悲遍历
  configurable:true // 属性是否可配置
})
```

## Object.seal

- 定义：用于封闭一个对象，使其属性不能被配置

## Symbol

### Symbol.toPrimitive

- 定义：类型强制转换的规则之一，优先级最高，还有 toString 和 valueOf

  ```js
  // hint 是期望值，不同的场景有不同的期望值
  const obj = {
    value: 42,
    [Symbol.toPrimitive](hint) {
      if (hint === 'number') {
        return this.value;
      }
      if (hint === 'string') {
        return `The value is ${this.value}`;
      }
      return this.value;
    },
  };

  console.log(Number(obj)); // 输出: 42
  console.log(String(obj)); // 输出: "The value is 42"
  console.log(obj + 10); // 输出: 52
  ```

### Symbol.toStringTag

- 作用：改变对象用 toString 转换出来的字符串

```js
const o = { name: 'jack' };
const obj = {
  [Symbol.toStringTag]: 'MyObject',
  foo: 'bar',
};

console.log(o.toString()); // 输出: "[object Object]"
console.log(obj.toString()); // 输出: "[object MyObject]"
```

### Symbol.species

- 定义：被构造函数用以创建派生对象。

- 作用：

  ```js
  class MyArray extends Array {
    // 覆盖 species 到父级的 Array 构造函数上
    static get [Symbol.species]() {
      return Array;
    }
  }
  var a = new MyArray(1, 2, 3);
  var mapped = a.map((x) => x * x);

  console.log(mapped instanceof MyArray); // false
  console.log(mapped instanceof Array); // true
  ```

### new.tartget

- 作用：new.target 指向直接被 new 执行的构造函数

```js
class A {
  constructor() {
    console.log(new.target);
  }
}
class B extends A {
  constructor() {
    super();
  }
}
const obj = new A(); // 输出: [Function: A]
const obj = new B(); // 输出: [Function: B]
```

### Symbol.hasInstance

- 定义：判断某对象是否为某构造器的实例

```js
class MyClass {
  static [Symbol.hasInstance](instance) {
    return instance instanceof Array;
  }
}

const arr = [1, 2, 3];
console.log(arr instanceof MyClass); // 输出: true
```

# 基础原理

## 内存泄漏

- 定义：导致浏览器内存越来越大的现象
- 原因：
  - 意外的全局变量
  - dom 对象的引用未清除
  - 闭包泄露
  - 定时器未清除
- 排查方法：
  - memory
  - performance

## 垃圾回收算法

- 标签清除法：变量进入环境时，标记进入；离开环境时，变量被标记离开；需要清除时，清除离开的变量
- 标签整理法：将离散的变量收集整理成连续的集合
- 引用计数法：当变量赋值给其他变量时，计数+1；当被赋值为 null 时，计数-1

## 事件循环

### Browser

- 机制：由于 JS 是单线程的，所以只能一个个执行任务。浏览器有两个存放任务的地方，执行站和任务队列；
  执行栈中放置同步任务，期间产生的异步任务放到任务队列中；当执行栈中的任务全部执行完之后，再执行任务队列中的任务，即微任务（promise.then）与宏任务（setTimouy、setInterval）

### Node

- 机制：

  1. Timers 阶段：执行定时器回调函数，例如 setTimeout() 和 setInterval()。
  2. Pending I/O 阶段：执行延迟到下一个循环迭代的 I/O 回调函数。这些回调函数在上一轮循环中被调度，但是没有被执行
  3. Idle, Prepare 阶段：在此阶段内部使用。
  4. Poll 阶段：检索新的 I/O 事件，执行 I/O 回调函数。如果没有新的 I/O 事件，会等待或者阻塞在这个阶段。
  5. Check 阶段：执行 setImmediate() 回调函数。
  6. Close Callbacks 阶段：执行关闭事件的回调函数，例如 socket.on('close', ...)。

- 注意：
  - 每个阶段都有一个任务队列，事件循环会依次从各个阶段的任务队列中取出任务执行。在每个阶段执行完任务队列中的所有任务后，如果事件循环还未结束，会进入下一个阶段。
  - 在每个阶段执行任务的过程中，如果某个阶段的任务队列为空，事件循环会先进入下一个阶段，而不是等待任务队列中有任务。
  - 事件循环还包括微任务队列和宏任务队列。微任务队列中的任务会在当前阶段执行完毕后立即执行，而宏任务队列中的任务会在下一次事件循环迭代时执行。

## JS 解释执行过程

- 步骤：
  1. 词法分析：将源代码按照语法规则分解成一个个的词法单元（tokens），如标识符、关键字、运算符等。
  2. 语法分析：将词法单元按照语法规则组织成抽象语法树（Abstract Syntax Tree，AST），以描述代码的结构和语义。
  3. 编译：将抽象语法树转换成可执行的字节码或机器码，这个过程包括优化、静态检查和生成可执行代码等步骤
  4. 执行：按照生成的字节码或机器码逐条执行代码，并且处理变量、函数调用、控制流等操作。
- 执行阶段：
  1. 创建上下文：执行之前，会创建一个执行上下文（execution context），用来存储变量、函数和执行状态等信息
  2. 变量和函数声明：执行器会扫描代码，将变量和函数声明提升到当前作用域的顶部，使其在任何位置都可以访问
  3. 变量赋值和表达式求值：按照代码的顺序，逐条执行语句，包括变量赋值、表达式求值、函数调用等操作
  4. 作用域和作用域链：JavaScript 采用词法作用域，通过作用域链（scope chain）来解析变量的引用。作用域链由函数的嵌套关系决定，它决定了变量的可访问性。
  5. 控制流：根据条件语句和循环语句的结果，决定代码的执行路径。这包括 if-else、switch、for、while 等语句的执行。
  6. 错误处理：如果在执行过程中发生错误，JavaScript 会抛出异常并中断执行。可以使用 try-catch-finally 语句来捕获和处理异常。
  7. 垃圾回收：JavaScript 引擎会自动进行垃圾回收，回收不再使用的内存空间，以便提供更多的可用内存。

## 事件委托

- 定义：利用事件冒泡将事件的处理程序绑定到父元素上面

```js
<ul onclick="clickItem(e)">
  <li></li>
  <li></li>
  <li></li>
</ul>;
function clickItem(e) {
  console.log(e.target);
}
```

## 使用设计模式减少冗余代码

- 工厂模式：可以将对象的创建过程封装起来，减少重复代码
- 单例模式：确保一个类只有一个实例，提供全局访问点
- 适配器模式：可以兼容原本不兼容的接口
- 装饰器模式：可以动态的拓展新功能，无需修改原始对象
- 观察者模式：提供了一对多的依赖关系，当对象发生改变，依赖它的对象也随之发生改变
- 策略模式：封装算法，使其可以灵活使用

## 尾调用

- 定义：一个函数的最后一个操作是递归调用自身，并且该递归调用的返回值直接被当前函数所返回，不再参与任何其他操作
- 步骤：
  1. 当一个函数调用发生时，编译器或解释器会将函数的参数和局部变量保存在堆栈中的活动记录中。
  2. 在普通递归中，每次递归调用都会生成一个新的活动记录，存储新的参数和局部变量，并将其添加到调用栈中。这会导致调用栈的不断增长，占用大量内存空间。
  3. 在尾递归优化中，如果满足尾递归的条件，编译器或解释器会对函数进行优化，不再生成新的活动记录，而是重用当前的活动记录。这样可以避免调用栈的无限增长，节省内存空间。
  4. 当发生尾递归调用时，编译器或解释器会将新的参数和局部变量直接更新到当前的活动记录中，并且不再需要保存之前的调用信息。
  5. 当满足终止条件时，尾递归函数的最后一个操作会直接返回结果，不再进行递归调用，从而结束递归过程。

```js
// 通过尾递归优化，计算阶乘的函数在执行过程中只占用固定的堆栈空间，不会因为递归深度的增加而导致堆栈溢出。
function factorial(n, accumulator = 1) {
  if (n === 0) {
    return accumulator;
  }
  return factorial(n - 1, n * accumulator);
}

console.log(factorial(5)); // 输出: 120
// 反例 每次递归调用都会生成新的活动记录，并且需要保留之前的调用栈来计算结果。随着递归深度的增加，调用栈的大小也会线性增长，可能导致堆栈溢出
function fibonacci(n) {
  if (n <= 1) {
    return n;
  }
  return fibonacci(n - 1) + fibonacci(n - 2);
}

console.log(fibonacci(5)); // 输出: 5
```

## 函数避免 sideEffect

- 定义：指函数对于除了返回值以外的其他部分产生的任何影响，如：修改全局变量、修改传入的参数、触发网络请求等等
- 避免的方式：
  - 纯函数：
  ```js
  function add(a, b) {
    return a + b;
  }
  ```
  - 函数式编程
  - 避免修改传入的参数
  - 使用局部变量

## 异常监控 & 兜底（不懂 🤔）

# 验收问题

## Fetch vs XHR 接口，有什么区同点？什么情况下必须使用 XHR？

- 共同点：
  - 支持异步请求，可以使用 Promise/await 或者 async 来设置异步操作
  - 支持跨域请求，设置请求头的 CORS
- 不同点：
  - API:fetch 的 api 基于 Promise 设计，支持链式调用和较好的错误处理机制；XHR 的 api 比较早
  - 兼容性：fetch 是 es6 标准，兼容性较差；xhr 兼容性较好
  - 取消请求：Fetch 不支持直接取消请求，需要使用 AbortController 进行处理；XHR 支持通过调用 abort() 方法取消请求
  - 请求进度：Fetch 提供了更简洁的请求进度处理方式，通过使用 Response 对象的 body 属性来处理数据流，可以使用流式处理数据。XHR 也可以通过事件监听来获取请求进度，如加载进度、上传进度等

## 事件委托是什么？为什么能优化性能？React 事件与事件委托之间是什么关系？

- 事件委托：拖过子元素的事件冒泡机制，传递给父元素进行拦截捕获，从而通过父元素对子元素实现操作的机制
- 为什么能优化性能：
  - 能减少事件处理程序
  - 能够动态绑定事件：子元素会主动继承父元素的事件处理程序，相比每天新增/删除子元素都需要新增/删除事件处理程序，要好得多
- React 事件与事件委托之间是什么关系：React 通过将事件处理器绑定到组件的根元素上，利用事件冒泡机制将事件传递到正确的子元素，并由根元素的事件处理器来事件

## DOM 操作的成本是啥？为什么要尽量避免 DOM 操作？

- 会造成重绘回流
- 计算页面布局
- 渲染页面
