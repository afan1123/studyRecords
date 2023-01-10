# js 重难点精选

## 基础篇

### 数据类型

#### null 和 undefined

| 重点                                   | 原因                                                           |
| -------------------------------------- | -------------------------------------------------------------- |
| typeof null === 'object'               | typeof 的原理利用类型二进制进行比较，null 是 000 object 是 000 |
| null == undefined                      | undefined 派生自于 null                                        |
| Number(undefined)==NaN Number(null)==0 |                                                                |

### Boolean

| 转换类型  | 转换结果               |
| --------- | ---------------------- |
| String    | 只有空字符串为 false   |
| Number    | 只有 0 和 NaN 为 false |
| null      | false                  |
| undefined | false                  |
| Function  | true                   |
| Object    | true                   |

### Number

#### Object 转化成 Number

1. Symbol.Primitive：若存在，则优先调用，且无视 valueof 和 toString 方法
2. valueOf：若期望值是 number 或者 default，则先调用。若返回值不是原始值，则调用 toString
3. toString：若期望值是 string ，则先调用。若返回值不是原始值，则调用 valueOf

- 注意：
  - 原始值：undefined,null,boolean,number,string
  - 期望值：
    - String：``模板字符串，test[obj]=123
    - Number：一元+，位移，关系运算符，加减乘除，Array 的内部方法
    - Default：二元+，==，!=
  - 其他：
    - ==，!=的情况下，只有一侧是对象的情况下才会隐式转换

#### parseInt函数

- 作用：解析字符串，返回一个指定基数的整数值
- 语法：parseInt(string,radix)
  - string：要解析的字符串
  - radix：进制转换的基数，范围2~36，默认值10
- 注意：
  - 如果没有转成整数，则为NaN
  
- 举例
  - parseInt(6e3,10):6000
  - parseInt(6e3,16):先转化6000，再 6*16的三次方=24576
  - parseInt('6e3',10):6（e到最后不能解析）
  - parseInt('6e3',16):6*16²+14*16+3=1763
- map与parseInt坑
  - ```js

  ['1','2','3','4'].map(parseInt)
  // 等同于
  ['1','2','3','4'].map((item,index)=>{
    // parseInt('1',0) // 任何0进制的都返回0
    // parseInt('2',1) // 基数只能取2~36，所以返回NaN
    // parseInt('3',2) // 2进制只有取0和1，没有2，所以返回NaN
    // parseInt('4',3) // 同上，所以返回NaN
    return parseInt(item,index)
  })
  ```

#### isNaN()与Number.isNaN()

##### isNaN

- 作用：判断能不能转换为数字，能则返回false，不能则返回true（ES5）
- 举例：
  - isNaN({}):true
  - isNaN(undefined):true
  - isNaN(1):false

##### Number.isNaN()

- 作用：判断数值是否为NaN，是则返回true，不是则返回false (ES6)
- 举例：
  - Number.isNaN({}):false
  - Number.isNaN(undefined):false
  - Number.isNaN(NaN):true

##### 兼容

```js
if(!Number.isNaN){
  Number.isNaN=function(n){
    // 只用NaN才会不等于自身
    return n!==n
  }
}
```

### 表达式

### 循环结构

### 内置对象的常用方法

### 函数基础

### DOM 相关操作、事件

## 核心篇

### 原型、原型链

### 作用域

### 闭包

### this

### 继承

### Ajax

### ES6

## 模块化以及组件化
