/* 15.给你一个包含 n 个整数的数组 nums，判断 nums 中是否存在三个元素 a，b，c ，使得 a + b + c = 0 ？请你找出所有和为 0 且不重复的三元组。

注意：答案中不可以包含重复的三元组 */
/* 思路：三数之和为0，必有正有负，数组可以先排序。枚举三位数，第一位必为负，后两位相互关联可以用双指针，i+1,nums.length-1;sum<0，left++；sum>0,right--;同时要考虑去重 */
var threeSum = function (nums) {
    let ans = [];
    const len = nums.length;
    if (nums == null || len < 3) return ans;
    nums.sort((a, b) => a - b); // 排序
    for (let i = 0; i < len; i++) {
        if (nums[i] > 0) break; // 如果当前数字大于0，则三数之和一定大于0，所以结束循环
        if (i > 0 && nums[i] == nums[i - 1]) continue; // 去重
        let L = i + 1;
        let R = len - 1;
        while (L < R) {
            const sum = nums[i] + nums[L] + nums[R];
            if (sum == 0) {
                ans.push([nums[i], nums[L], nums[R]]);
                while (L < R && nums[L] == nums[L + 1]) L++; // 去重
                while (L < R && nums[R] == nums[R - 1]) R--; // 去重
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
var maxArea = function (height) {
    let water = 0, left = 0, right = height.length;
    while (left < right) {
        let min = Math.min(height[left], height[right]);
        water = min * (right - left) > water ? min * (right - left) : water;
        if (height[left] < height[right]) {
            left++;//左小右移
        } else {
            right--;//右小左移
        }
    }
    return water;
};
/* 
18.请你来实现一个 myAtoi(string s) 函数，使其能将字符串转换成一个 32 位有符号整数（类似 C/C++ 中的 atoi 函数）。

函数 myAtoi(string s) 的算法如下：

读入字符串并丢弃无用的前导空格
检查下一个字符（假设还未到字符末尾）为正还是负号，读取该字符（如果有）。 确定最终结果是负数还是正数。 如果两者都不存在，则假定结果为正。
读入下一个字符，直到到达下一个非数字字符或到达输入的结尾。字符串的其余部分将被忽略。
将前面步骤读入的这些数字转换为整数（即，"123" -> 123， "0032" -> 32）。如果没有读入数字，则整数为 0 。必要时更改符号（从步骤 2 开始）。
如果整数数超过 32 位有符号整数范围 [−231,  231 − 1] ，需要截断这个整数，使其保持在这个范围内。具体来说，小于 −231 的整数应该被固定为 −231 ，大于 231 − 1 的整数应该被固定为 231 − 1 。
返回整数作为最终结果。
注意：

本题中的空白字符只包括空格字符 ' ' 。
除前导空格或数字后的其余字符串外，请勿忽略 任何其他字符。
 
 */
/* 思路：parseInt()的要求大致相同，但是还需要满足额外；自动机；正则 */
//parseInt()思路
var myAtoi = function (s) {
    const number = parseInt(s, 10);

    if (isNaN(number)) {
        return 0;
    } else if (number < Math.pow(-2, 31) || number > Math.pow(2, 31) - 1) {
        return number < Math.pow(-2, 31) ? Math.pow(-2, 31) : Math.pow(2, 31) - 1;
    } else {
        return number;
    }
}
//正则
var myAtoi = function (s) {
    const re = new RegExp(/^(-|\+)?\d+/);
    let str = s.trim().match(re);
    let res = str ? Number(str[0]) : 0;
    return res >= 0 ? Math.min(res, 2 ** 31 - 1) : Math.max(res, -(2 ** 31))
};
//自动机
/**
 * @param {string} str
 * @return {number}
 */
var myAtoi = function (str) {
    // 自动机类
    class Automaton {
        constructor() {
            // 执行阶段，默认处于开始执行阶段
            this.state = 'start';
            // 正负符号，默认是正数
            this.sign = 1;
            // 数值，默认是0
            this.answer = 0;
            /*
            关键点：
            状态和执行阶段的对应表
            含义如下：
            [执行阶段, [空格, 正负, 数值, 其他]]
            */
            this.map = new Map([
                ['start', ['start', 'signed', 'in_number', 'end']],
                ['signed', ['end', 'end', 'in_number', 'end']],
                ['in_number', ['end', 'end', 'in_number', 'end']],
                ['end', ['end', 'end', 'end', 'end']]
            ])
        }

        // 获取状态的索引
        getIndex(char) {
            if (char === ' ') {
                // 空格判断
                return 0;
            } else if (char === '-' || char === '+') {
                // 正负判断
                return 1;
            } else if (typeof Number(char) === 'number' && !isNaN(char)) {
                // 数值判断
                return 2;
            } else {
                // 其他情况
                return 3;
            }
        }

        /*
        关键点：
        字符转换执行函数
        */
        get(char) {
            /*
            易错点：
            每次传入字符时，都要变更自动机的执行阶段
            */
            this.state = this.map.get(this.state)[this.getIndex(char)];

            if (this.state === 'in_number') {
                /*
                小技巧：
                在JS中，对字符串类型进行减法操作，可以将得到一个数值型（Number）的值
        
                易错点：
                本处需要利用括号来提高四则运算的优先级
                */
                this.answer = this.answer * 10 + (char - 0);

                /*
                易错点：
                在进行负数比较时，需要将INT_MIN变为正数
                */
                this.answer = this.sign === 1 ? Math.min(this.answer, Math.pow(2, 31) - 1) : Math.min(this.answer, -Math.pow(-2, 31));
            } else if (this.state === 'signed') {
                /*
                优化点：
                对于一个整数来说，非正即负，
                所以正负号的判断，只需要一次。
                故，可以降低其判断的优先级
                */
                this.sign = char === '+' ? 1 : -1;
            }
        }
    }

    // 生成自动机实例
    let automaton = new Automaton();

    // 遍历每个字符
    for (let char of str) {
        // 依次进行转换
        automaton.get(char);
    }

    // 返回值，整数 = 正负 * 数值
    return automaton.sign * automaton.answer;
};
/* 19.给你一个链表，删除链表的倒数第 n 个结点，并且返回链表的头结点。 */
// 思路：快慢指针发，先让快指针走n步，然后快慢指针一起走，等快指针到链表末尾，慢指针的下一节点便是要删除节点
var removeNthFromEnd = function (head, n) {
    let fast = head, slow = head;
    for (let i = 0; i < n; i++) {
        fast = fast.next;
    }
    if (!fast) {
        return head.next;
    }
    while (fast.next) {
        fast = fast.next;
        slow = slow.next;
    }
    slow.next = slow.next.next;
    return head;
};
/* 23.合并k个升序链表
给你一个链表数组，每个链表都已经按升序排列。
请你将所有链表合并到一个升序链表中，返回合并后的链表。
思路：转换成数组，排序再转为链表
  */
var mergeKLists = function (lists) {
    let arr = [];
    for (let i = 0; i < lists.length; i++) {
        let list = lists[i];
        while (list) {
            arr.push(list.val);
            list = list.next
        }
    }
    arr.sort((a, b) => a - b)
    const head = new ListNode();
    let now = head;
    for (let i = 0; i < arr.length; i++) {
        now.next = new ListNode(arr[i]);
        now = now.next;
    }
    return head.next;
};
/* 思路2.两两合并 */
var mergeKLists = function (lists) {
    if (!lists.length) return null
    //递归出口，即数组中只剩一条链表时，合并完毕
    if (lists.length === 1) return lists[0]

    //两个一组的合并，合并完了更新数组（每次合并前两个）
    lists.splice(0, 2, mergeTwoLists(lists[0], lists[1]))
    //递归
    return mergeKLists(lists)
};

//尾插法合并两个链表
function mergeTwoLists(l1, l2) {
    let head = new ListNode(), pre = head
    while (l1 && l2) {
        if (l1.val > l2.val) {
            pre.next = l2
            l2 = l2.next
        } else {
            pre.next = l1
            l1 = l1.next
        }
        pre = pre.next
    }
    pre.next = l1 ? l1 : l2
    return head.next
};
/* 31.实现获取 下一个排列 的函数，算法需要将给定数字序列重新排列成字典序中下一个更大的排列（即，组合出下一个更大的整数）。

如果不存在下一个更大的排列，则将数字重新排列成最小的排列（即升序排列）。

来源：力扣（LeetCode）
链接：https://leetcode-cn.com/problems/next-permutation
著作权归领扣网络所有。商业转载请联系官方授权，非商业转载请注明出处。 */
/* 思路：怎么让数变大，还是尽量大一点：找到左比右小的第一个位置，让最靠右的比该数大的数字和该书互换位置，剩下从该数的下一位置开始再互换一下位置让数值更小一些 */
var nextPermutation = function (nums) {
    let i = nums.length - 2;
    while (i >= 0 && nums[i] >= nums[i + 1]) {
        i--;
    }
    if (i >= 0) {
        let j = nums.length - 1;
        while (j > i && nums[j] <= nums[i]) {
            j--
        }
        [nums[j], nums[i]] = [nums[i], nums[j]];
    }
    i++;
    let r = nums.length - 1;
    while (r > i) {
        if (nums[i] > nums[r]) {
            [nums[r], nums[i]] = [nums[i], nums[r]];
        }
        i++;
        r--;
    }
};

/* 32.最长有效括号
给你一个只包含 '(' 和 ')' 的字符串，找出最长有效（格式正确且连续）括号子串的长度。 */
/* 思路：有校括号最容易想到的方法就是用栈数据结构了
   但是栈得有参照物，计算方法：当前索引-栈顶索引，当栈空了，把当前索引扔进去当下次计算的参照物 */
var longestValidParentheses = function (s) {
    let maxLen = 0, stack = [];
    stack.push(-1);
    for (let i = 0; i < s.length; i++) {
        let c = s[i];
        if (c === '(') {
            stack.push(i);
        } else {
            stack.pop();
            if (stack.length) {
                let curMaxLen = i - stack[stack.length - 1];
                maxLen = Math.max(maxLen, curMaxLen);
            } else {
                stack.push(i);
            }
        }
    }
    return maxLen;
};
/* 思路2：动态规划 */
var longestValidParentheses = function (s) {
    const dp = Array(s.length).fill(0);

    for (let i = 1; i < s.length; i++) {
        // 有效括号只能是以 ')' 结尾的
        // 所以，以 '(' 结尾的字符串，最长有效括号长度就是 0，不用管
        if (s[i] === ')') {
            // 遇到 ')' 时，往左边去找跟它匹配的 '('，如果存在，那么有效长度在 dp[i - 1] 基础上加 2

            // dp[i - 1] 是以 s[i - 1] 结尾的字符串的最长有效括号长度，设它为 k，
            // 也就是 [i - k, i - 1] 这段是有效括号字符串，
            // 如果这段字符串前面的那个字符 s[i - k - 1] 是 '(' 的话，那么有效长度加 2
            if (i - dp[i - 1] - 1 >= 0 && s[i - dp[i - 1] - 1] === '(') {
                dp[i] = dp[i - 1] + 2;

                // 如果匹配到的 '(' 前面还有有效长度的话，也加上
                if (i - dp[i - 1] - 2 > 0) {
                    dp[i] += dp[i - dp[i - 1] - 2];
                }
            }
        }
    }
    return Math.max(...dp, 0);
};

/* 102.二叉树的层序遍历
给你一个二叉树，请你返回其按 层序遍历 得到的节点值。 （即逐层地，从左到右访问所有节点）。 */
var levelOrder = function (root) {
    let res = [];
    if (root === null) {
        return res;
    }
    let queue = [root];
    while (queue.length) {
        let len = queue.length, level = [];
        for (let i = 0; i < len; i++) {
            let cur = queue.shift();
            level.push(cur.val);
            if (cur.left) {
                queue.push(cur.left);
            }
            if (cur.right) {
                queue.push(cur.right);
            }
        }
        res.push(level);
    }
    return res;
}
var levelOrder = function (root) {
    const ret = [];
    if (!root) {
        return ret;
    }

    const q = [];
    q.push(root);
    while (q.length !== 0) {
        const currentLevelSize = q.length;
        ret.push([]);
        for (let i = 1; i <= currentLevelSize; ++i) {
            const node = q.shift();
            ret[ret.length - 1].push(node.val);
            if (node.left) q.push(node.left);
            if (node.right) q.push(node.right);
        }
    }

    return ret;
};

/* 33.搜索旋转排序数组
    整数数组 nums 按升序排列，数组中的值 互不相同 。

    在传递给函数之前，nums 在预先未知的某个下标 k（0 <= k < nums.length）上进行了 旋转，使数组变为 [nums[k], nums[k+1], ..., nums[n-1], nums[0], nums[1], ..., nums[k-1]]（下标 从 0 开始 计数）。例如， [0,1,2,4,5,6,7] 在下标 3 处经旋转后可能变为 [4,5,6,7,0,1,2] 。

    给你 旋转后 的数组 nums 和一个整数 target ，如果 nums 中存在这个目标值 target ，则返回它的下标，否则返回 -1 。*/
var search = function (nums, target) {
    if (!nums.length) {
        return -1;
    }
    let left = 0, right = nums.length - 1, mid;
    while (left <= right) {
        mid = left + ((right - left) >> 1);
        if (nums[mid] === target) {
            return mid;
        }
        if (nums[left] <= nums[mid]) {
            if (target >= nums[left] && target < nums[mid]) {
                right = mid - 1;
            } else {
                left = mid + 1;
            }
        } else {
            if (target > nums[mid] && target <= nums[right]) {
                left = mid + 1;
            } else {
                right = mid - 1;
            }
        }
    }
    return -1;
};

/* 39.组合求和 
给定一个无重复元素的正整数数组 candidates 和一个正整数 target ，找出 candidates 中所有可以使数字和为目标数 target 的唯一组合。

candidates 中的数字可以无限制重复被选取。如果至少一个所选数字数量不同，则两种组合是唯一的。 

对于给定的输入，保证和为 target 的唯一组合数少于 150 个。*/
/* 思路：回溯，dfs */
var combinationSum = function (candidates, target) {
    let res = [];
    let dfs = function (start, temp, sum) { // start是当前选择的起点索引 temp是当前的集合 sum是当前求和
        if (sum >= target) {
            if (sum === target) {
                res.push(temp.slice()); // temp的拷贝 加入解集
            }
            return; // 结束当前递归
        }
        for (let i = start; i < candidates.length; i++) {// 枚举当前可选的数，从start开始
            temp.push(candidates[i]); // 选这个数
            dfs(i, temp, sum + candidates[i]); // 基于此继续选择，传i，下一次就不会选到i左边的数
            temp.pop(); // 撤销选择，回到选择candidates[i]之前的状态，继续尝试选同层右边的数
        }
    };
    dfs(0, [], 0); // 最开始可选的数是从第0项开始的，传入一个空集合，sum也为0
    return res;
};

/* 42.接雨水 
给定 n 个非负整数表示每个宽度为 1 的柱子的高度图，计算按此排列的柱子，下雨之后能接多少雨水。*/
/* 思路：第一眼，双指针；动态规划；单调栈 */
// 双指针
var trap = function (height) {
    let ans = 0;
    let left = 0, leftmax = 0, right = height.length - 1, rightmax = 0;
    while (left < right) {
        leftmax = Math.max(leftmax, height[left]);
        rightmax = Math.max(rightmax, height[right]);
        if (height[left] < height[right]) {
            ans += leftmax - height[left];
            ++left;
        } else {
            ans += rightmax - height[right];
            --right;
        }
    }
    return ans;
};
// 动态规划
var trap = function (height) {
    let ans = 0, n = height.length;
    if (n == 0) {
        return 0;
    }
    let leftmax = new Array(n).fill(0);
    leftmax[0] = height[0];
    for (let i = 1; i < n; i++) {
        leftmax[i] = Math.max(leftmax[i - 1], height[i]);
    }
    let rightmax = new Array(n).fill(0);
    rightmax[n - 1] = height[n - 1];
    for (let i = n - 2; i >= 0; i--) {
        rightmax[i] = Math.max(rightmax[i + 1], height[i]);
    }
    for (let i = 1; i < n; i++) {
        ans += Math.min(leftmax[i], rightmax[i]) - height[i];
    }
    return ans;
}
// 单调栈
let ans = 0;
const stack = [];
const n = height.length;
for (let i = 0; i < n; ++i) {
    while (stack.length && height[i] > height[stack[stack.length - 1]]) {
        const top = stack.pop();
        if (!stack.length) {
            break;
        }
        const left = stack[stack.length - 1];
        const currWidth = i - left - 1;
        const currHeight = Math.min(height[left], height[i]) - height[top];
        ans += currWidth * currHeight;
    }
    stack.push(i);
}
return ans;

/*46.全排列
回溯经典问题*/
var permute = function (nums) {
    const res = [], path = [];
    backTracking(nums, nums.length, []);
    return res;
    function backTracking(n, k, used) {
        if (path.length === k) {
            res.push(Array.from(path));
            return;
        }
        for (let i = 0; i < k; i++) {
            if (used[i]) {
                continue;
            }
            path.push(n[i]);
            used[i] = true;
            backTracking(n, k, used);
            path.pop();
            used[i] = false;
        }
    }
}

/* 48.旋转图像
二维矩阵顺时针旋转90° */
var rotate = function (matrix) {
    const n = matrix[0].length;
    for (let i = 0; i < Math.floor(n / 2); i++) {
        for (let j = 0; j < Math.floor((n + 1) / 2); j++) {
            let temp = matrix[i][j];
            matrix[i][j] = matrix[n - j - 1][i];
            matrix[n - j - 1][i] = matrix[n - i - 1][n - j - 1];
            matrix[n - i - 1][n - j - 1] = matrix[j][n - i - 1];
            matrix[j][n - i - 1] = temp;
        }
    }
};
/* 先水平轴旋转，再主对角线旋转 */
var rotate = function (matrix) {
    const n = matrix[0].length;
    for (let i = 0; i < Math.floor(n / 2); i++) {
        for (let j = 0; j < n; j++) {
            [matrix[i][j], matrix[n - i - 1][j]] = [matrix[n - i - 1][j], matrix[i][j]];
        }
    }
    for (let i = 0; i < n; i++) {
        for (let j = 0; j < i; j++) {
            [matrix[i][j], matrix[j][i]] = [matrix[j][i], matrix[i][j]];
        }
    }
};

/* 49.字母异位词分组
给你一个字符串数组，请你将 字母异位词 组合在一起。可以按任意顺序返回结果列表。

字母异位词 是由重新排列源单词的字母得到的一个新单词，所有源单词中的字母都恰好只用一次。

 
思路：1.排序；2.计数
 */
var groupAnagrams = function (strs) {
    let res = new Map();
    for (let str of strs) {
        let arr = Array.from(str);
        arr.sort();
        let key = arr.toString();
        let list = res.get(key) ? res.get(key) : new Array();
        list.push(str);
        res.set(key, list);
    }
    return Array.from(res.values());
};
var groupAnagrams = function (strs) {
    const map = new Object();
    for (let s of strs) {
        const count = new Array(26).fill(0);
        for (let c of s) {
            count[c.charCodeAt() - 'a'.charCodeAt()]++;
        }
        map[count] ? map[count].push(s) : map[count] = [s];
    }
    return Object.values(map);
};

/* 53.最大连续子序和
暴力、动态规划 */
// 最优为动态规划
var maxSubArray = function(nums) {
    let pre = 0, maxAns = nums[0];
    nums.forEach((x) => {
        pre = Math.max(pre + x, x);
        maxAns = Math.max(maxAns, pre);
    });
    return maxAns;
};
var maxSubArray = function(nums) {
    let res = Number.MIN_VALUE;
    for(let i = 0; i < nums.length; i++) {
        let sum = 0;
        for(let j = i; j < nums.length; j++) {
            sum += nums[j];
            res = res > sum ? res : sum;
        }
    }
    return res;
};
// 贪心：和为负数就归0，只适用于部分情况
var maxSubArray = function(nums) {
    let res = Number.MIN_VALUE, count = 0;
    for(let i = 0; i < nums.length; i++){
        count += nums[i];
        if(count > res) {
            res = count;
        }
        if(count < 0) {
            count = 0;
        }
    }
    return res;
};

/* 55.跳跃游戏
思路：不应该把思路局限在跳几步上，思考跳的范围能否覆盖终点
贪心 */
var canJump = function(nums) {
    if(nums.length === 1) return true;
    let cover = 0;
    for(let i = 0; i <= cover; i++) {
        cover = Math.max(cover, i + nums[i])
        if(cover >= nums.length - 1) {
            return true;
        }
    }
    return false;
};
var canJump = function(nums) {
    const n = nums.length;
    let rightmost = 0;
    for (let i = 0; i < n; i++) {
        if (i <= rightmost) {
            rightmost = Math.max(rightmost, i + nums[i]);
            if (rightmost >= n - 1) {
                return true;
            }
        }
    }
    return false;
};

/* 56.合并区间
以数组 intervals 表示若干个区间的集合，其中单个区间为 intervals[i] = [starti, endi] 。请你合并所有重叠的区间，并返回一个不重叠的区间数组，该数组需恰好覆盖输入中的所有区间。

 intervals[i].length == 2*/
var merge = function (intervals) {
    intervals.sort((a, b) => a[0] - b[0]);
    let prev = intervals[0]
    let result = []
    for (let i = 0; i < intervals.length; i++) {
        let cur = intervals[i]
        if (cur[0] > prev[1]) {
            result.push(prev)
            prev = cur
        } else {
            prev[1] = Math.max(cur[1], prev[1])
        }
    }
    result.push(prev)
    return result
}

/* 不同路径
 一个机器人位于一个 m x n 网格的左上角 （起始点在下图中标记为 “Start” ）。

机器人每次只能向下或者向右移动一步。机器人试图达到网格的右下角（在下图中标记为 “Finish” ）。

问总共有多少条不同的路径？

经典动态规划、排列组合*/
// dp
var uniquePaths = function (m, n) {
    let grid = new Array(m).fill(0).map(() => new Array(n).fill(0));
    for (let i = 0; i < m; i++) {
        grid[i][0] = 1;
    }
    for (let j = 0; j < n; j++) {
        grid[0][j] = 1;
    }
    for (let i = 1; i < m; i++) {
        for (let j = 1; j < n; j++) {
            grid[i][j] = grid[i - 1][j] + grid[i][j - 1];
        }
    }
    return grid[m - 1][n - 1];
};
// 排列组合
var uniquePaths = function(m, n) {
    var uniquePaths = function(m, n) {
        let res = 1;
        for (let x = m, y = 1; y < n; ++x, ++y) {
            res = Math.floor(res * x / y);
        }
        return res;
    };
};

/* 64.最小路径和
给定一个包含非负整数的 m x n 网格 grid ，请找出一条从左上角到右下角的路径，使得路径上的数字总和为最小。

说明：每次只能向下或者向右移动一步。 */
var minPathSum = function(grid) {
    const m = grid.length, n = grid[0].length;
    let dp = new Array(m).fill(0).map(() => new Array(n).fill(0));
    dp[0][0] = grid[0][0];
    for (let i = 0; i < m; i++) {
        for (let j = 0; j < n; j++) {
            if (i == 0 && j != 0) {
                dp[i][j] = dp[i][j - 1] + grid[i][j];
            } else if (j == 0 && i != 0) {
                dp[i][j] = dp[i - 1][j] + grid[i][j];
            } else if (i != 0 && j != 0) {
                dp[i][j] = Math.min(dp[i - 1][j], dp[i][j - 1]) + grid[i][j];
            }
        }
    }
    return dp[m - 1][n - 1];
}

/* 101.对称二叉树 给定一个二叉树，检查它是否是镜像对称的。递归*/
var isSymmetric = function (root) {
    if (!root) {
        return true;
    }
    const isMirror = function (l, r) {
        if (!l && !r) {
            return true;
        }
        if (l && r && l.val == r.val &&
            isMirror(l.left, r.right) &&
            isMirror(l.right, r.left)) {
            return true;
        }
        return false;
    }
    return isMirror(root.left, root.right);
};

/* 121.买卖股票的最佳时机 
给定一个数组 prices ，它的第 i 个元素 prices[i] 表示一支给定股票第 i 天的价格。

你只能选择 某一天 买入这只股票，并选择在 未来的某一个不同的日子 卖出该股票。设计一个算法来计算你所能获取的最大利润。

返回你可以从这笔交易中获取的最大利润。如果你不能获取任何利润，返回 0 。

来源：力扣（LeetCode）
链接：https://leetcode-cn.com/problems/best-time-to-buy-and-sell-stock
著作权归领扣网络所有。商业转载请联系官方授权，非商业转载请注明出处。*/
var maxProfit = function (prices) {
    let end = 0;
    let min = prices[0]
    prices.forEach((element) => {
        if (element < min) {
            min = element
        }
        if (element - min > end) {
            end = element - min
        }
    })
    return end
};

/* 136.只出现一次的数字
 给定一个非空整数数组，除了某个元素只出现一次以外，其余每个元素均出现两次。找出那个只出现了一次的元素。*/
 var singleNumber = function(nums) {
    let ans = 0;
    for(const num of nums) {
        ans ^= num;
    }
    return ans;
};

/* 160.相交链表 
给你两个单链表的头节点 headA 和 headB ，请你找出并返回两个单链表相交的起始节点。如果两个链表不存在相交节点，返回 null 。*/
var getIntersectionNode = function (headA, headB) {
    let visited = new Set();
    let temp = headA;
    while (temp) {
        visited.add(temp);
        temp = temp.next;
    }
    temp = headB;
    while (temp) {
        if (visited.has(temp)) {
            return temp;
        }
        temp = temp.next;
    }
    return null;
};

/* 234.会问链表
 给你一个单链表的头节点 head ，请你判断该链表是否为回文链表。如果是，返回 true ；否则，返回 false 。*/
 const reverseList = (head) => {
    let prev = null;
    let curr = head;
    while (curr !== null) {
        let nextTemp = curr.next;
        curr.next = prev;
        prev = curr;
        curr = nextTemp;
    }
    return prev;
}

const endOfFirstHalf = (head) => {
    let fast = head;
    let slow = head;
    while (fast.next !== null && fast.next.next !== null) {
        fast = fast.next.next;
        slow = slow.next;
    }
    return slow;
}

var isPalindrome = function(head) {
    if (head == null) return true;

    // 找到前半部分链表的尾节点并反转后半部分链表
    const firstHalfEnd = endOfFirstHalf(head);
    const secondHalfStart = reverseList(firstHalfEnd.next);

    // 判断是否回文
    let p1 = head;
    let p2 = secondHalfStart;
    let result = true;
    while (result && p2 != null) {
        if (p1.val != p2.val) result = false;
        p1 = p1.next;
        p2 = p2.next;
    }        

    // 还原链表并返回结果
    firstHalfEnd.next = reverseList(secondHalfStart);
    return result;
};

/* 283.移动零
给定一个数组 nums，编写一个函数将所有 0 移动到数组的末尾，同时保持非零元素的相对顺序。
快慢指针法， */
var moveZeroes = function (nums) {
    let fast = 0,
        slow = 0;
    while (fast < nums.length) {
        if (nums[fast] != 0) {
            [nums[fast], nums[slow]] = [nums[slow], nums[fast]];
            slow++;
        }
        fast++;
    }
    return nums;
};

/* 338. 比特位计数
给你一个整数 n ，对于 0 <= i <= n 中的每个 i ，计算其二进制表示中 1 的个数 ，返回一个长度为 n + 1 的数组 ans 作为答案。*/
var countBits = function(n) {
    const bits = new Array(n + 1).fill(0);
    for (let i = 1; i <= n; i++) {
        bits[i] = bits[i & (i - 1)] + 1;
    }
    return bits;
}

/* 543.二叉树的直径
 给定一棵二叉树，你需要计算它的直径长度。一棵二叉树的直径长度是任意两个结点路径长度中的最大值。这条路径可能穿过也可能不穿过根结点。*/
var diameterOfBinaryTree = function (root) {
    let res = 0
    depth(root)
    return res
    function depth(node) {
        if (!node) return 0 // 节点不存在返回0
        let left = depth(node.left) // left为左子树的深度
        let right = depth(node.right)//right 为右子树的深度
        res = Math.max(left + right, res) //计算l+r 更新res
        return Math.max(left, right) + 1 //返回该节点为根的子树的深度
    }
};
/* 合并二叉树 
给定两个二叉树，想象当你将它们中的一个覆盖到另一个上时，两个二叉树的一些节点便会重叠。

你需要将他们合并为一个新的二叉树。合并的规则是如果两个节点重叠，那么将他们的值相加作为节点合并后的新值，否则不为 NULL 的节点将直接作为新二叉树的节点。

来源：力扣（LeetCode）
链接：https://leetcode-cn.com/problems/merge-two-binary-trees
著作权归领扣网络所有。商业转载请联系官方授权，非商业转载请注明出处。*/
var mergeTrees = function (root1, root2) {
    const preOrder = function (root1, root2) {
        if (!root1) {
            return root2;
        }
        if (!root2) {
            return root1;
        }
        root1.val += root2.val;
        root1.left = preOrder(root1.left, root2.left);
        root1.right = preOrder(root1.right, root2.right);
        return root1;
    }
    return preOrder(root1, root2);
};

/* 75.颜色分类 
给定一个包含红色、白色和蓝色，一共 n 个元素的数组，原地对它们进行排序，使得相同颜色的元素相邻，并按照红色、白色、蓝色顺序排列。

此题中，我们使用整数 0、 1 和 2 分别表示红色、白色和蓝色。

来源：力扣（LeetCode）
链接：https://leetcode-cn.com/problems/sort-colors
著作权归领扣网络所有。商业转载请联系官方授权，非商业转载请注明出处。*/
// 思路：关注0和2，一遍遍历，每个i处
var sortColors = function (nums) {
    let p0 = 0, p1 = nums.length - 1;
    for (let i = 0; i <= p1; i++) {
        while (i < p1 && nums[i] == 2) {
            [nums[i], nums[p1]] = [nums[p1], nums[i]];
            p1--;
        }
        if (nums[i] == 0) {
            [nums[i], nums[p0]] = [nums[p0], nums[i]];
            p0++;
        }
    }
};

/* 单词搜索
 给定一个 m x n 二维字符网格 board 和一个字符串单词 word 。如果 word 存在于网格中，返回 true ；否则，返回 false 。

单词必须按照字母顺序，通过相邻的单元格内的字母构成，其中“相邻”单元格是那些水平相邻或垂直相邻的单元格。同一个单元格内的字母不允许被重复使用。*/
var exist = (board, word) => {
    const m = board.length;
    const n = board[0].length;
    const used = new Array(m);    // 二维矩阵used，存放bool值
    for (let i = 0; i < m; i++) {
        used[i] = new Array(n);
    }
    // canFind 判断当前点是否是目标路径上的点
    const canFind = (row, col, i) => { // row col 当前点的坐标，i当前考察的word字符索引
        if (i == word.length) {        // 递归的出口 i越界了就返回true
            return true;
        }
        if (row < 0 || row >= m || col < 0 || col >= n) { // 当前点越界 返回false
            return false;
        }
        if (used[row][col] || board[row][col] != word[i]) { // 当前点已经访问过，或，非目标点
            return false;
        }
        // 排除掉所有false的情况，当前点暂时没毛病，可以继续递归考察
        used[row][col] = true;  // 记录一下当前点被访问了
        // canFindRest：基于当前选择的点[row,col]，能否找到剩余字符的路径。
        const canFindRest = canFind(row + 1, col, i + 1) || canFind(row - 1, col, i + 1) ||
            canFind(row, col + 1, i + 1) || canFind(row, col - 1, i + 1);

        if (canFindRest) { // 基于当前点[row,col]，可以为剩下的字符找到路径
            return true;
        }
        used[row][col] = false; // 不能为剩下字符找到路径，返回false，撤销当前点的访问状态
        return false;
    };

    for (let i = 0; i < m; i++) { // 遍历找起点，作为递归入口
        for (let j = 0; j < n; j++) {
            if (board[i][j] == word[0] && canFind(i, j, 0)) { // 找到起点且递归结果为真，找到目标路径
                return true;
            }
        }
    }
    return false; // 怎么样都没有返回true，则返回false
};

/* 84.柱状图中的最大矩形
 给定 n 个非负整数，用来表示柱状图中各个柱子的高度。每个柱子彼此相邻，且宽度为 1 。

求在该柱状图中，能够勾勒出来的矩形的最大面积。
单调栈*/
var largestRectangleArea = function (heights) {
    let maxArea = 0
    const stack = []
    heights = [0, ...heights, 0]
    for (let i = 0; i < heights.length; i++) {
        while (heights[i] < heights[stack[stack.length - 1]]) { // 当前bar比栈顶bar矮
            const stackTopIndex = stack.pop() // 栈顶元素出栈，并保存栈顶bar的索引
            maxArea = Math.max(               // 计算面积，并挑战最大面积
                maxArea,                        // 计算出栈的bar形成的长方形面积
                heights[stackTopIndex] * (i - stack[stack.length - 1] - 1)
            )
        }
        stack.push(i)                       // 当前bar比栈顶bar高了，入栈
    }
    return maxArea
};

/* 85.最大矩形 
给定一个仅包含 0 和 1 、大小为 rows x cols 的二维二进制矩阵，找出只包含 1 的最大矩形，并返回其面积。
单调栈做法*/
var maximalRectangle = function(matrix) {
    const m = matrix.length;
    if (m === 0) {
        return 0;
    }
    const n = matrix[0].length;
    const left = new Array(m).fill(0).map(() => new Array(n).fill(0));

    for (let i = 0; i < m; i++) {
        for (let j = 0; j < n; j++) {
            if (matrix[i][j] === '1') {
                left[i][j] = (j === 0 ? 0 : left[i][j - 1]) + 1;
            }
        }
    }

    let ret = 0;
    for (let j = 0; j < n; j++) { // 对于每一列，使用基于柱状图的方法
        const up = new Array(m).fill(0);
        const down = new Array(m).fill(0);

        let stack = new Array();
        for (let i = 0; i < m; i++) {
            while (stack.length && left[stack[stack.length - 1]][j] >= left[i][j]) {
                stack.pop();
            }
            up[i] = stack.length === 0 ? -1 : stack[stack.length - 1];
            stack.push(i);
        }
        stack = [];
        for (let i = m - 1; i >= 0; i--) {
            while (stack.length && left[stack[stack.length - 1]][j] >= left[i][j]) {
                stack.pop();
            }
            down[i] = stack.length === 0 ? m : stack[stack.length - 1];
            stack.push(i);
        }

        for (let i = 0; i < m; i++) {
            const height = down[i] - up[i] - 1;
            const area = height * left[i][j];
            ret = Math.max(ret, area);
        }
    }
    return ret;
};

/* 124.二叉树中的最大路径和 
路径 被定义为一条从树中任意节点出发，沿父节点-子节点连接，达到任意节点的序列。同一个节点在一条路径序列中 至多出现一次 。该路径 至少包含一个 节点，且不一定经过根节点。

路径和 是路径中各节点值的总和。

给你一个二叉树的根节点 root ，返回其 最大路径和 。

来源：力扣（LeetCode）
链接：https://leetcode-cn.com/problems/binary-tree-maximum-path-sum
著作权归领扣网络所有。商业转载请联系官方授权，非商业转载请注明出处。*/
var maxPathSum = (root) => {
    let maxSum = Number.MIN_SAFE_INTEGER; // 最大路径和

    const dfs = (root) => {
        if (root == null) { // 遍历到null节点，收益0
           return 0;
        }
        const left = dfs(root.left);   // 左子树提供的最大路径和
        const right = dfs(root.right); // 右子树提供的最大路径和

        const innerMaxSum = left + root.val + right; // 当前子树内部的最大路径和
        maxSum = Math.max(maxSum, innerMaxSum);      // 挑战最大纪录

        const outputMaxSum = root.val + Math.max(0, left, right); // 当前子树对外提供的最大和

        // 如果对外提供的路径和为负，直接返回0。否则正常返回
        return outputMaxSum < 0 ? 0 : outputMaxSum;
    };

    dfs(root);  // 递归的入口

    return maxSum; 
};

/* 239.滑动窗口的最大值
给你一个整数数组 nums，有一个大小为 k 的滑动窗口从数组的最左侧移动到数组的最右侧。你只可以看到在滑动窗口内的 k 个数字。滑动窗口每次只向右移动一位。

返回滑动窗口中的最大值。

 输入：nums = [1,3,-1,-3,5,3,6,7], k = 3
输出：[3,3,5,5,6,7]
解释：
滑动窗口的位置                最大值
---------------               -----
[1  3  -1] -3  5  3  6  7       3
 1 [3  -1  -3] 5  3  6  7       3
 1  3 [-1  -3  5] 3  6  7       5
 1  3  -1 [-3  5  3] 6  7       5
 1  3  -1  -3 [5  3  6] 7       6
 1  3  -1  -3  5 [3  6  7]      7
*/
/* 思路：暴力求解O（n*k），肯定不好，会超时；考虑每次只移动一位，可以维护一个队列，保存有可能是最大值的元素下标 */
var maxSlidingWindow = function(nums, k) {
    const q = [], result = []; //创建队列（存放可能最大元素下标），结果数组
    for(let i = 0; i < nums.length; i++) {
        while(q.length && nums[i] >= nums[q[q.length - 1]]) {// 队列不为空，且当前元素大于等于队尾所存下标的元素，则弹出队尾，目的是构建单调性，使队首为最大元素下标
            q.pop();
        }
        q.push(i);
        while(q[0] <= i - k) { // 判断队首元素是否在窗口内，不在就出队
            q.shift();
        }
        if(i >= k - 1) {
            result.push(nums[q[0]]); // 当达到窗口大小时，就可以向结果中push了
        }
    }
    return result;
}

/* 297.二叉树的序列化与反序列化 
序列化是将一个数据结构或者对象转换为连续的比特位的操作，进而可以将转换后的数据存储在一个文件或者内存中，同时也可以通过网络传输到另一个计算机环境，采取相反方式重构得到原数据。

请设计一个算法来实现二叉树的序列化与反序列化。这里不限定你的序列 / 反序列化算法执行逻辑，你只需要保证一个二叉树可以被序列化为一个字符串并且将这个字符串反序列化为原始的树结构。

*/
/**
 * Definition for a binary tree node.
 * function TreeNode(val) {
 *     this.val = val;
 *     this.left = this.right = null;
 * }
 */

/**
 * Encodes a tree to a single string.
 *
 * @param {TreeNode} root
 * @return {string}
 */
 var serialize = function(root) {
    return rserialize(root, '');
};

/**
 * Decodes your encoded data to tree.
 *
 * @param {string} data
 * @return {TreeNode}
 */
var deserialize = function(data) {
    const dataArray = data.split(",");
    return rdeserialize(dataArray);
};

/**
 * Your functions will be called as such:
 * deserialize(serialize(root));
 */
const rserialize = (root, str) => {
    if (root === null) {
        str += "None,";
    } else {
        str += root.val + '' + ",";
        str = rserialize(root.left, str);
        str = rserialize(root.right, str);
    }
    return str;
}

const rdeserialize = (dataList) => {
    if (dataList[0] === "None") {
        dataList.shift();
        return null;
    }

    const root = new TreeNode(parseInt(dataList[0]));
    dataList.shift();
    root.left = rdeserialize(dataList);
    root.right = rdeserialize(dataList);

    return root;
}

/* 301.删除无效的括号 
给你一个由若干括号和字母组成的字符串 s ，删除最小数量的无效括号，使得输入的字符串有效。

返回所有可能的结果。答案可以按 任意顺序 返回。*/
// 解法1.BFS
var removeInvalidParentheses = function (s) {
    let res = [];
    let queue = [];
  
    queue.push([s, 0]);
   
    while (queue.length > 0) {
      s = queue.shift();
      if (isVaild(s[0])) {
        res.push(s[0]);
      } else if (res.length == 0) {
        let removei = s[1];
        s = s[0];
        for (; removei < s.length; removei++) {
          if (
            //保证是连续括号的第一个
            (s[removei] == '(' || s[removei] === ')') &&
            (removei === 0 || s[removei - 1] != s[removei])
          ) {
            let nexts = s.substring(0, removei) + s.substring(removei + 1);
            //此时删除位置的下标 removei 就是下次删除位置的开始
            queue.push([nexts, removei]);
          }
        }
      }
    }
    return res;
  };
  
  function isVaild(s) {
    let count = 0;
    for (let i = 0; i < s.length; i++) {
      if (s[i] === '(') {
        count++;
      } else if (s[i] === ')') {
        count--;
      }
      if (count < 0) {
        return false;
      }
    }
    return count === 0;
  }

  /* 312.戳气球
  有 n 个气球，编号为0 到 n - 1，每个气球上都标有一个数字，这些数字存在数组 nums 中。

现在要求你戳破所有的气球。戳破第 i 个气球，你可以获得 nums[i - 1] * nums[i] * nums[i + 1] 枚硬币。 这里的 i - 1 和 i + 1 代表和 i 相邻的两个气球的序号。如果 i - 1或 i + 1 超出了数组的边界，那么就当它是一个数字为 1 的气球。

求所能获得硬币的最大数量。 */
var maxCoins = function (nums) {
    let n = nums.length;
    // 添加两侧的虚拟气球
    let points = [1, ...nums, 1];
    let dp = Array.from(Array(n + 2), () => Array(n + 2).fill(0));
    // 最后一行开始遍历,从下往上
    for (let i = n; i >= 0; i--) {
        // 从左往右
        for (let j = i + 1; j < n + 2; j++) {
            for (let k = i + 1; k < j; k++) {
                dp[i][j] = Math.max(dp[i][j], points[j] * points[k] * points[i] + dp[i][k] + dp[k][j]);
            }
        }
    }
    return dp[0][n + 1];
};

/* 96.不同的二叉搜索树
 给你一个整数 n ，求恰由 n 个节点组成且节点值从 1 到 n 互不相同的 二叉搜索树 有多少种？返回满足题意的二叉搜索树的种数。*/
/* 动态规划:根节点不同，二叉搜索树就会不同，根据二叉搜索树性质，n个节点中，第i个节点为根节点的二叉树=前i-1个节点构成数目*后n-i个节点构成数目，不断递归，
 边界条件G[0]=1.*/
var numTrees = function (n) {
    let G = new Array(n + 1).fill(0);
    G[0] = 1;
    G[1] = 1;
    for (let i = 2; i <= n; i++) {
        for (let j = 1; j <= i; j++) {
            G[i] += G[j - 1] * G[i - j];
        }
    }
    return G[n];
};
// 数学方法
/* C0 = 1， Cn+1 = 2(2n+1)/(n+2) *Cn */
var numTrees = function (n) {``
    let C = 1;
    for (let i = 0; i < n; ++i) {
        C = C * 2 * (2 * i + 1) / (i + 2);
    }
    return C;
}

/* 98.验证二叉搜索树 
给你一个二叉树的根节点 root ，判断其是否是一个有效的二叉搜索树。

有效 二叉搜索树定义如下：

节点的左子树只包含 小于 当前节点的数。
节点的右子树只包含 大于 当前节点的数。
所有左子树和右子树自身必须也是二叉搜索树。*/
// 递归判断
const helper = function(root, lower, upper) {
    if(root = null) {
        return true;
    }
    if(root.val <= lower || root.val >= upper) {
        return false;
    }
    return helper(root.left, lower, root.val) && helper(root.right, root.val, upper);
}
var isValidBST = function(root) {
    return helper(root, -Infinity, Infinity);
}
// 中序遍历
var isValidBST = function(root) {
    let stack = [];
    let inorder = -Infinity;

    while (stack.length || root !== null) {
        while (root !== null) {
            stack.push(root);
            root = root.left;
        }
        root = stack.pop();
        // 如果中序遍历得到的节点的值小于等于前一个 inorder，说明不是二叉搜索树
        if (root.val <= inorder) {
            return false;
        }
        inorder = root.val;
        root = root.right;
    }
    return true;
};

/* 105.从前序与中序遍历序列构造二叉树 
给定一棵树的前序遍历 preorder 与中序遍历  inorder。请构造二叉树并返回其根节点。*/
var buildTree = function (preOrder, inOrder) {
    if (!preOrder.length) {
        return null;
    }
    let root = new TreeNode(preOrder[0]);
    let mid = inOrder.findIndex((num) => num === root.val);
    root.left = buildTree(preOrder.slice(1, mid + 1), inOrder.slice(0, mid));
    root.right = buildTree(preOrder.slice(mid + 1, preOrder.length), inOrder.slice(mid + 1, inOrder.length));
    return root;
}

/* 114.二叉树展开为链表
 给你二叉树的根结点 root ，请你将它展开为一个单链表：

展开后的单链表应该同样使用 TreeNode ，其中 right 子指针指向链表中下一个结点，而左子指针始终为 null 。
展开后的单链表应该与二叉树 先序遍历 顺序相同。
思路：本质上来讲并没有转换成链表，而是将一颗二叉树抓变为只有右节点的二叉树，看起来像是一个链表；要求先序遍历，那就可以用先序遍历的思路去迭代转变*/
var flatten = function (root) {
    if (!root) {
        return;
    }
    let stack = [];
    stack.push(root);
    let prev = null;
    while (stack.length) {
        let cur = stack.pop();
        if (prev !== null) {
            prev.left = null;
            prev.right = cur;
        }
        let left = cur.left, right = cur.right;
        if (right !== null) { //考虑栈的后进先出，要先push右节点以保证先序遍历
            stack.push(right);
        }
        if (left !== null) {
            stack.push(left);
        }
        prev = cur;
    }
}

/* 128.最长连续序列
给定一个未排序的整数数组 nums ，找出数字连续的最长序列（不要求序列元素在原数组中连续）的长度。

请你设计并实现时间复杂度为 O(n) 的算法解决此问题。 */
var longestConsecutive = function(nums) {
    //nums未排序，找出数字连续的最长序列，要求O(n)
    let set = new Set(nums);//数组去重放入set中
    let max_len = 0;
    for(let num of set){//遍历集合
        let len =1;
        // 从中心向两边扩散查找
        let left=num-1,right=num+1;
        while(set.has(left)){
            //找到就删掉，避免重复遍历，导致超时
            set.delete(left);
            left--;
            len++;
        }
        while(set.has(right)){
            set.delete(right);
            right++;
            len++;
        }
        max_len = Math.max(len,max_len);
    }
    return max_len;
};
var longestConsecutive = function (nums) {
    let maxCount = 0;
    nums = new Set(nums);

    for (let value of nums) {
        if (nums.has(value - 1)) continue;

        let count = 1;
        while (nums.has(value + 1)) {
            nums.delete(value + 1);
            value++;
            count++;
        }
        maxCount = Math.max(maxCount, count);
    }

    return maxCount;
};

/* 224.基本计算器 
给你一个字符串表达式 s ，请你实现一个基本计算器来计算并返回它的值。
1 <= s.length <= 3 * 105
s 由数字、'+'、'-'、'('、')'、和 ' ' 组成
s 表示一个有效的表达式
只有+-，可以选择把括号去掉，转变为普通计算式计算*/
var calculate = function(s) {
    let stack = []; //栈顶记录当前符号
    stack.push(1); //默认为正
    let res = 0, num = 0, op = 1;
    for (let i = 0; i < s.length; i++) { //空格可以不管，直接忽略
        if (s[i] >= '0' && s[i] <= '9') { //取出完整数值
            num = num * 10 + (s[i] - '0');
            continue;
        }
        res += op * num; //计算一个运算符
        num = 0; //数值清空
        if (s[i] == '+') {
            op = stack[stack.length - 1];
        } else if (s[i] == '-') {
            op = -stack[stack.length - 1];
        } else if (s[i] == '(') { //进入左括号，把左括号之前的符号置于栈顶
            stack.push(op); 
        } else if (s[i] == ')') {//退出括号，弹出栈顶符号
            stack.pop();
        }     
    }
    res += op * num; //计算最后一个数
    return res;
};

/* 剑指offer 087 复原ip
给定一个只包含数字的字符串 s ，用以表示一个 IP 地址，返回所有可能从 s 获得的 有效 IP 地址 。你可以按任何顺序返回答案。

有效 IP 地址 正好由四个整数（每个整数位于 0 到 255 之间组成，且不能含有前导 0），整数之间用 '.' 分隔。 */
var restoreIpAddresses = function(str) {
    let list = [], l = str.length;
        // 直接暴力分割
        for (let i = 1; i < 4; i++) {
            for (let j = i + 1; j < i + 4; j++) {
                for (let k = j + 1; k < j + 4; k++) {
                    let a = str.slice(0, i);
                    let b = str.slice(i, j);
                    let c = str.slice(j, k);
                    let d = str.slice(k, l);
                    if (check(a) && check(b) && check(c) && check(d)) {
                        list.push(a + '.' + b + '.' + c + '.' + d)
                    }
                }
            }
        }
    return list;
    function check(s) {
        let n = parseInt(s)
        if (n + '' != s) {
            return false;
        }
        if (n >= 0 && n <= 255) {
            return true;
        }
        return false;
    }
};
var restoreIpAddresses = function(s) {
    let len = s.length
    if( len > 12 || len < 4 || !/^\d+$/.test(s)){
        return []
    }
    let res = []
    function slice(s,str,n){
        if(s.length < n) return
        if(n === 1){
            if(check(s)){
                res.push(str + s)
            }
            return;
        }
        n--
        if(check(s.slice(0,1))){
            slice(s.slice(1),str + s.slice(0,1)+'.',n)
        }
        if(check(s.slice(0,2))){
            slice(s.slice(2),str + s.slice(0,2)+'.',n)
        }
        if(check(s.slice(0,3))){
            slice(s.slice(3),str + s.slice(0,3)+'.',n)
        }
    }

    function  check(s) {
        return !((+s[0] === 0 && s.length > 1) || +s > 255);
    }
    slice(s,'',4)
    return res
};
