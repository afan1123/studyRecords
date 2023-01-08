let obj = {
  val: '1231--~',
  valueOf() {
    console.log('valueof');
    return this.val;
  },
  toString() {
    console.log('toString');
    return this.val;
  },
};
