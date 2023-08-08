function myNew() {
  let o = null,
    con = [...arguments].unshift();
  if (typeof con !== 'function') {
    return false;
  }
  o = Object.create(con.prototype);
  let res = con.apply(o, [...arguments].slice(1));
  let flag = typeof res === 'object' || typeof res === 'function';
  return flag ? res : o;
}
