# 周总结

## 基础数据类型

### 判断基本数据类型

- 方法：typeof
- 原理：根据每个类型在内存中存储的格二进制进行判断

  ```js
  object/null:000
  integer:001
  double:010
  string:100
  boolean:110
  ```

### 判断数据类型

- typeof

  - 主要用途：用于判断基本数据类型和引用类型
  - typeof 比 instaceof 性能好，高 2-3 倍
  - 注意：
    - null（'object'），NaN（'number'），document.all（'undefined'）
    - 暂时性死区

- constructor
  - 原理：指向创建实例对象的构造函数。
  - 注意：
    - null、undefined 没有构造函数
    - constructor 可以被改写
- instanceof
  - 原理：在原型链上查找原型，查到就是其实例。
  - 注意：
    - 右边必须是函数或者 class。
    - 多全局对象，如：跨窗体，多个 frame 之间，多个 window，instanceof 会出错。
- isPrototypeOf
  - 原理：是否出现在实例对象的原型链上。
  - 注意：正常情况下，基本等同于 instanceof
- Object.prototype.toString
  - 原理：通过函数的动态 this 特性，返回其数据类型，如：'[obejct Date]'
- Symbol.toStringTag
  - 原理：Object.prototype.toString 会读取该值
  - 适用场景：需要自定义类型
  - 实现：

    - ```js
      class myDate {
        get [Symbol.toStringTag]() {
          return 'myDate';
        }
      }
      const date = new myDate();
      consoel.log(Object.prototype.toString.call(date)); // 'myDate'
      ```

- 等比较（===）

### 字符串批量转数字

```js
// parseInt(string,radix)
// string：要被解析的值，为字符串，如果不是，则toString()方法转为字符串
// radix：范围2-36的整数，表示进制的基数；若超范围，则返回NaN；若是0或没传，则自动推算。
const arr = ['1', '2', '3'];
arr.map(parseInt); // [1,NaN,NaN]
```

### boolean 值为 false 的情况

- null
- undefind
- 0
- NaN
- ''

### 宽松比较（双等于）隐式转换规则

- NaN：和所有（包括自身都不等）。
- bigInt,symbol：先比较类型，在判断值是否相等。
- null,undefined：只和 null 或者 undefined 相等。
- boolean 和其他类型比较：boolean 会先转换成数字，再比较值。
- number 和 string 比较：string 会转为数字进行比较。
- object 和原始类型比较：对象转成原始数据类型比较。
- object 之间比较：比较引用对象。

### NaN 判断方法

- Object.is(value,NaN)
- value!==value
- typeof value === 'number' && isNaN(value)
- 注意：
  - [NaN].indexOf(NaN) // -1
  - [NaN].includes(NaN) // true

### []+[]，[]+{}，{}+[]，{}+{}

- 本质：二元操作符 '+' 的规则
- 规则：
  - 若操作数是对象，则对象转为原始值。
    - 转为原始值的三种方法
      - Symbol.ToPrimitive
      - Object.prototype.valueOf // [].valueOf()==[] {}.valueOf=={}
      - Object.prototype.toString // [].toString()=='' {}.toString=='[object Object]'
  - 若其中一个是字符串，则另一个操作数也转为字符串，进行拼接。
  - 否则，两个操作数都转为数字或者 NaN，进行加法运算。
- 结果：
  - []+[] == ''
  - []+{} == '[object Object]'
  - {}+[] == 0 // {}被当作了空的代码块
  - {}+{} == '[object Object][object object]' （等同于({}+{})）

# 对象

## 对象属性

### 常规属性

- 键为字符串：会按照创建顺序进行排序

### 排序属性

- 键作为数字：会按照数字进行排序

### 设计的好处

- 提升属性访问速度
- 两种线性数据保存

### 内置属性

- 定义：被保存到对象自身的常规属性

### 隐藏类

- 定义：对对象的一些属性描述。
- 作用：时间上，提升访问速度；空间上，节约内存。

### 对象的 delete 操作性能差

### 属性类别

- 静态属性，如 Object.assign
- 原型属性，如 Object.prototype.toString
- 实例属性，如构造函数中的 this.name='name'

### 属性描述符

- configurable:可配置
- enunmberable:可枚举
- value:值
- writable:可被改写
- get：访问器函数
- set：访问器函数
- 数据属性：value + writable + configurable + enumberable
- 访问器属性：get + set + configurable + enumberable
- 注意：
  <img src='./images/01.png' />

## Object.defineProperty 缺点

- 无法监听数组变化
- 只能劫持对象属性，需要遍历对象属性；属性是对象，还要进行递归。

## 对象的可拓展

- Object.preventExtensions：对象变得不能拓展，不能再添加新属性。
- Object.isExtensible：对象的是否可拓展

## 对象的封闭

- Object.seal：组织添加新的属性+标记属性不可配置
- Object.isSeal：检查一个对象是否被封闭。

## 对象的冻结

- Object.freeze：不添加新属性+不可配置+不能修改值
- Object.isFrozen：检查一个对象是否被冻结

# 原型

## prototype

- prototype 是一个对象

- 通过原型链查找属性方法比较耗时

## \_\_ proto \_\_

- 构造函数的原型都有这个属性，除 null 以外

- Function，class 的实例有 prototype 以及**proto**属性

- 普通函数，祖上三代必为 null

## instanceof

- 检测构造函数的 prototype 属性是否出现在某个实例对象上
- 手写 instanceof

```js
function myInstanceof(left, right) {
  let proto = left.__proto__;
  let prototype = right.prototype;
  while (proto) {
    if (proto === prototype) {
      return true;
    }
    proto = proto.__proto__;
  }
  return false;
}
```

- 注意：
  - Object instanceof Function // true
  - Function instanceof Object // true

## getPrototypeOf

- 作用：返回对象的原型
- 用法：Object.getPrototypeOf/Reflect.getPrototypeOf
- 内部先将参数用 toObject 转换，注意 null 和 undefined 没有原型

## setPrototypeOf

- 作用：指定对象的原型
- 用法：Object.setPrototypeOf/Reflect.setPrototypeOf
- 原型尽头是 null

## isPrototypeOf

- 作用：一个对象是否存在另一个对象的原型链上
- 用法：Object.prototypeOf.isPrototypeOf()

## Object.create

- 作用：创建纯净对象

# 对象遍历

## 属性类型

- 普通属性
- 不可枚举属性
- 原型属性
- symbol 属性
- 静态属性

## 遍历方式

| 方法名                       | 普通属性 | 不可枚举属性 | symbol 属性 | 原型属性 |
| ---------------------------- | -------- | ------------ | ----------- | -------- |
| for in                       | √        | ×            | ×           | √        |
| Object.keys                  | √        | ×            | ×           | ×        |
| Object.getOwnPropertyNames   | √        | √            | ×           | ×        |
| Object.getOwnPropertySymbols | ×        | √            | √           | ×        |
| Relect.ownKeys               | √        | √            | √           | ×        |

# 对象的隐式转换

## 显示类型转换

- String、Object、Number 等
- parseInt、parseFloat 等
- 显式 toString() 等

## 隐式类型转换

- 二元 + 运算符
- 关系运算符>，<，>=，<=，==
- 逻辑运算符 if，!，!!，while，三目运算符
- 属性键遍历，for in 等
- 模板字符串

## 对象隐式转换

- Symbol.toPrimitive：若存在，优先调用且无视 valueOf 和 toString。
- Object.prototype.toString：若期望值为 string（只有 Date 类型），则优先调用；若返回值不是原始值，调用 valueOf。
- Object.prototype.valueOf：若期望值为 number 或者 default，先调用 valueOf；若返回值不是原始值，调用 toString。

### Symbol.toPrimitive(hint)

- hint - "string"
  - 模板字符串`${}`
  - test[obj] = 123

  ```js
  const obj = {
    [Symbol.toPrimitive](hint) {
      if (hint == 'string') {
        return 'hello';
      }
      if (hint == 'number') {
        return 10;
      }
    },
  };
  obj[obj] = 123;
  console.log(Object.keys(obj)); // ['hello']
  ```

- hint - "number"
  - 一元+，位移
  - -，\*，/，关系运算符
  - Math.pow，String.prototype.slice 等很多内部方法
- hint - "default"
  - 二元 +
  - ==，!=
- 注意：
  - 两个对象 ===，!== 不会触发隐式转换（比的是引用）
  - 两个对象 ==，!= 不会触发隐式转换（只有一边是对象的时候，才会触发）

## toString 和 valueOf

```js
const obj = {
  name: 'jack',
  age: 10,
  toString() {
    return this.name;
  },
  valueOf() {
    return this.age;
  },
};
console.log(`${obj}`); // 期望值是string，输出:jack
console.log(+obj); // 期望值是number，
输出: 10;
```

## 特殊情况

### Date

- hint 是 default，是有限调用 toString，然后调用 valueOf

# JSON

## JSON 格式

- 定义：JSON 是一种轻量级的、基于文本的、与语言无关的语法、用于定义数据交换格式。

## 对象字面量

- 定义：是创建对象的一种快捷方式，英文名：Object literal
- 其他：函数字面量，数组字面量等额定
- 与 new 区别：字面量的性能优于使用 new 构建

# 对象的多种克隆

- 作用：保证数据的完整性和独立性
- 场景：复制数据、函数传参、class 构造函数等

## 浅克隆

- 定义：只复制第一层
- 值为原始数据，只复制值；值为引用类型，只复制引用地址
- 种类
  - ES6 拓展运算符 ...object
  - slice
  - [].concat

## 深克隆

- 定义：克隆对象的每个层级
- 值为原始数据，只复制值；值为引用类型，递归复制

- 种类：
  - JSON.stringify + JSON.toString
    - 只能复制普通键，symbol 键不行
    - 循环引用对象，比如 window 不行
    - 函数 Date,Rege,Blob 等类型不能复制
  - 消息通讯 BroadcastChannel 等等
  - window.postMessage
  - Shared Worker
  - Message Channel
  - 手写

# 运算符

## 函数

- 普通函数时，this 的指向是调用函数的对象

  ```js
  let name = 'letName';
  const person = {
    name: 'personName',
    getName() {
      return this.name;
    },
  };
  const getName = person.getName;
  getName(); // undefined,虽然this指向windou，但let和const声明的变量不会放在全局对象上
  person.getName(); // personName，this指向person
  （person.getName）(); // personNaem，this指向person
  (0, person.getName)(); // 逗号操作符需要对前后进行求值，因此等于(const getName=person.getName)() undefined
  ```

## delete 本质

```js
delete null; // true 删除常量
delete 11; // true 同上
delete undefined; // false undefined是window上的常量
a = { c: 12 };
delete a; // true 错误声明的变量的configurable为false Object.getOwnPropertyDescriptor(window,'a')
var b = 12;
delete b; // true 正确声明的变量的configurable为true
delete xxxxx; //true  引用不可达，直接true
delete {}.toString; // true 没虽然true，但不会遍历原型链删除，没删除成功，还存在
console.log(Object.trString); // 还存在
```

- 返回值：boolean 类型
  - true，不一定代表成功，代表**删除没有异常**
  - false，一定删除失败
- 不能删除的属性

  - 全局上下文的属性方法
  - let，const 声明的变量函数

  - ```js
    function foo() {
      this.name = 'jack';
    }
    foo.prototype.name = 'rose';
    const f = new foo();
    console.log(f.name); // jack
    delete f.name; // true,删除foo自身属性
    console.log(f.name); // rose
    delete foo.prototype.name; // true,删除原型链上的属性
    console.log(f.name); // undefined
    ```

- delete 删除的本质

  - 操作表达式结果
  - 值，字面量，不操作，直接返回 true
  - 引用类型，删除引用

- 几种错误
  - syntaxError:变量，函数名，函数参数
  - typeError：configurable：false
  - referenceError：delete super.property

## 位运算符

- 操作数是 32 整数位
- 自动转为整数
- 速度很快，在二进制下运算

### 判断奇偶数

- 奇数：num & 1 == 1
- 偶数：num & 1 == 0

### 十进制与二进制如何转换

- 整数：除 2 取余，逆序排列
- 余数：乘 2 取整，顺序排列
- 9.375 = 1001 + 0.011 = 1001.011

  ```js
  (9.375).toString(2);
  Number.prototype.toString.call(9.375, 2);
  Number.prototype.toString.call(Number(9.375), 2);
  ```

### 浮点数是以什么格式进行存储的

- 浮点数运算规则步骤
  - 对阶
  - 尾数运算
  - 规格化
  - 舍入处理
  - 溢出处理

## 总结

| 位运算符 | 中文名称 | 特点                                                   | 应用场景                        |
| -------- | -------- | ------------------------------------------------------ | ------------------------------- |
| &        | 按位与   | 两个操作数都为 1，则为 1                               | 1、判断奇偶数                   |
| \|       | 按位或   | 两个操作数至少一个为 1，则为 1                         | 1、救奇偶数 2、等于某个整数值   |
| ~        | 按位非   | 取反-1、-x-1                                           | 1、取整 2、数组中是否存在某个值 |
| ^        | 按位异或 | 有且只有一个操作数为 1，则为 1                         | 1、整数比较 2、数字交互         |
| \>\>     | 位移     | 移动指定位数，超出的位数将会被清除，缺省位数将会被补零 | 1、转为整数 2、色值转换 3、编码 |

# 数组

## 批量造数据

- for 循环 + push
- 数组 + fill + map

  ```js
  new Array(100).fill(null).map((item, index) => {
    return { name: 'jack' + index };
  });
  ```

- Array.from()

  ```js
  Array.from({ length: 100 }, (item, index) => {
    return {
      name: 'jack' + index,
    };
  });
  ```

## 数组去重

- Set

  ```js
  new Set([...[1, 2, 3], ...[2, 3, 4]]);
  ```

- for + indexOf
- for + find|findIndex

# 类数组

## 创建数组的方法

- 数组字面量
- new Array()
- Array.form()
- Array.of()

## 什么是类数组？

- 定义：是一个有 length 的属性和**从零开始**索引的属性，但是没有 Array 的内置方法，比如 forEach 和 map 等方法

## 类数组的特征？

- 是一个普通对象
- 必须有 length 属性，可以有非负整数索引
- 不具备数组方法的对象

## 常见的类数组有哪些？

- arguments 对象
- NodeList
- HTMLCollection(document.body.children,document.all...)
- ......

## 字符串

- 字符串一般具有数组的所有特性

## 数组和类数组的区别

|               | 数组             | 类数组            |
| ------------- | ---------------- | ----------------- |
| toString 返回 | [object Array]   | [object Object]   |
| instanceof    | Array            | Object            |
| constructor   | [Function:Array] | [Function:Object] |
| Array.isArray | true             | false             |
| 自带方法      | 多个方法         | 无                |

## 类数组转为数组

- slice

  ```js
  const arrayLike = { length: 10, 0: 1, 1: 2 };
  Array.prototype.slice.call(arrayLike);
  ```

- concat

  ```js
  const arrayLike = { length: 10, 0: 1, 1: 2 };
  Array.prototype.concat.apply([], arrayLike);
  ```

- Array.from

  ```js
  const arrayLike = { length: 10, 0: 1, 1: 2 };
  Array.from(arrayLike);
  ```

- Array.apply

  ```js
  const arrayLike = { length: 10, 0: 1, 1: 2 };
  Array.apply(null, arrayLike);
  ```

## 数组长度

### 数组空元素 empty

- 定义：数组的空位，指的是数组某一位置没有元素
- 遍历会自动跳过空位，如 forEach,map，reduce 等等
- 缺点：会造成数组操作的非线性存储问题
- 基于值进行运算，空位 empty 会作为 undefined
  - find,findIndex,includes 等等，indexOf 除外
  - 被作为迭代时，参与 Object.entries，扩展运算符，for of 等
- Join 和 toString 时，会作为空字符串进行运算
- 稀疏数组：有空位元素 empty 的数组
- 避免创建稀疏数组：
  - Array.apply(null,Array(3))
  - [...new Array(3)]
  - Array.from(Array(3))

## 数组改变自身的方法

- pop，shift，splice
- unshift，push，sort，reverse
- copyWithin，fill

## push 比 concat 性能更好

## 数据生成器

- 万能数据生成器：Array.from({length:10})
- 随机数生成器：Array.from({length:10},Math.random)
- 序列生成器：

  ```js
  Array.from({length:10},(index,item)=>{
  // start:开始下标
  // end:结束下标
  // step:步长
  const start=0;
  const end=10
  const step=2;
  return {start+(index*step)}
  })
  ```

## 清空数组

- Array.prototype.splice(0)
- [1,2,3].length=0

## 数组去重

- Array.from(new Set([1,1,2,3]))
- Array.filter + 元素不同

## 两数组求交集

- Array.filter + includes 判断
  - 性能问题：includes 消耗较大
  - 引用对象判断问题
- 引用类型：Array.prototype.forEach + map + key 唯一

  ```js
  // 引用数据类型
  function foo(arr1, arr2, key) {
    const map = new Map();
    arr1.forEach((val) => {
      map.set(val[key]);
    });
    return arr2.filter((val) => map.has(val[key]));
  }
  ```

- 基础类型：Array.prototype.forEach + map + filter

  ```js
  // 基础数据类型
  function foo(arr1, arr2) {
    const map = new Map();
    arr1.forEach((val) => {
      map.set(val);
    });
    return arr2.filter((val) => map.has(val));
  }
  ```

## 去除无效值/虚值

```js
const array = [false, true, 0, '', undefined, NaN, null, 'test'];
array.filter(Boolean); // [false,true,'test']
```

## 获取数组中的最大最小值

- Math.max.apply(Math,array)
- Math.min.apply(Math,array)
