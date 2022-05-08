   //防抖函数：抖动停止后的时间超过设定的时间时执行一次函数
function debounce(func, delay) {
    var timeout;
    //返回的函数在一个抖动结束后的delay毫秒内执行func函数
    return function() {
        var context = this, args = arguments; //保存函数调用时的上下文和参数
        clearTimeout(timeout); //触发func前清除定时器
        timeout = setTimeout(function() {
            func.apply(context, args);
        }, delay); //用户停止某个连续动作delay毫秒后执行func
    };
}
function debounce1( func, delay){
    var timeout;
    return function(){
        var target = this , args = arguments;
        clearTimeout(timeout);
        timeout = setTimeout(function(){
            func.call(target,args);
        }, delay);
    }
}

//节流函数：按照设定的时间固定执行一次函数
// 计时器实现
function throttle(func, delay) {
    var timeout;
    return function() {
        var context = this, args = arguments;
        if(timeout) {
            return
        }
        timeout = setTimeout(function(){
            func.apply(context, args);
            timeout = null;
        },delay)
    }
}
// 时间戳实现
function throttle1(fn, delay) {
    var previous = 0;
    return function() {
        var content = this, args = arguments;
        var now = new Date();
        if(now - previous > delay){
            fn.apply(content, args);
            previous = now;
        }
    }
}

function realFunc () {l
    console.log('bibibi');
}