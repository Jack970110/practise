import  observe from "./observe.js";
export default function defineReactive(data, key, val) {
    console.log('我是defineReactive', k);
    if (arguments.length == 2) {
        val = obj[key];
    }
    //子元素进行observe，至此形成递归
    let childOb = observe(val);
    Object.defineProperty(data, key, {
        enumerable: true,
        configurable: true,
        get(){
            console.log('试图访问' + key + '属性');
            return val;
        },
        set(newValue) {
            console.log('试图改变' + key + '属性', newValue);
            if(val === undefined) {
                return;
            }
            val = newValue;
            childOb = observe(newValue);
        }
    });
};