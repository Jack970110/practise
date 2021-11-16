import {def} from './utils.js'
import defineReactive from './defineReactive.js';
export default class Observer {
    constructor (value){
        //给实例
        def(value, '_ob_', this, false);
        console.log('observer构造器', value);
    }
    walk(value) {
        for(let k in value) {
            defineReactive(value,k);
        }
    }
}