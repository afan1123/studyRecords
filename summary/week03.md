# BOM

## window

- 定义：
  - 是一个包含文档的窗口，表示浏览器窗口以及页面可见区域
  - 全局对象，全局变量和函数均是它的属性方法
  - 全局变量

### window.window

主要是为了方便使用 this，this===window===window.window

### window.isSecretContext

- 返回一个 boolean，标识当前上下文是否安全，安全为 true，否则为 false
- 适用场景：判断网页是不是使用 https 协议
- 注意点： http://127.0.0.1，http://localhost，http://*.localhost，file://...，地址均返回true

### screenX 和 screenY

- 定义：浏览器距离左和上的屏幕边距

### 尺寸

- innerWidth 和 innerHeight
  - 定义：可视化区域的宽高
- outerWidth 和 outerHeight
  - 定义：窗口外层的宽高
    <img src='/images/05.png'/>

### iframe 嵌套

#### window,self,this,parent,top

- self === window
- this 全局上下文/全局作用域下等于 window
- parent：父窗口（无父窗口，parent === self === window）
- top：顶级窗口，最外层窗口

#### open，opener

##### open

- 定义：可以打开一个新空白窗口或者指定地址的新窗口

```js
// 语法
const windowObjectRefrence = window.open(strUrl, strWindowName, [
  strWindowFeatures,
]);
```

##### opener

- 定义：返回当前窗口的引用
- 注意：要是同源，可以直接调用其窗体的方法

### 判断窗体可见性

- focus + blur 事件

```js
window.addEventListener('focus', function () {
  console.log('focused');
});
window.addEventListener('blur', function () {
  console.log('blured');
});
```

- document.hidden
  - 返回 boolean，表示页面是否隐藏
- document.visibilityState
  - 返回 doucment 的可见性，可知当前文档/页面是不可见的隐藏标签页，或者是正在预渲染
  - 可用值：'visbile'，'hidden'，'prerender'

### 分辨率

#### window.devicePixelRatio

- 定义：返回当前显示设备的物理像素分辨率与 CSS 像素分辨率之比
- 物理像素：设备能控制显示的最小单位，是设备屏幕上的像素点个数
- 逻辑像素：设备独立像素，设备上的物理像素和逻辑像素不相等，物理像素一般大于逻辑像素，比值是 devicePixelRatio

### 滚动

#### scrollTo()，scrollBy()，scroll()

| 方法名         | 作用           | 拥有此方法的对象 |
| -------------- | -------------- | ---------------- |
| scroll         | 滚动到指定位置 | Window，Element  |
| scrollTo       | 滚动到指定位置 | Window，Element  |
| scrollBy       | 滚动到指定位置 | Window，Element  |
| scrollInfoView | 滚动到指定区域 | Element          |

#### 其他

- 设置 scrollTop，scrollLeft 等
- 设置锚点 <a href='#div'> <div id='div'></div>

### window.matchMeida

- 作用：可用于判断 document 是否匹配媒体查询
- 监控一个 document 来判定它匹配了或者停止匹配了此媒体查询

```js
<div>
  (min-width: 600px)
  <span style="color: red;" id="mq-value"></span>
</div>;
// 语法
const mql = window.matchMedia('(min-width: 600px)');
document.querySelector('#mq-value').innerText = mql.matches;

// 监听变化
mql.addEventListener('change', function () {
  const mql = window.matchMedia('(min-width: 600px)');
  document.querySelector('#mq-value').innerText = mql.matches;
});
```

### window.getSelection

- 定义：表示用户选择的文本范围或者光标的当前位置
- 可使用 document.activeElement 来返回当前的焦点元素
- 等价方法：document.getSelection()

## window.iframeElement

- 定义：返回嵌入当前 window 对象的元素，如果当前 window 对象已经是顶层窗口，则返回 null
- 使用场景：使用 window.iframeElement 获取 iframe 节点，获取其 src 属性，实现调整

### 网络状态

#### navigator.online

- 定义：返回 boolean，判断是否上线

#### window.onoffline

- 定义：下线事件

#### window.ononline

- 定义：上线事件

### window.print

- 定义：打开打印对话框打印文档

## 跨窗口传递信息

### 同源策略

- 定义：同协议 + 同域名 + 同端口号

### websocket

- 定义：引入第三者进行中转
  <img src='/images/06.png'/>
- 缺点：引入服务端

### 定时器+客户端存储

- 思路：本地存储 + 本地轮询
- 客户端存储：
  - cookie
  - localStorage
  - indexDB
  - chrome 的 fileSystem
- 缺点：
  - 可能会受到副作用：cookie 增加负担，fileSystem 需要清理
  - 不够及时
  - 受限于同源策略

### postMessage

- 思路：用某种手段建立窗口间的联系，通过 postMessage 进行跨窗口通信
- 优点：不受同源策略影响
- 缺点：必须拿到对应窗口的引用

```js
// 核心代码
<iframe id='ifr'></iframe>
window.addEventListener('message', function (event) {
  console.log(event);
  ...
});
ifr.contentWindow.postMessage('123')
```

### storageEvent

- sessioStorage/localStorage
- 思路：当前页面的 storage 被其它页面修改，触发 storageEvent 事件
- 缺点：
  - 传递的数据大小有限制
  - 可能需要进行清理工作
  - 受限于同源策略
  - 同窗口不能监听

```js
// 核心代码
window.addEventListener('storage',function(ev){
console.log(ev);
...
})
```

### broadcastChannel

- 优点：允许同源的不同浏览器窗口，tab 页，frame 或 iframe 下的不同文档之间相互通信
- 缺点：受限于同源策略

```js
// 核心代码
// page1
var channel1 = new BroadcastChannel('channel-BroadcastChannel');
channel1.postMessage('page1-channel');
// page2
var channel2 = new BroadcastChannel('channel-BroadcastChannel');
channel2.addEventListener('message', function (event) {
  console.log(event);
});
```

### messageChannel

### sharedWorker

- 优点：不同页面可以共享这个 worker
- 缺点：兼容性，同源策略

### 汇总对比

| 方法方式          | 是否需要强关联 | 遵守同源策略 | web worker 可用    |
| ----------------- | -------------- | ------------ | ------------------ |
| webSocket         |                |              | √                  |
| 定时器+客户端存储 |                |              | indexedDB          |
| postMessage       | √              |              | 自己的 postMessage |
| storageEvent      |                | √            |
| broadcastChannel  |                | √            | √                  |
| messageChannel    | √              |              | √                  |
| sharedWorker      |                | √            | √                  |

## location

<img src='/images/07.png'/>

```js
// 修改属性值
window.loaction.protocol = 'http';
window.loaction.host = 'www.baidu.com:8080';
window.loaction.hostname = 'www.baidu.com';
window.loaction.prot = '8081';
window.loaction.search = 'username=123';
window.loaction.hash = '/home';
window.loaction.href = 'http://www.baidu.com';
```

- 修改属性注意点：
  - location.origin 是只读的，存在兼容问题
  - 除 hash，其他任意属性修改都会以新 URL 重新加载，会生成一条新的历史记录
  - 修改 pathname 不用传开头的'/'，修改 search 不用传？，修改 hash 不用传#
- 访问 location 对象的方式:
  - window.location
  - document.location
  - window.document.location
  - location

### href

- 定义：整个 url 的 string 形式
- 作用：用新的域名页替换当前页，不会打开新的标签页，会生成一条新的浏览记录

### protocol

- 定义：协议，一般为 http，https

### host

- 定义：主机名，包含端口

### hostname

- 定义：主机名

### port

- 定义：端口号

### pathname

- 定义：url 中的路径部分，开头包含/

### search

- 定义：url 中的搜索字符串部分，开头包含？

### hash

- url 中的 hash 字符串，包含#
- 事件：
  - window.onhashchange = func(){}
  - window.addEventListener('hashchange',func,false)
  - <body onhashchange='func()'>

### username

- 定义：url 域名前的用户名

### password

- 定义：url 域名前的密码

### origin

- 定义：域名来源，url 中？前面的部分

### reload

- 定义：重新加载当前文档
- 参数：
  - false 或者不传，浏览器可能从缓存中读取页面
  - true，强制从服务器重新下载文档

### replace

- 作用：不会增加历史记录

### toString

- 作用：返回 url 的 href 字符串

### URL.searchParams

- append()：输入一个指定的键值对
- delete()：从搜索参数列表中，指定删除某个键值对
- entries()：返回一个 iterator，可以遍历所有键值对的对象
- get()：获得指定搜索参数的值
- getAll()：获取指定参数的所有值，返回一个数组
- keys()：返回 iterator，此对象包含所有键名
- set()：设置一个搜索参数键值
- sort()：按键名排序
- has()：判断是否有指定的搜索参数
- toString()：返回搜索参数的组成的字符串
- values()：返回 iterator，此对象包含所有的 value

### encodeURL 与 encodeURLComponent 系列

- 定义：都是编码 URL，区别就是编码的字符范围不同
- encodeURLComponent 不编码字符：A-Za-z0-9-\_.!~\*'()
- encodeURL 不编码字符：A-Za-z0-9-\_.!~\*'()#;,/?:@&=+$

## navigator

### userAgent

- 定义：浏览器对当前用户的代理字符串
- 适用场景：
  - 试别是否是微信内置浏览器/设备

### onLine

- 定义：网络在线状态
- 适用场景：
  - 结合 document.ononline 与 document.onoffline 监听网络变化

### clipboard

- 定义：返回剪切版对象
- 注意点：
  - 必须是安全上下文（wss，https，local），需要用 window.isSecureContext 检测安全上下文

### cookieEnabled

- 定义：检查是否启用 cookie

### mediaDevices

- 定义：获取媒体信息设备
- 适用场景：
  - H5 调用摄像头试别二维码，共享屏幕等等

### serviceWorker

- 定义：返回关联文件的 serviceWorkerContainer 对象
- 只能在安全上下文操作
- 适用场景：
  - 后台数据同步
  - 集中处理计算成本高的数据更新
  - 性能增强，用于预获取用户需要的资源
  - 提供离线访问能力

### storage

- 定义：返回 storageManager 对象，用于访问浏览器的整体存储能力
- 必须是安全上下文
- 适用场景：
  - 获取 storage 的存储大小以及可分配大小

### sendBeacon

- 定义：可靠的数据上传，通过 httpPost 将少量的数据异步传输到 web 服务器
- 适用场景：
  - 将统计数据上传到 web 服务器，避免传统技术的问题

### mediaSession

- 定义：返回 MediaSession 对象，用来与浏览器共享媒体信息，如，播放状态，标题等
- 适用场景：
  - 通知栏自定义媒体信息

### connection

- 定义：设备网络信息
- 适用场景：
  - 获取当前用户的宽带信息，如网络类型，下载速度等

### permessions

- 定义：返回权限对象
- 适用场景：
  - 获取权限信息，如，位置信息

## history

### 历史记录本质也是一个栈

### history.back

- 定义：向后跳一页

### history.forward

- 定义：向前跳一页

### history.go

- 定义：指定跳页数
- 注意：如果不传参，就刷新页面，等于 reload

### history.length

- 定义：历史记录条数

### history.pushState

- 定义：向当前浏览器会话的历史堆栈中添加一个状态
- 会增加历史访问记录，但不会改变页面的内容

### history.replaceState

- 定义：修改当前历史记录状态
- 是替换浏览器栈顶的记录，不会增加栈的深度
- 新 url 和旧 url 必须是同源

### history.state

- 定义：返回会话栈顶的状态值的拷贝

### window.onpopstate

- 定义：当活动历史记录条目更改时，将触发 popstate 事件
- pushState 和 replaceState 不会触发 popstate 事件
- 只会在浏览器的行为下触发，如前进、后退按钮

## 实现一个 router

- 思路：自定义标签-->业务组件-->动态切换路由
  - 自定义标签：webComponents
  - 业务组件：webComponents
  - 监听路有变化：popstate + 自定义事件 pushState + replaceState
- 架构图
  <img src='/images/08.png' />

```js
const oriPushState = history.pushState;
// 重写pushState
history.pushState = function (state, title, url) {
  // 触发原事件
  oriPushState.apply(history, [state, title, url]);
  // 自定义事件
  var event = new CustomEvent('c-popstate', {
    detail: {
      state,
      title,
      url,
    },
  });
  window.dispatchEvent(event);
};

//  <c-link to="/" class="c-link">首页</c-link>
class CustomLink extends HTMLElement {
  connectedCallback() {
    this.addEventListener('click', (ev) => {
      ev.preventDefault();
      const to = this.getAttribute('to');
      // 更新浏览器历史记录
      history.pushState('', '', to);
    });
  }
}
window.customElements.define('c-link', CustomLink);

// 优先于c-router注册
//  <c-route path="/" component="home" default></c-route>
class CustomRoute extends HTMLElement {
  #data = null;
  getData() {
    return {
      default: this.hasAttribute('default'),
      path: this.getAttribute('path'),
      component: this.getAttribute('component'),
    };
  }
}
window.customElements.define('c-route', CustomRoute);

// 容器组件
class CustomComponent extends HTMLElement {
  async connectedCallback() {
    console.log('c-component connected');
    // 获取组件的path，即html的路径
    const strPath = this.getAttribute('path');
    // 加载html
    const cInfos = await loadComponent(strPath);
    const shadow = this.attachShadow({ mode: 'closed' });
    // 添加html对应的内容
    this.#addElements(shadow, cInfos);
  }

  #addElements(shadow, info) {
    // 添加模板内容
    if (info.template) {
      shadow.appendChild(info.template.content.cloneNode(true));
    }
    // 添加脚本
    if (info.script) {
      // 防止全局污染，并获得根节点
      var fun = new Function(`${info.script.textContent}`);
      // 绑定脚本的this为当前的影子根节点
      fun.bind(shadow)();
    }
    // 添加样式
    if (info.style) {
      shadow.appendChild(info.style);
    }
  }
}
window.customElements.define('c-component', CustomComponent);

//  <c-router>
class CustomRouter extends HTMLElement {
  // 私有变量
  #routes;
  connectedCallback() {
    // const shadow = this.attachShadow({ mode: "open" });
    const routeNodes = this.querySelectorAll('c-route');
    // debugger;
    console.log('routes:', routeNodes);

    // 获取子节点的路由信息
    this.#routes = Array.from(routeNodes).map((node) => node.getData());
    // 查找默认的路由
    const defaultRoute = this.#routes.find((r) => r.default) || this.#routes[0];
    // 渲染对应的路由
    this.#onRenderRoute(defaultRoute);
    // 监听路由变化
    this.#listenerHistory();
  }

  // 渲染路由对应的内容
  #onRenderRoute(route) {
    var el = document.createElement('c-component');
    el.setAttribute('path', `/${route.component}.html`);
    el.id = '_route_';
    this.append(el);
  }

  // 卸载路由清理工作
  #onUnloadRoute(route) {
    this.removeChild(this.querySelector('#_route_'));
  }

  // 监听路由变化
  #listenerHistory() {
    // 导航的路由切换
    window.addEventListener('popstate', (ev) => {
      console.log('onpopstate:', ev);
      const url = location.pathname.endsWith('.html') ? '/' : location.pathname;
      const route = this.#getRoute(this.#routes, url);
      this.#onUnloadRoute();
      this.#onRenderRoute(route);
    });
    // pushState或者replaceState
    window.addEventListener('c-popstate', (ev) => {
      console.log('c-popstate:', ev);
      const detail = ev.detail;
      const route = this.#getRoute(this.#routes, detail.url);
      this.#onUnloadRoute();
      this.#onRenderRoute(route);
    });
  }

  // 路由查找
  #getRoute(routes, url) {
    return routes.find(function (r) {
      const path = r.path;
      const strPaths = path.split('/');
      const strUrlPaths = url.split('/');

      let match = true;
      for (let i = 0; i < strPaths.length; i++) {
        if (strPaths[i].startsWith(':')) {
          continue;
        }
        match = strPaths[i] === strUrlPaths[i];
        if (!match) {
          break;
        }
      }
      return match;
    });
  }
}
window.customElements.define('c-router', CustomRouter);

// 动态加载组件并解析
async function loadComponent(path, name) {
  this.caches = this.caches || {};
  // 缓存存在，直接返回
  if (!!this.caches[path]) {
    return this.caches[path];
  }
  const res = await fetch(path).then((res) => res.text());
  // 利用DOMParser效验
  const parser = new DOMParser();
  const doc = parser.parseFromString(res, 'text/html');
  // 解析模板，脚本，样式
  const template = doc.querySelector('template');
  const script = doc.querySelector('script');
  const style = doc.querySelector('style');
  // 缓存内容
  this.caches[path] = {
    template,
    script,
    style,
  };
  return this.caches[path];
}
```

# http

## HTTP 基础

### http 简介

- 定义：超文本传输协议

### HTTP0.9

- 特征：
  - 仅仅支持 get 请求
  - 不包含 http 头，只能传输 html 文件
  - 没有状态码或错误码

### HTTP1.0

- 特征：
  - 会添加协议信息
  - 添加响应状态码
  - 引入 http 头，多了传递信息手段
  - http 引入 content-type 属性，具备了传输除纯文本 html 文件以外其他类型文档的能力

### HTTP1.1

- 特征：
  - 连接复用，长连接。多个请求可以复用一个 tcp 连接。1.0 每次请求都需要重新建立连接。
  - 管道化技术。多个连续请求甚至不用等待立即返回就可以被发送，这样就减少了好给在网络上延迟的时间
  - 支持响应分块。单个请求返回部分内容
  - 新的缓存控制机制。cache-control，eTag，强制缓存，协商缓存
  - 新增 host 请求头。不同的域名能够配置在同一个 ip 地址的服务器上

### HTTP1.X 报文

### 常见状态码

#### 信息响应

- 101 协议切换

#### 成功响应

- 200 请求成功
- 204 请求成功，不返回任何内容
- 206 范围请求成功

#### 重定向

- 301 永久的重定向
- 302 临时的重定向
- 304 资源未修改

#### 客户端响应

- 400 无法被服务器理解
- 401 未授权
- 403 禁止访问
- 404 未找到资源
- 405 禁止使用该方法

#### 服务端响应

- 500 服务端异常
- 503 服务不可达

### header 头

#### 请求头

- Accept
  - 定义：告知（服务端）客户端可以处理的内容类型。
  - 示例：text/html，application/xhtml+xnl，application/xml；q=0.9，_/_;q=0.8
- Accept-Encoding
  - 定义：客户端能够理解的内容编码方式
  - 示例：gzip，defalte
    -Accept-Language
  - 定义：客户端可以理解的语言
  - 示例：zh-CN，zh;q=0.9,en;q=0.8
- Cathe-Control
  - 定义：表示浏览器的缓存方式
  - 示例：Cathe-Control：max-age<=seconds
- Cookie
  - 定义：cookie 信息
- Connection：
  - 定义：是否是长连接
  - 示例：keep-alive
- Content-Type
  - 定义：实际发送的数据类型
  - 示例：content-type:application/x-www.xxx-form
- Host
  - 定义：要发送到服务器的主机名和端口号
  - 示例：www.baidu.com
- User-agent
  - 定义：用户代理。包含应用类型、操作系统、软件开发商以及版本号等
- Refer
  - 定义：当前请求来源页面的地址

#### 响应头

- Date
  - 定义：服务器响应的时间
- Connection
  - 定义：是否会关闭网络连接
  - 示例：Connection：keep-alive
- Keep-Alive
  - 定义：空闲连接需要保持打开状态的最小时长和最大请求次数
  - 示例：Keep-Alive：timeout=5,max=10（空闲时长 5 秒，最多接受 10 次请求就断开）
- Content-Encoding
  - 定义：内容编码方式
  - 示例：Content-Encoding:gzip
- Content-Length
  - 定义：报文中实体主体的字节大小
  - 示例：Content-Length：1963
- Content-Type
  - 定义：内容的内容类型
  - 示例：Content-Type：text\html：charset=utf-8
- Server
  - 定义：服务器所用到的软件相关信息
  - 示例：Server:openresty
- Set-Cookie
  - 定义：向客户端发送 cookie

### content-type

#### application/x-www-form-urlencoded

```js
fetch('/urlencoded', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded',
    body: 'name=jack&age=18',
  },
});
```

#### multipart/form-data

```js
// 核心代码
const formData = new FormData();
formData.append('name', 'jack');
fetch('/multipart', {
  method: 'POST',
  body: formData,
});
```

#### application/json

```js
// 核心代码
fetch('/json', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body.JSON.stringify({name:'jack',age'18'})
});
```

### https

- 定义：超文本传输安全协议
- 是 http 的一种拓展，使用传输层安全性（TLS）和安全套接字层（SSL）对通信协议进行加密

- HTTP + SSL（TLS）= HTTPS

### http2

- 二进制帧
- 多路复用
- 头部压缩
- 服务器推送

### http3

- 基于 UDP 传输层协议，快

## Ajax 与 fetch

### Ajax

- 定义：并不是一种技术，而是多种现有技术的
  集合，实现五页面刷新的数据获取

#### XMLHttpRequest 属性

- readyState：返回 XHR 代理当前所处的状态
- status：返回响应的状态码，请求之前为 0，成功为 200
- statusText：服务器返回的状态码文本
- timeout：指定 ajax 超时时长
- response：服务器响应的内容
- responseText：服务器响应内容的文本形式
- responseType：响应的类型
- responseXML：xml 形式的响应数据
- responseURL：ajax 最终请求的 url，存在重定向，就是重定向后的 url
- upload：表示上传进度
- withCredentials：用来指定跨域请求是否应当带有授权信息，如 cookie
- abort：如果请求已经发出，立刻终止请求
- getAllResponseHeader：获取所有响应头
- getResponseHeader：获取指定的响应头文本字符串
- open：初始化一个请求
- overrideMimeType：指定一个 MIME 类型
- send：发送请求
- setRequestHeader：设置请求头

#### XMLHttpRequest 事件

- onreadystatechange/readystatechange：readystate 属性发生变化
- ontimeout/timeout：在预设时间内没收到响应触发
- onabort/abort：request 被停止时触发
- onloadstart/loadstart：接收到响应数据时触发
- onload/load：请求成功完成触发
- onloadend/loadend：请求结束触发，无论请求成功与否
- onerror/error：请求遇到错误时触发
- onprogress/progress：当请求收到更多数据时，周期性触发

#### XMLHttpRequest 使用

```js
function myXHR() {
  const xhrObj = new XMLHttpRequest();
  xhrObj.onreadystatechange = function () {
    // readystate == 4 && status == 200 代表成功
    if (xhrObj.readystate == 4 && xhr.status == 200) {
      console.log(xhrObj.responseText);
    }
    // 发送请求，true：异步；false：同步
    xhrObj.open('post', 'http://127.0.0.1:3000/xhr', true);
    // 设置请求，携带header
    xhrObj.setRequestHeader(
      'Content-Type',
      'application/x-www-form-urlencoded'
    );
    xhrObj.send('xhr=1');
  };
}
```

#### 缺点

- 回调地狱
- 不符合关注点的分离原则

### fetch

#### 优点

- Promise 语法，解决了回调地狱问题
- 更合理的设计，分离 request,response 等通用对象
- 前端可拦截 301，302 等跳转
- 支持数据流（stream），方便处理大文件
- 方法简单

#### 缺点

- 缺少中断请求
- 缺少直接获取请求传输进度的能力，例如 xhr 的 onProgress 事件
- 不支持超时，需要用 setTimeout 自己封装
- 同源携带 cookie，不同源不携带 cookie
- 错误不会被拒绝，不会触发 promise 的 reject 回调

## 同源策略和跨域请求

### 同源

- 定义：同源策略限制了不同源之间如何进行资源交互，是用于隔离潜在恶意文件的重要安全机制
- 同源：同协议 + 同域名 + 同端口
- 非同源受限的场景：
  - 存储：localStorage，sessionStorage，indexDB
  - dom 获取受限
  - 发送 ajax 受限

### 跨域网络访问

- 跨域读写操作一般被允许，如：a 标签，重定向，表单提交
- 跨域资源嵌入一般被允许，如：script，link，img，video，object，iframe 等等

### 跨文档/窗口交流

### 同源解决方案

#### JSONP

- 原理：结局浏览器允许 script 标签跨域嵌套，执行回调
- JSONP 步骤：
  - script 标签 url 携带回调函数名称
  - 后端解析 queryString，获取回调函数名称
  - 将数据传入回调函数，返回字符串
  - 客户端拿到结果，浏览器自动执行
- 缺点：
  - 只支持 get 请求，不支持 post 等其他类型 Http 请求
  - JSONP 存在明显安全问题

#### CORS

- 定义：跨域资源共享，是一种基于 HTTP 头的机制，该机制通过允许服务器标识除了他自己以外的其他 origin（域名，西医，端口），这样浏览器可以访问加载这些资源.
- CORS 相关响应头：
  - Access-Control-Allow-Origin：允许访问该资源的外域 URL
  - Access-Control-Max-Age：预检请求的结果能被缓存多久
  - Access-Control-Expose-Headers：服务器把允许浏览器访问的响应头放入白名单
  - Access-Control-Allow-Methods：服务器支持的所有跨域请求的方法
  - Access-Control-Allow-Headers：请求头所有支持的首部字段列表
  - Access-Control-Allow-Credentials：是都可以使用 credentials
- CORS 相关请求头：
  - Origin：预检请求或实际请求的源站，不包含路径信息，只有服务器名称
  - Access-Control-Request-Method：将实际使用的 HTTP 方法告诉服务器，用于预检请求
  - Access-Control-Request-Headers：将实际请求携带的 header 字段告诉服务器，用于预检请求

##### 简单请求

- 条件
  - 使用以下方法之一：
    - get
    - post
    - head
  - 处理用户自动代理的字段，只允许使用 header 的以下字段
    - Accept
    - Accpet-Language
    - Content-Language
    - Content-Type
      - text/plain
      - multipart/form-data
      - application/x-www-form-urlencoded
    - range
  - 请求中 XMLHttpRequest 对象没有注册任何事件监听器
  - 请求中没有使用 ReadableStream 对象

##### 复杂请求

- 区别：复杂请求比简单请求会多发一个预检请求
- 需要预检查的请求，必须使用 OPTIONS 方法发起一个预检请求到服务器，查看服务器是否允许发送实际请求

##### CORS 适用场景

- XMLHttpRequest 或 Fetch API 发起的跨源 HTTP 请求
- Web 字体，字体网站设置跨站调用
- WebGL 贴图
- 使用 drawImage 或 Images/video 画面会知道 canvas
- 来自图像的 CSS 图形

#### 正向代理

- cli 工具（webpack 配置 devServer proxy）
- 代理软件，本质是拦截请求代理

#### 反向代理

- nginx

#### websocket

- 客户端和服务端之间存在持久的连接，而且双方可以随时开始发送数据

# http

## 文件上传以及取消请求

### 请求取消

#### XMLHttpRequest.abort()

#### fetch 的 AbortController 的 abort()

### 文件上传（单个）

#### 文件上传步骤

1. input 标签选择文件/拖拽文件获取文件/复制到剪切板获取文件
2. File Api 获取文件信息
3. XMLHttpRequest 上传/Fetch 上传
4. 上传数据：FormData/Blob 等，服务器端：formData 使用 multipart/form-data

#### 上传单个文件-客户端

```js
// type类型为file，用户选择文件
// accept属性，规定选择文件的类型
<input id="uploadFile" type="file" accept="image/*"></input>
```

- accept 类型
  - 文件拓展名（.jpg，.png，.doc）
  - 一个有效的 MIME 类型文件，但没有拓展名（text/html，video/mp4）
  - audio/\* 表示音频文件
  - video/\* 表示视频文件
  - image/\* 表示图片文件

#### 上传单个文件-服务端

- 客户端使用 form-data 传递，服务器以相同方式接受
- multer 库用来处理 multipart/form-data

#### 上传单个文件-客户端

1. 设置文件存储目录
2. 是否更改文件名称
3. 上传成功，通知客户端可访问的 url
4. url 的产生，需要我们启动静态目录服务（上传文件保存地址）

### 文件上传（多个）

```js
// type类型为file，用户选择文件
// accept属性，规定选择文件的类型
<input id="uploadFile" type="file" accept="image/*" multiple></input>
```

#### 文件上传-客户端-切片

```js
// file：文件
// chunkIndex：切片大小
const handleFileChunk = function (file, chunkSize) {
  const fileChunkList = [];
  // 索引值
  let curIndex = 0;
  while (curIndex < file.size) {
    // 最后一个切片以实际结束大小为准
    const endIndex =
      curIndex + chunkSize < file.size ? curIndex + chunkIndex : file.size;
    const curFileChunkFile = file.slice(curIndex, endIndex);
    curIndex += chunkIndex;
    fileChunkList.push({ file: curFileChunkFile });
  }
  return fileChunkList;
};
```

### 大文件上传

#### 文件上传-客户端-大文件 hash

```js
async function getFileHash2() {
  console.time('filehash');
  const spark = new SparkMDS.ArrayBuffer();
  // 获取全部内容
  const content = await getFileContent(file);
  try {
    spark.append(content);
    // 生成指纹
    const result = spark.end();
    console.timeEnd('filehash');
    return result;
  } catch (e) {
    console.log(e);
  }
}
function getFileContent(file) {
  return new Promise((resolve, reject) => {
    const fileReader = new FileReader();
    // 读取文件内容
    fileReader.readAsArrayBuffer(file);
    fileReader.onload = (e) => {
      // 返回读取到的文件内容
      resolve(e.target.result);
    };
    fileReader.onerror = (e) => {
      reject(fileReader.error);
      fileReader.abort();
    };
  });
}
```

## 资源加载

### 页面加载的流程

1. 页面卸载
2. DNS 解析
3. TCP 解析
4. HTTP 请求
5. 服务器响应
6. 浏览器解析

### 解析渲染的过程

<img src="./images/09.png" />

### 页面加载的时间

#### Navigation.timing API

- 作用：提供了可用于衡量网站性能的数据
  <img src='./images/10.png'>
- 各种时长：
  - 页面加载所需的总时长：loadEventEnd - navigationStart
  - 请求返回时长：reponseEnd - requestStart
  - DNS 解析时长：domainLookupEnd - domainLookupStart

### 资源加载的时间

#### Resource Timing API

- 获取和分析应用资源加载的详细网络计时数据，比如脚本，图片等

```js
// 核心代码:统计页面和资源加载性
function getPerformanceEntries() {
  var p = performance.getEntries();
  for (let i = 0; i < p.length; i++) {
    printPerformanceEntry(p[i]);
  }
}
function printPerformanceEntry(perfEntry) {
  var properties = ['name', 'entryType', 'startTime', 'duration'];
  if (perfEntry.entryType === 'navigation') {
    console.log(
      `页面：${perfEntry.name},加载时间：${
        perfEntry.responseEnd - perfEntry.requestStart
      }`
    );
  } else if (perfEntry.entryType === 'resource') {
    console.log(`资源：${perfEntry.name},加载时间：${perfEntry.duration}`);
  }
}
```

### 资源加载的优先级

- 最高级：html，css，font，同步的 XMLHttpRequest
- 中等：在可视区域的图片，script 标签，异步的 XMLHttpRequest
- 低等：图片，音视频
- 最低：prefetch 预读取的资源
- 注意点：
  - css 在 head 和 body 里面的优先级不一样
  - 可视区的图片优先级高于 js，但 js 会优先加载
  - 可推迟加载资源：图片，视频
- 自定义优先级：link，image，iframe，script 可以使用 importance 属性

### css 和 script 加载的阻塞情况

#### css 不阻塞 DOM 的解析，阻塞页面的渲染

#### js 的执行会阻塞 DOM 的解析

### 预加载系列

- preload：表示用户十分有可能在当前浏览中加载目标资源，所以浏览器必须预先获取和缓存对应资源。
- prefetch：是为了提示浏览器，用户未来的浏览有可能需要加载目标资源，所以浏览器有可能通过事先获取和缓存对应资源，优化用户体验。主要用于预取将在下一次导航/页面加载中使用的资源。
- prerender：内容被预先取出，然后在后台被浏览器渲染，就好像内容已经被渲染到一个不可见的单独的标签页。
- preconnect：预先建立连接（TCP）
- dns-prefetch：
  - 定义：尝试在请求资源之前解析域名
  - 使用：<link rel='dns-prefetch' href='wwww.baidu.com'></link>

```js
// 预加载，优先级高
<link rel='preload' href='www.baidu.com'></link>
// 资源预加载，优先级低
<link rel='prefetch' href='www.baidu.com'></link>
// DNS预解析
<link rel='dns-prefetch' href='www.baidu.com'></link>
// 预连接，建立tcp连接
<link rel='preconnect' href='www.baidu.com'></link>
// 预渲染，预先加载链接文档的资源
<link rel='prerender' href='www.baidu.com'></link>
```

### 图片加载

#### 压缩图片

#### 选择合适的图片格式，优先 jpg 和 webp 格式

#### CDN

#### dns-prefetch

#### 图片多的话，放不同域名，提高并发数

#### 大图 png 交错，jpg 渐进式提高视觉体验

#### 懒加载，intersectionObserve 进入可视区再加载图片

## 资源加载器的设计与实现

### 资源加载器

- 定义：通过程序加载资源（css，js，视频等），以便之后重复利用
- 基本原理：
  - 发送请求获取资源
  - 用 key 标记资源
  - URL.createObjectURL 生成 url，以便复用
- 需要完善的缺陷：
  - 没有显示的版本问题
  - 没有缓存
  - 资源没有
- 改进内容：
  - 支持版本：用属性字段标记版本
  - 支持缓存：indexDB
  - 支持依赖关系：一个字段标志前置依赖，比如：vue-cli...
- 资源加载器组成
  - util：工具方法
  - idb.js：文件存储
  - class Emitter：事件中心
  - class CacheManger：缓存管理
  - class ResourceLoader：资源加载和管理

### 流程图

<image src='./images/11.png'>
