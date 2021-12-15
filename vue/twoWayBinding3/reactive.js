function reactive(target) {
    return createReactiveObject(target)
}
let toProxyMap = new WeakMap()
let toRawMap = new WeakMap()
function createReactiveObject(target) {
    if (!isObject(target)) return target
    // reactive(obj)
    // reactive(obj)
    // reactive(obj)
    // target已经代理过了，直接返回，不需要再代理了
    if (toProxyMap.has(target)) return toProxyMap.get(target)
    // 防止代理对象再被代理
    // reactive(proxy)
    // reactive(proxy)
    // reactive(proxy)
    if (toRawMap.has(target)) return target
    const handler = {
        get(target, key, receiver) {
            let res = Reflect.get(target, key, receiver)
            // 收集依赖
            track(target, key);// 目标上key变化，让数组（set）中的effect执行
            // 递归代理
            return isObject(res) ? reactive(res) : res
        },
        // 必须要有返回值，否则数组的push等方法报错
        set(target, key, val, receiver) {
            let hadKey = hasOwn(target, key)
            let oldVal = target[key]
            let res = Reflect.set(target, key, val, receiver)
            if (!hadKey) {
                // console.log('新增属性', key)
                trigger(target, 'add', key);
            } else if (oldVal !== val) {
                // console.log('修改属性', key)
                trigger(target, 'set', key);
            }
            return res
        },
        deleteProperty(target, key) {
            let res = Reflect.deleteProperty(target, key)
            return res;
        }
    }
    let observed = new Proxy(target, handler)
    toProxyMap.set(target, observed)
    toRawMap.set(observed, target)
    return observed

}
let activeEffectStacks = []; //栈型结构
let targetsMap = new WeakMap();
function track(target, key) {// 如果target中的key变化了就执行数组里的方法
    let effect = activeEffectStacks[activeEffectStacks.length - 1];
    if(effect) {//有对应关系才创建关联
        let depsMap = targetsMap.get(target);
        if(!depsMap) {
            targetsMap.set(target,depsMap = new Map());
        }
        let deps = depsMap.get(key);
        if(!deps) {
            depsMap.set(key, deps = new Set())
        }
        if(!deps.has(effect)) {
            deps.add(effect);
        }
    }// 动态创建依赖关系
}
function trigger(target, type, key) {
    let depsMap = targetsMap.get(target);
    if(depsMap) {
        let deps = depsMap.get(key);
        if(deps) {//将当前key对应的efect执行
            deps.forEach(effect => {
                effect();
            });
        }
    }
}
function effect(fn) {
    // 把函数变成响应式
    let effect = createReactiveEffect(fn);
    effect();//默认执行一次

}
function createReactiveEffect(fn) {
    let effect = function () {//响应式effect
        return run(effect,fn);//让fn执行，将effect存入栈中
    }
    return effect;
}
function run(effect,fn) {
    try {
        activeEffectStacks.push(effect);
        fn(); //js单线程
    } finally {
        activeEffectStacks.pop();
    }
}
// 依赖收集-发布订阅

function isObject(obj) {
    return obj != null && typeof obj === 'object'
}
function hasOwn(obj, key) {
    return obj.hasOwnProperty(key)
}

/* let obj = { name: 'hello', arr: [1, 2, 3] }
let proxy = reactive(obj)
obj.name = 'xxx' // 修改proxy.name, 自动执行autoRun的回调函数，打印新值 */
let proxy = reactive({name:[1,2,3]});
effect(()=>{
    console.log(proxy.name);
})
proxy.name.push(4);
proxy.name.push(4);