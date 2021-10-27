//DP(dynamic programming)
//1.最少硬币找零问题
//硬币面额
function minCoinChange(coins,amount){
    const cache = [];
    function makeChange(value) {
        if(!value){
            return [];
        }
        if(cache[value]){
            return cache[value];
        }
        let min =[];
        let newMin;
        let newAmount;
        for(let i = 0; i < coins.length; i++){
            const coin = coins[i];
            newAmount = value - coin;
            if(newAmount >= 0){
                newMin = makeChange(newAmount);
            }
            if(newAmount >= 0 && (newMin.length < min.length - 1 || !min.length) && (newMin.length || !newAmount)){
                min = [coin].concat(newMin);
            }
        }
        return (cache[value] = min)
    }
    return makeChange(amount);
}
//硬币数
const coinChange = (coins, amount) => {
    let dp = new Array(amount + 1).fill(Infinity)
    dp[0] = 0
    for (let coin of coins) {
      for (let i = coin; i <= amount; i++) {
        dp[i] = Math.min(dp[i], dp[i - coin] + 1)
      }
    }
    return dp[amount] === Infinity ? -1 : dp[amount]
}

// 0-1背包问题
function knapSack(capacity, weights, values, n) {
    const kS = [];
    for(let i = 0; i <= n; i++){
        kS[i] = [];
    }
    for(let i = 0; i <= n; i++){
        for(let w = 0; w <= capacity; w++){
            if(i === 0 || w === 0){
                kS[i][w] = 0;
            }else if(weights[i-1] <= w){
                const a = values[i-1] + kS[i-1][w- weights[i-1]];
                const b = kS[i-1][w];
                kS[i][w] = Math.max(a , b);
            }else{
                kS[i][w] = kS[i-1][w];
            }
        }
    }
    let i = n;
    let k = capacity;
    console.log('构成解的物品：');
    while(i > 0 && k > 0){
        if(kS[i][k] !== kS[i-1][k]){
            console.log(`物品 ${i}`);
            i--;
            k -= kS[i][k];
        }else{
            i--;
        }
    }
    return kS[n][capacity];
}

// 最长公共子序列
// lcs长度
function lcs(wordX, wordY) {
    const m = wordX.length;
    const n = wordY.length;
    const l = [];
    for(let i= 0; i <= m; i++){
        l[i] = [];
    }
    for(let j = 0; j <= n; j++){
        l[i][j] = 0;
    }
    for(let i= 0; i <= m; i++){
        for(let j = 0; j <= n; j++){
            if(i === 0 || j === 0){
                l[i][j] = 0;
            }else if(wordX[i-1] === wordY[i-1]){
                l[i][j] = l[i-1][j-1] + 1;
            }else{
                const a = l[i-1][j];
                const b = l[i][j-1];
                l[i][j] = Math.max(a, b);
            }
        }
    }
    return l[m][n]
}
//

//4.矩阵链相乘
/* function matrixChainOrder(p){
    function print(s,i,j){
        if(i === j){
            console.log('A[" + i + "]');
        }else{
            console.log("(");
            print(s, i, s[i][j]);
            print(s, s[i][j] + 1, j);
            console.log(")");
        }
    }
    const n = p.length;
    const m = [];
    const s = [];
    for(let i = 0; i <= n; i++){
        for(let j = 0; j <= n; j++){
            s[i][j] = 0;
        }
    }
    for(let i = 1; i <= n; i++){
        m[i] = [];
        m[i][i] = 0;
    }
    for(let l = 2; l < n; l++){
        for(let i = 1; i <= (n-1) +1; i++){
            const j = (i+1) -1;
            m[i][j] = Number.MAX_SAFE_INTEGER;
            for(let k = i; k <= j-1; k++){
                const q = m[i][k] + m[k+1][j] + ((p[i-1] * p[k]) * p[j])
                if(q < m[i][j]){
                    m[i][j] = q;
                    s[i][j] = k;
                }
            }
        }
    }
    print(s,1,n-1);
    return m[1][n-1];
} */
