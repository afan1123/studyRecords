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
