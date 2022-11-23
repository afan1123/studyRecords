# DOM、BOM

## BOM

### Window 对象

- 定义：一是全局上下文，二是浏览器实例
- 窗口：

  ```
  // 窗口移动(相对当前位置进行移动)
  window.moveBy()
  // 窗口移动(绝对的像素移动)
  window.moveTo()
  // 像素比：用来适配不同的手机屏幕像素，表示物理像素与逻辑像素之间的比例
  window.devicePixelRatio

  // 窗口大小(包括工具栏、导航栏)
  outerWidth/outerHeight
  // 可视区域大小（包含滚动条，不包括工具栏、导航栏）
  innnerWidth/innerHeight
  // 可视区域大小（不包含滚动条，不包括工具栏、导航栏）
  document.documentElement.clientHeight/document.documentElement.clientHeight
  // 网页的body大小
  document.body.clientHeight/document.body.clientWidth

  // 视口位置
  // 相对当前视口滚动距离
  window.scrollBy()
  // 滚动到绝对位置
  window.scrollTo()
  // 返回文档在窗口左上角水平和垂直方向滚动的像素
  window.pageXOffset/pageYOffset
  // 返回滚动条滚动的距离
  window.scrollX/window.scrollY
  ```
