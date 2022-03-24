const { isPromise } = require("util/types");

function promiseAll(iterator) {
    var promises = Array.from(iterator);
    let len  = promises.length;
    let index = 0, data = [];
    return new Promise((resolve, reject) =>{
        for(let i = 0; i < len; i++) {
            promises[i]
                .then((res) =>{
                    data[i] = res;
                    if(++index === len) {
                        resolve(data);
                    }
                })
                .catch((err) =>{
                    reject(err);
                })
        }
    })
}
function promiseAll1 (args) {
    const promiseResults = [];
    let iteratorIndex = 0;
      // 已完成的数量，用于最终的返回，不能直接用完成数量作为iteratorIndex
      // 输出顺序和完成顺序是两码事
    let fullCount = 0;
      // 用于迭代iterator数据
    return new Promise((resolve, reject) => {
      for (const item of args) {
        // for of 遍历顺序，用于返回正确顺序的结果
        // 因iterator用forEach遍历后的key和value一样，所以必须存一份for of的 iteratorIndex
        let resultIndex = iteratorIndex;
        iteratorIndex += 1;
        // 包一层，以兼容非promise的情况
        Promise.resolve(item).then(res => {
          promiseResults[resultIndex] = res;
          fullCount += 1;
          // Iterator 接口的数据无法单纯的用length和size判断长度，不能局限于Array和 Map类型中
          if (fullCount === iteratorIndex) {
            resolve(promiseResults)
          }
        }).catch(err => {
          reject(err)
        })
      }
      // 处理空 iterator 的情况
      if(iteratorIndex===0){
        resolve(promiseResults)
      }
    }
    )
  }
const promise1 = Promise.resolve('promise1');
const promise2 = new Promise(function(resolve, reject) {
    setTimeout(resolve, 2000, 'promise2');
});
const promise3 = new Promise(function(resolve, reject) {
    setTimeout(resolve, 1000, 'promise3');
});
/* promiseAll1([promise1, promise2, promise3]).then(function(values) {
    console.log(values);
})
promiseAll1([]).then(function(values) {
    console.log(values);
}) */

function promiseRace(iterator) {
  return new Promise((resolve,reject) => {
    for (const p of iterator) {
        Promise.resolve(p)
          .then((res) => {
              resolve(res)
          })
          .catch(e => {
              reject(e)
          })
    }
  })
}
/* promiseRace([promise2, promise3]).then(function(values) {
  console.log(values);
}) */

class PromiseM {
  constructor (process) {
      this.status = 'pending'
      this.msg = ''
      process(this.resolve.bind(this), this.reject.bind(this))
      return this
  }
  resolve (val) {
      this.status = 'fulfilled'
      this.msg = val
  }
  reject (err) {
      this.status = 'rejected'
      this.msg = err
  }
  then (fufilled, rejected) {
      if(this.status === 'fulfilled') {
          fufilled(this.msg)
      }
      if(this.status === 'rejected') {
          rejected(this.msg)
      }
  }
}
var mm=new PromiseM(function(resolve,reject){
resolve('123');
});
mm.then(function(success){
console.log(success);
},function(){
console.log('fail!');
});