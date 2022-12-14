const obj = {};
Object.defineProperty(obj, 'name', {});
obj.name = 1;
console.log(obj.name); //undefined
console.log(Object.getOwnPropertyDescriptor(obj, 'name'));
