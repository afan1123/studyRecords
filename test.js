class TestItem extends HTMLElement {
  constructor() {
    super();
  }
  connectedCallback() {
    const content = document.getElementById('tpl-test').content.cloneDeep(true);
    this.append(content); // 不生效
    const shadow = this.attachShadow({ mode: 'open' });
    shadow.append(content);
  }
}
window.customElements.define('test-item', TestItem);
