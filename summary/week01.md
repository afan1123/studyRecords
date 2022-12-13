# week01(js 基础)

## 数据类型

- 分类
  - 基本数据类型
    - string
    - number
    - boolean
    - undefind
    - null
    - symbol
  - 引用数据类型
    - object
    - array
    - function
    - date
    - ...
- 区别
  - 储存形式
    - 基本数据：栈（先进后出）
    - 引用数据：堆
  - 判断方式
    - 基本数据：typeof
    - 引用数据：instanceof
  - 访问方式
    - 基本数据：按值访问
    - 引用数据：按地址访问
  - 复制方式
    - 基本数据：复制值（值相同）
    - 引用数据：复制地址（指针相同）
- 判断类型

  - ```js
    // 判断基础数据类型（判断array和object都会是object）
    typeof '123' === 'string';
    // 判断引用数据类型
    let a = new Date();
    a instanceof Date; // true
    // 通用方式
    let str = '123';
    Object.prototype.toString.call(str); // '[object String]'
    a.constructor === String; // true
    // 判断数组
    Array.isArray([1, 2, 3]); // true
    ```

## 上下文（作用域）

- 定义
  - 是变量和函数能够访问到的对象。在执行完成之后，回随之销毁。
- 分类
  - 全局上下文
    - 常见得 window 对象，可以用 var 声明变量，使变量、函数成为全局上下文得属性或者方法。
  - 函数上下文
    - 函数得上下文。函数执行时，会被推到上下文栈，执行完毕会被弹出。
  - 块级上下文
    - {}包裹的代码块。

## 作用域链

- 定义
  - 上下文代码在访问变量和函数时得顺序和依赖关系。
- 作用域链增强
  - 定义：在当前得上下文插入一个新的临时行下文。
  - 方式：try/catch 得 catch 函数和 with 函数
- 补充
  - 对于函数上下文，最初得上下文就是 arguments；代码执行得上下文你始终在最前端，从里到外，依次排序。查询的顺序从前往后进行。

## 变量声明

- 分类
  - var
    - 变量/函数提升：咋最近得上下文最前面添加变量。
    - 未声明，直接初始化，则添加到全局上下文。
  - let
    - 适用于块级作用域
    - 不能重复声明变量
    - 不会有提升效果，会形成暂时性死区
  - const
    - 不能重复声明
    - 不能更改，但可以更改对象键值。
    - 没有提升效果

## 垃圾回收机制

- 定义：当创建变量或者函数时，会自动分配空间。当这些变量或者函数不被使用时，浏览器会清除内存空间的机制。
- 实现
  - 标记清除法
    - 实现：按照策略（不止一种），给变量加上标记，如：给变量加上进入上下文、离开上下文的标记，最后垃圾回收程序将指定标记的变量释放内存。
  - 引用计数法
    - 实现：记录每个值的引用次数，当声明并赋值给别的变量时，次数+1，当别的变量赋值给 引用它的变量 的时候，次数-1，当次数等于 0 时，就释放内存。
    - 问题：循环引用，当两个对象各自包含对方的引用，次数永远为 2，永不释放内存，需要手动解除引用，令其为 null。

## 内存泄漏

- 定义：系统不在用到的内存空间，没有及时被清理。
- 影响
  - 影响系统性能
  - 程序崩溃
- 原因

  - 意外的全局变量
  - 闭包

    - ```js
      function foo() {
        const str = '123';
        return function f() {
          console.log(str);
        };
      }
      ```

  - 没有清除 DOM 元素的引用
    - ```js
      // 在对象中引用了元素
      var obj={
        btn:document.getElementById('btn');
      }
      function click(){
        obj.btn.click()
      }
      // 移除元素
      function removeBtn(){
       document.body.removeChild(document.getElementById('btn'))
      }
      // 还需要移除对象中的元素引用
      obj.btn=null;
      ```
  - 定时器没有清除

    - ```js
      // 定时器 loadData 例为请求数据函数
      var serverData = loadData();
      setInterval(function () {
        var renderer = document.getElementById('renderer');
        if (renderer) {
          renderer.innerHTML = JSON.stringify(serverData);
        }
      }, 5000);
      // 观察者模式
      var btn = document.getElementById('btn');
      function onClick(element) {
        element.innerHTMl = 'innerHTML';
      }
      btn.addEventListener('click', onClick);
      // 需要清除定时器和dom
      // removeEventListner()移除事件监听
      ```

## 原型、原型链

- 原型定义：函数上的 prototype 属性，其中包括特定的引用类型实例的属性、方法。
- 原型链定义：通过原型去查找另一个原型链上的实例和方法的依赖关系。

## 函数

- 箭头函数
  - 定义：使用箭头 => 的形式来声明的函数。
  - 优点：简约
  - 缺点：
    - 没有 arguments、super
    - 不能作构造函数
    - this 指向外层上下文
    - 没有原型，prototype

## call、bind、apply

- 相同点：都是改变 this 的指向，调用函数参数
- 不同点：
  区别|call|bind|apply
  -|-|-|-
  调用方式|间接调用|直接调用|直接调用
  传参方式|1,2,3...(一个个传)|1,2,3...(一个个传)|[1,2,3...] (传数组)
