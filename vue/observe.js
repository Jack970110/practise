import Observer from "./Observer.js";
export default function observe (value) {
    if (typeof value != 'object'){
        return;
    }
    var ob;
    if(typeof value._ob_ !== 'undefined'){
        ob = value._ob_;
    } else {
        ob = new Observer(value);
    }
    return ob;
}