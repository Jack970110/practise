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