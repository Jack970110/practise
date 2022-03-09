/* 798.得分最高的最小论调
给你一个数组 nums，我们可以将它按一个非负整数 k 进行轮调，这样可以使数组变为 [nums[k], nums[k + 1], ... nums[nums.length - 1], nums[0], nums[1], ..., nums[k-1]] 的形式。此后，任何值小于或等于其索引的项都可以记作一分。

例如，数组为 nums = [2,4,1,3,0]，我们按 k = 2 进行轮调后，它将变成 [1,3,0,2,4]。这将记为 3 分，因为 1 > 0 [不计分]、3 > 1 [不计分]、0 <= 2 [计 1 分]、2 <= 3 [计 1 分]，4 <= 4 [计 1 分]。
在所有可能的轮调中，返回我们所能得到的最高分数对应的轮调下标 k 。如果有多个答案，返回满足条件的最小的下标 k 。
*/
/* 暴力求解 O（n2）， O（2n）*/
var bestRotation = function(nums) {
    const n = nums.length;
    let prevNums = nums.concat(nums);
    let res = 0, maxScore = 0;
    for(let k = 0; k < nums.length; k++) {
        let score = 0;
        for(let i = 0; i < n; i++) {
            if(prevNums[i + k] <= i) {
                score ++;
            }
        }
        if(score > maxScore) {
            maxScore = score;
            res = k;
        }
    }
    return res;
};
/* 区间估计
我们可以看到，第一位移动到最后一位一定会增加一分，而值等于下标的，下次移动则会减一分，而值本来都大于下标的，例如值4，移动后，下标减小依旧大于下标，不算分，而如果小于下标的，移动一位后，依旧小于等于下标，算一分，只有下标等于值的比较特殊，移动后，减一分。

这样，我们只需记录移动第K次后，值等于下标的元素个数，就可以算出下次K的分数。我们创建一个长度为N的数组arr，计算每个节点移动X次，才能将其值等于下标，将arr[X]++;这样就可以记录移动K次数组内值等于下标的元素个数。

我们分两种情况，一种只需要向左移动（A[i] < i），一种需要移动到最右边（A[i] > i）。

最后就是计算分数了，假设当前分数为P[n]，当前值等于下标的的数量为normalArr[n]，那么下次移动后的分数就是P[n+1] = P[n] - normalArr[n] + 1。那我们只需要记录移动K次后，值等于下标元素的数量，和默认状态下的分数，就可以推算出第K次的得分，下面是详细代码。
 */
var bestRotation = function(nums) {
    // 记录结果
    let result = 0;
    // 记录保存数组长度
    let arrLength = nums.length;
    // 记录移动K次 节点值等于下标的数量，默认数量都为0
    const normalArr = new Array(arrLength).fill(0);
    // 记录每个节点的分数
    let tem = 0;
    for (let i = 0; i < arrLength; i++) {
        if (nums[i] > i) {
            // 移动 arrLength + i - nums[i]后，该节点值等于下标，所以 
            normalArr[arrLength + i - nums[i]]++;
        } else {
            // 移动 i - nums[i]后，该节点值等于下标，所以 
            normalArr[i - nums[i]]++;
            // 记录初次的分数
            tem++;
        }
    }
    // 保存最高分数
    let max = tem;
    for (let K = 1; K < arrLength; K++) {
        // 每次移动只需要判断这次移动 有多少数组变为不符合要求的，将原来的减去该参数即可
        tem = tem - normalArr[K - 1] + 1;
        // 只有当有更优解的时候 继续新的result
        if (tem > max) {
            max = tem;
            result = K;
        }
    }
    return result;
};