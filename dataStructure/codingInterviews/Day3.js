/* 05.替换空格
请实现一个函数，把字符串 s 中的每个空格替换成"%20"。 */
var replaceSpace = function(s) {
    return s.split(' ').join('%20');
};
var replaceSpace = function(s) {
    // 字符串转为数组
  const strArr = Array.from(s);
  let count = 0;

  // 计算空格数量
  for(let i = 0; i < strArr.length; i++) {
    if (strArr[i] === ' ') {
      count++;
    }
  }

  let left = strArr.length - 1;
  let right = strArr.length + count * 2 - 1;

  while(left >= 0) {
    if (strArr[left] === ' ') {
      strArr[right--] = '0';
      strArr[right--] = '2';
      strArr[right--] = '%';
      left--;
    } else {
      strArr[right--] = strArr[left--];
    }
  }

  // 数组转字符串
  return strArr.join('');
};

/* 58-2.左旋转字符串 
字符串的左旋转操作是把字符串前面的若干个字符转移到字符串的尾部。请定义一个函数实现字符串左旋转操作的功能。比如，输入字符串"abcdefg"和数字2，该函数将返回左旋转两位得到的结果"cdefgab"。
*/
var reverseLeftWords = function(s, n) {
    return s.substring(n, s.length) + s.substring(0, n);
};
var reverseLeftWords = function(s, n) {
    let res = [];
  // 从n开始往后直至结尾的字符加入结果集
  for (let i = n; i < s.length; i++) res.push(s[i]);
  // 把从0开始到n-1的再加入结果集
  for (let i = 0; i < n; i++) res.push(s[i]);
  return res.join("");
};
/* 美团-小美的区域会议 
小美是美团总部的高管，她想要召集一些美团的区域负责人来开会，已知美团的业务区域划分可以用一棵树来表示，树上有 n 个节点，每个节点分别代表美团的一个业务区域，每一个区域有一个负责人，这个负责人的级别为 A[i]
已知小美召集人员开会必须满足以下几个条件：
1.小美召集的负责人所在的区域必须构成一个非空的连通的图，即选取树上的一个连通子图。
2.这些负责人中，级别最高的和级别最低的相差不超过 k 。
请问小美有多少种召集负责人的方式，当且仅当选取的集合不同时我们就认为两种方式不同。由于方案数可能非常大，所以请对 10^9+7 取模。
*/
const getNext = (function() {
    const lines = require('fs').readFileSync(0).toString().trim().split(/\r\n|\r|\n/)
    let i = 0
    return () => lines[i++].split(' ').map(x => 1 * x)
})()

let [n, k] = getNext()
const G = new Array(n + 1).fill(0).map(() => [])
for (let i = 1; i < n; i++) {
    let [a, b] = getNext()
    G[a].push(b)
    G[b].push(a)
}
const A = [0, ...getNext()]

const MOD = 1_000_000_007

const dfs = (u, v, i) => {
    let res = 1;
    for (let p of G[v]) {
        if (p === u) continue
        if (A[p] < A[i] || A[p] > A[i] + k) continue
        if (A[p] === A[i] && p < i) continue
        res = (res * (dfs(v, p, i) + 1)) % MOD
    }
    return res
}

let res = 0
for (let i = 1; i <= n; i++) {
    res = (res + dfs(0, i, i)) % MOD
}
console.log(res)

/* 006.小团的神秘暗号 
小团深谙保密工作的重要性，因此在某些明文的传输中会使用一种加密策略，小团如果需要传输一个字符串 S ，则他会为这个字符串添加一个头部字符串和一个尾部字符串。头部字符串满足至少包含一个 “MT” 子序列，且以 T 结尾。尾部字符串需要满足至少包含一个 “MT” 子序列，且以 M 开头。例如 AAAMT 和 MAAAT 都是一个合法的头部字符串，而 MTAAA 就不是合法的头部字符串。很显然这样的头尾字符串并不一定是唯一的，因此我们还有一个约束，就是 S 是满足头尾字符串合法的情况下的最长的字符串。
很显然这样的加密策略是支持解码的，给出一个加密后的字符串，请你找出中间被加密的字符串 S 。*/
const fs = require('fs');
const lines = fs.readFileSync(0).toString().trim().split(/\r\n|\r|\n/);
const length = parseInt(lines[0]);
const str = lines[1];
let left = 0, right = length - 1;
while(str[left] !== 'M') {
    left++;
}
while(str[left] !== 'T') {
    left++;
}
while(str[right] !== 'T') {
    right--;
}
while(str[right] !== 'M') {
    right--;
}
console.log(str.substring(left + 1, right));