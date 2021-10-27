/*1.  假设 力扣（LeetCode）即将开始 IPO 。为了以更高的价格将股票卖给风险投资公司，力扣 希望在 IPO 之前开展一些项目以增加其资本。 由于资源有限，它只能在 IPO 之前完成最多 k 个不同的项目。帮助 力扣 设计完成最多 k 个不同项目后得到最大总资本的方式。

给你 n 个项目。对于每个项目 i ，它都有一个纯利润 profits[i] ，和启动该项目需要的最小资本 capital[i] 。

最初，你的资本为 w 。当你完成一个项目时，你将获得纯利润，且利润将被添加到你的总资本中。

总而言之，从给定项目中选择 最多 k 个不同项目的列表，以 最大化最终资本 ，并输出最终可获得的最多资本。

答案保证在 32 位有符号整数范围内。 */

var findMaximizedCapital = function(k, w, profits, capital) {
    // 默认最大堆
    const defaultCmp = (x, y) => x > y;
    // 交换元素
    const swap = (arr, i, j) => ([arr[i], arr[j]] = [arr[j], arr[i]]);
    // 堆类，默认最大堆
    class Heap {
        constructor(cmp = defaultCmp) {
            this.container = [];
            this.cmp = cmp;
        }
        // 插入
        insert(data) {
            const { container, cmp } = this;
            container.push(data);
            let index = this.size() - 1;
            while (index) {
                let parent = (index - 1) >> 1;
                if (!cmp(container[index], container[parent])) {
                    return;
                }
                swap(container, index, parent);
                index = parent;
            }
        }
        // 弹出堆顶，并返回
        pop() {
            const { container, cmp } = this;
            if (!this.size()) {
                return null;
            }

            swap(container, 0, this.size() - 1);
            const res = container.pop();
            const length = this.size();
            let index = 0,
                exchange = index * 2 + 1;

            while (exchange < length) {
                // // 以最大堆的情况来说：如果有右节点，并且右节点的值大于左节点的值
                let right = index * 2 + 2;
                if (right < length && cmp(container[right], container[exchange])) {
                    exchange = right;
                }
                if (!cmp(container[exchange], container[index])) {
                    break;
                }
                swap(container, exchange, index);
                index = exchange;
                exchange = index * 2 + 1;
            }

            return res;
        }
        // 获取堆大小
        size() {
            return this.container.length;
        }
    } 
    const n = profits.length;
    const arr = new Array(n);
    // 将资本、利润按项目号组合   [资本,纯利润]
    for (let i = 0; i < n; i++) {
        arr[i] = [capital[i], profits[i]];
    }
    // 将项目按所需资本从小到大排序
    arr.sort((a, b) => a[0] - b[0]);

    // 创建最大堆
    const maxHeap = new Heap();
    let cur = 0;
    for (let i = 0; i < k; i++) {
        while (cur < n && arr[cur][0] <= w) {
            // 将所有满足条件的项目所获得的利润插入堆中
            maxHeap.insert(arr[cur++][1]);
        }
        if (maxHeap.size()) {
            // 堆不为空
            // 取出堆顶，即为最大的纯利润，更新自己的资本w
            w += maxHeap.pop();
        } else {
            // 堆为空，直接退出循环
            // 因为已经没有满足条件的项目进入堆了
            break;
        }
    }
    return w;
};
/* 2.给定一个单词数组和一个长度 maxWidth，重新排版单词，使其成为每行恰好有 maxWidth 个字符，且左右两端对齐的文本。

你应该使用“贪心算法”来放置给定的单词；也就是说，尽可能多地往每行中放置单词。必要时可用空格 ' ' 填充，使得每行恰好有 maxWidth 个字符。

要求尽可能均匀分配单词间的空格数量。如果某一行单词间的空格不能均匀分配，则左侧放置的空格数要多于右侧的空格数。

文本的最后一行应为左对齐，且单词之间不插入额外的空格。

说明:

单词是指由非空格字符组成的字符序列。
每个单词的长度大于 0，小于等于 maxWidth。
输入单词数组 words 至少包含一个单词 */
var fullJustify = function(words, maxWidth) {
    const blank = (n) => {
        return new Array(n).fill(' ').join('');
    }
    const ans = [];
    let right = 0, n = words.length;
    while (true) {
        const left = right; // 当前行的第一个单词在 words 的位置
        let sumLen = 0; // 统计这一行单词长度之和
        while (right < n && sumLen + words[right].length + right - left <= maxWidth) {
            sumLen += words[right].length;
            right++;
        }

        // 当前行是最后一行：单词左对齐，且单词之间应只有一个空格，在行末填充剩余空格
        if (right === n) {
            const s = words.slice(left).join(' ');
            ans.push(s + blank(maxWidth - s.length));
            break;
        }
        const numWords = right - left;
        const numSpaces = maxWidth - sumLen;

        // 当前行只有一个单词：该单词左对齐，在行末填充空格
        if (numWords === 1) {
            ans.push(words[left] + blank(numSpaces));
            continue;
        }
        
        // 当前行不只一个单词
        const avgSpaces = Math.floor(numSpaces / (numWords - 1));
        const extraSpaces = numSpaces % (numWords - 1);
        const s1 = words.slice(left, left + extraSpaces + 1).join(blank(avgSpaces + 1)); // 拼接额外加一个空格的单词
        const s2 = words.slice(left + extraSpaces + 1, right).join(blank(avgSpaces)); // 拼接其余单词
        ans.push(s1 + blank(avgSpaces) + s2);
    }
    return ans;
};

//1.最少硬币找零问题
function minCoinChange(coins, amount){
    const change = [];
    let total = 0;
    for(let i = coins.length; i >= 0; i--){
        const coin = coins[i];
        while(total + coin <= amount){
            change.push(coin);
            total += coin;
        }
    }
    return change;
}

//分数背包问题
function knapSack(capacity,weights,values){
    const n = weights.length;
    let val = 0;
    let load = 0;
    for(let i = 0; i < n && load < capacity; i++){
        if(weights[i] + load <= capacity){
            val += values[i];
            load += weights[i];
        }else{
            const r  = (capacity - load) / weights[i];
            val += r * values[i];
            load += weights[i];
        }
    }
    return val;
}