let obj = {
  val: 123,
  valueOf() {
    console.log('valueof');
    return function () {};
  },
  toString() {
    console.log('toString');
    return this.val;
  },
};
