function curry(fn,...args){
  return  fn.length>=args.length?fn()
}