function clone(target, map = new Map()) {
    if (typeof target === 'object') {
        let cloneTarget = Array.isArray(target) ? [] : {};
        if (map.get(target)) {
            return target;
        }
        map.set(target, cloneTarget);
        for (const key in target) {
            cloneTarget[key] = clone(target[key], map);
        }
        return cloneTarget;
    } else {
        return target;
    }
};
function deepClone(obj){
    var newObj= obj instanceof Array ? []:{};
    for(var item in obj){
    var temple= typeof obj[item] == 'object' ? deepClone(obj[item]):obj[item];
    newObj[item] = temple;
    }
    return newObj;
}
function clone(obj) {
    // 当null NaN undefined number string等基本数据类型时直接返回
    if (obj === null || typeof obj !== 'object') {
      return obj
    }
    // Date类型
    if (obj instanceof Date) {
      const copy = new Date()
      copy.setTime(obj.getTime())
      return copy
    }
    // 正则类型类型
    if (obj instanceof RegExp) {
      const Constructor = obj.constructor
      return new Constructor(obj)
    }
    // 如果是数组等引用数据类型
    if (obj instanceof Array || obj instanceof Object) {
      const copyObj = Array.isArray(obj) ? [] : {}
      for (const key in obj) {
        if (obj.hasOwnProperty(key)) {
          copyObj[key] = clone(obj[key])
        }
      }
      return copyObj
    }
  }
  function deepClone(target){
    if(target instanceof Object){
        let dist ;
        if(target instanceof Array){
          // 拷贝数组
          dist = [];
        }else if(target instanceof Function){
          // 拷贝函数
          dist = function () {
            return target.call(this, ...arguments);
          };
        }else if(target instanceof RegExp){
          // 拷贝正则表达式
         dist = new RegExp(target.source,target.flags);
        }else if(target instanceof Date){
            dist = new Date(target);
        }else{
          // 拷贝普通对象
          dist = {};
        }
        for(let key in target){
            // 过滤掉原型身上的属性
          if (target.hasOwnProperty(key)) {
              dist[key] = deepClone(target[key]);
          }
          // dist[key] = deepClone(target[key]);
        }
        return dist;
    }else{
        return target;
    }
  }