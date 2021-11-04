/* 15.给你一个包含 n 个整数的数组 nums，判断 nums 中是否存在三个元素 a，b，c ，使得 a + b + c = 0 ？请你找出所有和为 0 且不重复的三元组。

注意：答案中不可以包含重复的三元组 */
/* 思路：三数之和为0，必有正有负，数组可以先排序。枚举三位数，第一位必为负，后两位相互关联可以用双指针，i+1,nums.length-1;sum<0，left++；sum>0,right--;同时要考虑去重 */
var threeSum = function(nums) {
    let ans = [];
    const len = nums.length;
    if(nums == null || len < 3) return ans;
    nums.sort((a, b) => a - b); // 排序
    for (let i = 0; i < len ; i++) {
        if(nums[i] > 0) break; // 如果当前数字大于0，则三数之和一定大于0，所以结束循环
        if(i > 0 && nums[i] == nums[i-1]) continue; // 去重
        let L = i+1;
        let R = len-1;
        while(L < R){
            const sum = nums[i] + nums[L] + nums[R];
            if(sum == 0){
                ans.push([nums[i],nums[L],nums[R]]);
                while (L<R && nums[L] == nums[L+1]) L++; // 去重
                while (L<R && nums[R] == nums[R-1]) R--; // 去重
                L++;
                R--;
            }
            else if (sum < 0) L++;
            else if (sum > 0) R--;
        }
    }        
    return ans;
};
/* 给你 n 个非负整数 a1，a2，...，an，每个数代表坐标中的一个点 (i, ai) 。在坐标内画 n 条垂直线，垂直线 i 的两个端点分别为 (i, ai) 和 (i, 0) 。找出其中的两条线，使得它们与 x 轴共同构成的容器可以容纳最多的水。 */
/* 穷举可以，双循环复杂度较高；双指针去一重循环 */
var maxArea = function(height) {
    let water = 0, left = 0, right = height.length;
    while(left < right){
        let min = Math.min(height[left], height[right]);
        water = min * (right - left) > water ? min * (right - left) : water;
        if( height[left] < height[right]){
            left ++;//左小右移
        }else{
            right--;//右小左移
        }
    }
    return water;
};