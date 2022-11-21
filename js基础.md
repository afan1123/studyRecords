# 11-21~11-27

## 1、数据类型

### 基本数据类型

- string
- number
- boolean
- undefined
- null
- symbol

### 引用数据类型

- object
- array
- function
- date
- ...

#### 区别：

| 不同         | 基本数据类型                 | 引用数据类型                              |
| ------------ | ---------------------------- | ----------------------------------------- |
| 存储方式     | 栈                           | 堆                                        |
| 复制方式     | 复制值（完全独立）           | 复制地址（指针相同）                      |
| 访问方式     | 按值访问                     | 按地址访问                                |
| 判断类型方式 | typeof（数组和对象不能区分） | instanceof/Object.prototype.toString.call |
