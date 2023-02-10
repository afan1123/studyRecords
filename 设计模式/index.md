### 单例模式

- 定义：保证一个类仅有一个实例，提供一个访问它的全局访问点。
- 举例：
  - 线程池
  - 全局缓存
  - 浏览器的 window
  - 点击按钮弹出一个浮窗

#### 简单的单例模式

- 实现：

  - ```js
    // 简单的单例模式
    var Singleton = function (name) {
      this.name = name;
      this.instance = null;
    };
    Sigleton.prototype.getName = function () {
      console.log(this.name);
    };
    Singleton.getInstance = function (name) {
      if (!this.instance) {
        this.instance = new Singleton(name);
      }
      return this.stance;
    };
    var a = Singleton.getInstance('jack');
    var b = Singleton.getInstance('rose');
    console.log(a === b); // true
    ```

- 缺点：
  - 增加了不透明性，因为跟一般通过 new 的方式来创建对象的方式不同

#### 透明的单例模式

- 实现：

  - ```js
    // 在页面中创建一个唯一的div节点
    var CreateDiv = (function () {
      var instance;
      var CreateDiv = function (html) {
        if (instance) {
          return instance;
        }
        this.html = html;
        this.init();
        return (this.instance = this);
      };
      CreateDiv.prototype.init = function () {
        var div = document.createElement('div');
        div.innerHtml = this.html;
        document.body.appendChild(div);
      };
      return CreateDiv;
    })();
    var a = new CreateDiv('div1');
    var b = new CreateDiv('div2');
    console.log(a === b); // true
    ```

- 增加程序复杂度，构造函数负责两件事：1、创建对象和执行 init 函数，2、保证只有一个对象，不符合单一职责原则

#### 用代理实现单例模式

- 实现

  - ````js
        // 在页面中创建一个唯一的div节点
        var CreateDiv=function(html){
          this.html = html;
          this.init();
        }
        CreateDiv.prototype.init=function(){
           var div = document.createElement('div');
            div.innerHtml = this.html;
            document.body.appendChild(div);
        }
        var ProxyCreateDiv=(function(){
        var instance;
        return function(html){
          if (instance) {
              instance= new CreateDiv(html);
            }
            return instance
        }
        })()
        var a = new CreateDiv('div1');
        var b = new CreateDiv('div2');
        console.log(a === b); // true
        ```
    ````

- 优点
  - 是缓存代理的应用之一

### 策略模式

- 定义：定义一系列的算法，把它们一个个封装起来，并且使它们可以相互替换。
- 包含两部分：
  - 策略类：封装具体算法
  - 环境/上下文类：接受客户请求，随后把请求委托给某一个策略类
- 应用场景：
  - 表单校验规则
- 优点：
  - 策略模式利用组合、委托和多态思想，有效避免多重条件语句
  - 策略模式提供了对开放-封闭原则的完美支持，将算法封装在独立的 strategy 中
  - 策略模式的算法可以服用在其他地方，可复用性强

#### 简单实现

```js
// 计算奖金
function calculateBonus(level, salary) {
  if (level === 'A') {
    return salary * 3;
  }
  if (level === 'B') {
    return salary * 2;
  }
  if (level === 'C') {
    return salary * 1;
  }
}
calculateBonus('A', 1000);
calculateBonus('B', 2000);
```

- 缺点：
  - if-else 语句较多，函数较为庞大
  - 缺乏弹性，要想新增一种策略，就需要深入函数内部改写，违反开放-封闭原则
  - 复用性差

#### 组合函数改写

```js
function strategyA(salary) {
  return salary * 3;
}
function strategyB(salary) {
  return salary * 2;
}
function strategyC(salary) {
  return salary * 1;
}
function calculateBonus(level, salary) {
  if (level === 'A') {
    return strategyA;
  }
  if (level === 'B') {
    return sstrategyB;
  }
  if (level === 'C') {
    return strategyC;
  }
}
calculateBonus('A', 1000);
calculateBonus('B', 2000);
```

- 缺点：
  - 优化不足

#### 策略模式重构

```js
// 策略类
function strategyA() {}
strategyA.prototype.calculate = function (salary) {
  return salary * 3;
};
function strategyB() {}
strategyB.prototype.calculate = function (salary) {
  return salary * 2;
};
function strategyC() {}
strategyC.prototype.calculate = function (salary) {
  return salary * 1;
};
// 环境类
var Bonus = function () {
  this.salary = null;
  this.strategy = null;
};
Bonus.prototype.setSalary = function (salary) {
  this.salary = salary;
};
Bonus.prototype.setStrategy = function (strategy) {
  this.strategy = strategy;
};
Bonus.prototype.getBonus = function () {
  return this.sttrategy.calculate(this.salary);
};
// 使用
var bonus = new Bonus();
bonus.setSalary(10000);
bonus.setStrategy(new strategyA());
bouns.getBonus();
```

#### js 版本的策略模式

```js
// 在js语言种，函数也是对象，所以可以用对象表达
// 策略对象
var strategies = {
  A: function (salary) {
    return salary * 3;
  },
  B: function (salary) {
    return salary * 2;
  },
  C: function (salary) {
    return salary * 1;
  },
};
// 环境类
var calculateBonus = function (level, salary) {
  return strategies[level](salary);
};
calculateBonus('A', 2000);
```

### 代理模式

- 定义：为一个对象提供一个代用品或者占位符，以便控制对它的访问

#### 简单实现

```js
// 不用代理
var Flower = function () {};
var xiaoming = {
  sendFlower: function (target) {
    var flower = new Flower();
    target.receiveFlower(flower);
  },
};
var A = {
  receiveFlower(flower) {
    console.log('收到鲜花：', flower);
  },
};
```

```js
//使用代理
var Flower = function () {};
var xiaoming = {
  sendFlower: function (target) {
    var flower = new Flower();
    target.receiveFlower(flower);
  },
};
var B = function(flower){
receiveFlower(flower) {
    A.receiveFlower(flower)
  },
}
var A = {
  receiveFlower(flower) {
    console.log('收到鲜花：', flower);
  },
};
xiaoming.sendFlower(B);
```

```js
// 监听好心情才送花
var Flower = function () {};
var xiaoming = {
  sendFlower: function (target) {
    var flower = new Flower();
    target.receiveFlower(flower);
  },
};
var B = function(flower){
receiveFlower(flower) {
A.listenerGoodMood(function(){
 A.receiveFlower(flower)
})

  },
}
var A = {
  receiveFlower(flower) {
    console.log('收到鲜花：', flower);
  },
};
xiaoming.sendFlower(B);
```

#### 保护代理

- 定义：给代理对象过滤掉一些请求
- 应用场景：
  - 用于控制不同权限的对象对目标对象的访问

#### 虚拟代理

- 应用场景：
  - 图片过大或者网络不好，先给图片预设本地 loading 图片，异步加载完后再设置图片 src
- 实现：

  ```js
  // 基本
  var myImg = function () {
    var imgNode = document.createImg('img');
    document.body.appendChild(imgNode);
    return {
      setSrc(src) {
        imgNode.src = src;
      },
    };
  };
  myImg.setSrc('http:// imgcache.qq.com/music/photo/k/000GGDys0yA0Nk.jpg');
  // 代理
  var proxyImg = (function () {
    var img = new Image();
    img.onLoad = function () {
      myImg.setSrc(this.src);
    };
    return {
      setSrc(src) {
        myImg.setSrc('file:// /C:/Users/svenzeng/Desktop/loading.gif');
        img.src = src;
      },
    };
  })();
  proxyImg.setSrc('http:// imgcache.qq.com/music/photo/k/000GGDys0yA0Nk.jpg');
  ```

- 如果不用代理，则会导致函数臃肿脆弱，高耦合，且不符合单一职责原则
  ```js
  // 不用代理
  var MyImage = (function () {
    var imgNode = document.createElement('img');
    document.body.appendChild(imgNode);
    var img = new Image();
    img.onload = function () {
      imgNode.src = img.src;
    };
    return {
      setSrc: function (src) {
        imgNode.src = 'file:// /C:/Users/svenzeng/Desktop/loading.gif';
        img.src = src;
      },
    };
  })();
  MyImage.setSrc('http:// imgcache.qq.com/music/photo/k/000GGDys0yA0Nk.jpg');
  ```
