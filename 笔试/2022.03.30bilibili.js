/* 1.日期计算器 */
var str = '2021/02/13 00:00:00'
var time = '-3w'
function timeCaculate(str, y) {
    date = new Date(str);
    function tos(str) {
        if(str[str.length - 1] == 'w') {
            return str[1]*7*24*60*60*1000;
        }
        if(str[str.length - 1] == 'd') {
            return str[1]*24*60*60*1000;
        }
        if(str[str.length - 1] == 'h') {
            return str[1]*60*60*1000;
        }
        if(str[str.length - 1] == 'm') {
            return str[1]*60*1000;
        }
        if(str[str.length - 1] == 's') {
            return str[1]*1000;
        }
    }
    function form(date) {
        var year = date.getFullYear();//年
        var month = date.getMonth();//月
        var day = date.getDate();//日
        var hours = date.getHours();//时
        var min = date.getMinutes();//分
        var second = date.getSeconds();//秒
        return year + "-" +
            ((month + 1) > 9 ? (month + 1) : "0" + (month + 1)) + "-" +
            (day > 9 ? day : ("0" + day)) + " " +
            (hours > 9 ? hours : ("0" + hours)) + ":" +
            (min > 9 ? min : ("0" + min)) + ":" +
            (second > 9 ? second : ("0" + second));
    }
    if(y[0] == '+') {
        let time = date.getTime();
        time += tos(y);
        date = new Date(time)
    }
    if(y[0] == '-') {
        let time = date.getTime();
        time -= tos(y);
        date = new Date(time)
    }

    console.log(form(date));
}
// timeCaculate(str, time);

/* 2.合并对象 */
function assign(a,b) {
    let map = new Map();
    for(let cur of b) {
        map.set(cur, b[cur])
    }
    for (let cur of a) {
        if(map.has(cur)){
            let res = map.get(cur);
            if(res.includes(a[cur])) {
                continue;
            }
            if(typeof(cur.val) === typeof(res[0])){
                return 'throw error' 
            }
            map.set(cur,[...res,cur.val])
        }
    }
    return JSON.stringify(map,undefined,1);
}
let o1 = {
    'a': 1,
    'b': 2
}
let o2 = {
    'a': 3,
    'b': 4
}
console.log(assign(o1,o2)); 
/* 3. */