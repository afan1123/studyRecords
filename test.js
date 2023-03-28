/**
 * 1. new
 * 2. instanceof
 * 3. call
 * 4. bind
 * 5. apply
 * 6. 节流
 * 5. 防抖
 * 7. 深拷贝
 * 8. 柯里化函数
 * 9. promise
 * **/

const PENDING = 'pending';
const RESOLVED = 'resolved';
const REJECTED = 'rejected';
function myPromise(fn) {
  const self = this;
  this.state = PENDING;
  this.value = null;
  this.resolvedCallbacks = [];
  this.rejectedCallbacks = [];
  function resolve(value) {
    if (value instanceof myPromise) {
      return value.then(resolve, reject);
    }
    setTimeout(() => {
      if (self.state === PENDING) {
        self.state = RESOLVED;
        self.value = value;
        self.resolvedCallbacks.forEach((callback) => callback());
      }
    }, 0);
  }
  function reject(value) {
    setTimeout(() => {
      if (self.state === PENDING) {
        self.state = REJECTED;
        self.value = value;
        self.rejectedCallbacks.forEach((callback) => callback());
      }
    }, 0);
  }
  try {
    fn(resolve, reject);
  } catch (e) {
    reject(e);
  }
  myPromise.prototype.then = function (onResolved, onRejected) {
    onResolved =
      typeof onResolved === 'function'
        ? onResolved
        : function (value) {
            return value;
          };
    onRejected =
      typeof onRejected === 'function'
        ? onRejected
        : function (error) {
            throw error;
          };
    if (this.state === PENDING) {
      this.resolvedCallbacks.push(onResolved);
      this.rejectedCallbacks.push(onRejected);
    }
    if ((this.state = RESOLVED)) {
      onResolved(this.value);
    }
    if ((this.state = REJECTED)) {
      onRejected(this.value);
    }
  };
}
