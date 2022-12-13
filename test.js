document.getElementById('btn').addEventListener('click', updateStyleNode);
function updateStyleNode() {
  const styleSheets = Array.from(document.styleSheets);
  // onwerNode获得styleSheet对应的节点
  const st = styleSheets.find((s) => s.onwerNode.id == 'ss-test');
  // 通过选择器找到对应的rule
  const rule = Array.form(st.rules).find((r) => r.selectorText === '.div');
}
const styleMap = rule.styleMap;
styleMap.set('background-color', 'yellow');
