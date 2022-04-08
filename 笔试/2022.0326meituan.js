/* 中位数
小团很喜欢中位数。现在给定一个序列。若长度为奇数，那么其中位数是将序列中的数从小到大排序后位于正中间位置的数；若长度为偶数，则为最中间两个数的平均值。现给你一个长度为n的序列，小团想知道所有长度为奇数
的区间的中位数之和为多少 */
var midSum = function(arr) {
    let n = arr.length;
    let m = n % 2 === 1 ? n : n-1;
    let sum = 0;
    for(let i = 0; i < arr.length; i++) {
        sum += arr[i];
    }
    for(let i = 3; i <= m; i += 2) {
        for(let j = 0; j <= n - i; j++) {
            let pre = arr.slice(j, j + i).sort();
            sum += pre[Math.floor(pre.length / 2)];
        }
    }
    return sum;
}
/* let arr = [2,3,1,4];
console.log(midSum(arr)); */

/* 7的倍数
小美喜欢7的倍数。桌面上有一些卡片，每张卡片上印着一个数字。小美想从中挑选一些数字，使得数字之和最大，而且为7的倍数。 */
var maxSevenSum = function(arr) {
    let sum = 0;
    let res = 0;
    for(let i = 0; i < arr.length; i++) {
        sum += arr[i];
    }
    let dp = new Array(sum + 1).fill(0);
    dp[sum] = 1;
    dp[0] = 1;
    for(let i = 0; i < arr.length; i++) {
        dp[arr[i]] = 1;
        for(let j =0; j < sum; j++) {
            if(dp[j] === 1 && (j - arr[i] >= 0)) {
                dp[j - arr[i]] = 1;
            }
        }
    }
    for(let i = sum; i >= 0; i--){
        if(dp[i] && i >= 7 && i % 7 == 0){
            res = i;
        }
        if(i < 7){
            res = 0;
        }
    }
    return res;
}
let arr = [7,15,28,46,89,49,57,68,14]
console.log(maxSevenSum(arr));
