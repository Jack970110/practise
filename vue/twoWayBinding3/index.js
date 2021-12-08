class Dep {
    constructor() {
        this.subscribers = new Set(); // 保证依赖不重复添加
    }
    // 追加订阅者
    depend() {
        if(activeUpdate) { // activeUpdate注册为订阅者
            this.subscribers.add(activeUpdate)
        }

    }
    // 运行所有的订阅者更新方法
    notify() {
        this.subscribers.forEach(sub => {
            sub();
        })
    }
}
let activeUpdate
function reactive(target) {
   return createReactiveObject(target)
}
let toProxyMap = new WeakMap()
let toRawMap = new WeakMap()
function createReactiveObject(target) {
    let dep = new Dep()
    if(!isObject(target)) return target
    // reactive(obj)
    // reactive(obj)
    // reactive(obj)
    // target已经代理过了，直接返回，不需要再代理了
    if(toProxyMap.has(target)) return toProxyMap.get(target)
    // 防止代理对象再被代理
    // reactive(proxy)
    // reactive(proxy)
    // reactive(proxy)
    if(toRawMap.has(target)) return target
    const handler = {
        get(target, key, receiver) {
            let res = Reflect.get(target, key, receiver)
            // 收集依赖
            if(activeUpdate) {
                dep.depend()
            }
            // 递归代理
            return isObject(res) ? reactive(res) : res
        },
        // 必须要有返回值，否则数组的push等方法报错
        set(target, key, val, receiver) {
            let hadKey = hasOwn(target, key)
            let oldVal = target[key]
            let res = Reflect.set(target, key, val,receiver)
            if(!hadKey) {
                // console.log('新增属性', key)
                dep.notify()
            } else if(oldVal !== val) {
                // console.log('修改属性', key)
                dep.notify()
            }
            return res
        },
        deleteProperty(target, key) {
            Reflect.deleteProperty(target, key)
        }
    }
    let observed = new Proxy(target, handler)
    toProxyMap.set(target, observed)
    toRawMap.set(observed, target)
    return observed

}
function isObject(obj) {
    return obj != null && typeof obj === 'object'
}
function hasOwn(obj, key) {
    return obj.hasOwnProperty(key)
}
function autoRun(update) {
    function wrapperUpdate() {
        activeUpdate = wrapperUpdate
        update() // wrapperUpdate, 闭包
        activeUpdate = null;
    }
    wrapperUpdate();
}
let obj = {name: 'hello', arr: [1, 2,3]}
let proxy = reactive(obj)
// 响应式
autoRun(() => {
    console.log(proxy.name)
})
proxy.name = 'xxx' // 修改proxy.name, 自动执行autoRun的回调函数，打印新值
