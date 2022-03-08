/* 2055.蜡烛之间的盘子
给你一个长桌子，桌子上盘子和蜡烛排成一列。给你一个下标从 0 开始的字符串 s ，它只包含字符 '*' 和 '|' ，其中 '*' 表示一个 盘子 ，'|' 表示一支 蜡烛 。

同时给你一个下标从 0 开始的二维整数数组 queries ，其中 queries[i] = [lefti, righti] 表示 子字符串 s[lefti...righti] （包含左右端点的字符）。对于每个查询，你需要找到 子字符串中 在 两支蜡烛之间 的盘子的 数目 。如果一个盘子在 子字符串中 左边和右边 都 至少有一支蜡烛，那么这个盘子满足在 两支蜡烛之间 。

比方说，s = "||**||**|*" ，查询 [3, 8] ，表示的是子字符串 "*||**|" 。子字符串中在两支蜡烛之间的盘子数目为 2 ，子字符串中右边两个盘子在它们左边和右边 都 至少有一支蜡烛。
请你返回一个整数数组 answer ，其中 answer[i] 是第 i 个查询的答案。 */
/* 预处理 + 前缀和 */
var platesBetweenCandles = function(s, queries) {
    const n = s.length;
    const prev = new Array(n).fill(0);
    for(let i = 0, sum = 0; i < n; i++) {
        if(s[i] == '*') {
            sum++;
        }
        prev[i] = sum;
    }
    const left = new Array(n).fill(0);
    for(let i = 0, l = -1; i < n; i++) {
        if(s[i] == '|') {
            l = i;
        }
        left[i] = l;
    }
    const right = new Array(n).fill(0);
    for(let i = n-1, l = -1; i >= 0; i--) {
        if(s[i] == '|') {
            r = i;
        }
        right[i] = r;
    }
    const res = new Array(queries.length).fill(0);
    for(let i = 0; i < queries.length; i++) {
        const query = queries[i];
        let x = right[query[0]], y = left[query[1]];
        res[i] = x === -1 || y === -1 || x >= y ? 0 : prev[y] - prev[x];
    }
    return res;
};