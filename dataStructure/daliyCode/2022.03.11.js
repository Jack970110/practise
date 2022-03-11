/* 2049.统计最高得分的节点数目 
给你一棵根节点为 0 的 二叉树 ，它总共有 n 个节点，节点编号为 0 到 n - 1 。同时给你一个下标从 0 开始的整数数组 parents 表示这棵树，其中 parents[i] 是节点 i 的父节点。由于节点 0 是根，所以 parents[0] == -1 。

一个子树的 大小 为这个子树内节点的数目。每个节点都有一个与之关联的 分数 。求出某个节点分数的方法是，将这个节点和与它相连的边全部 删除 ，剩余部分是若干个 非空 子树，这个节点的 分数 为所有这些子树 大小的乘积 。

请你返回有 最高得分 节点的 数目 。
*/
var countHighestScoreNodes = function(parents) {
    const n= parents.length;
    const children = new Array(n).fill(0);
    let maxScore = 0;
    let cnt = 0;
    for(let i = 0; i < n; i++) {
        children[i] = [];
    }
    for(let i = 0; i < n; i++) {
        const p = parents[i];
        if(p !== -1) {
            children[p].push(i);
        }
    }
    const dfs = node => {
        let score = 1;
        let size = n-1;
        for(const s of children[node]) {
            let t = dfs(s);
            score *= t;
            size -= t;
        }
        if(node !== 0) {
            score *= size;
        }
        if(score === maxScore) {
            cnt++;
        } else if(score > maxScore) {
            maxScore = score;
            cnt = 1;
        }
        return n - size;
    }
    dfs(0);
    return cnt;
}
var countHighestScoreNodes = function(parents) {
    const n= parents.length;
    const graph = new Map();
    let maxScore = 0;
    let cnt = 0;
    for(let i = 1; i < n; i++) {
        let cur = [];
        if(graph.has(parents[i])) {
            cur = graph.get(parents[i]);
        }
        cur.push(i);
        graph.set(parents[i], cur);
    }
    
    const dfs = node => {
        let left = 0, right = 0;
        if(graph.has(node)) {
            const children = graph.get(node);
            left = dfs(children[0]);
            right = children.length > 1 ? dfs(children[1]) : 0;
        }
        let score = Math.max(1,left) * Math.max(1,right) * Math.max(1, n - 1 - left - right);
        if(score === maxScore) {
            cnt++;
        } else if(score > maxScore) {
            maxScore = score;
            cnt = 1;
        }
        return left + right + 1;
    }
    dfs(0);
    return cnt;
}
let parents = [-1,2,0,2,0];
console.log(countHighestScoreNodes(parents)); 
parents = [-1,2,0]
const graph = new Map();
for(let i = 1; i < parents.length; i++) {
    let cur = [];
    if(graph.has(parents[i])) {
        cur = graph.get(parents[i]);
    }
    cur.push(i);
    graph.set(parents[i], cur);
}
console.log(graph);