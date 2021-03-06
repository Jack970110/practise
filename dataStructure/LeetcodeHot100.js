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
var trap = function (height) {
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
}

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

/* 139.单词划分 
给你一个字符串 s 和一个字符串列表 wordDict 作为字典，判定 s 是否可以由空格拆分为一个或多个在字典中出现的单词。

说明：拆分时可以重复使用字典中的单词。*/
// 动态规划
var wordBreak = function(s, wordDict) {
    const wordSet = new Set(wordDict);
    const len = s.length;
    const dp = new Array(len + 1).fill(false);
    dp[0] = true;

    for (let i = 1; i <= len; i++) {
    for (let j = i - 1; j >= 0; j--) {    // j去划分成两部分
        if (dp[i] == true) break;
        if (dp[j] == false) continue;
        const suffix = s.slice(j, i);       // 后缀部分 s[j: i-1]
        if (wordSet.has(suffix) && dp[j]) { // 后缀部分是单词，且左侧子串[0,j-1]的dp[j]为真
            dp[i] = true;
            break;  // dp[i] = true了，i长度的子串已经可以拆成单词了，不需要j继续划分子串了
        }
    }
    }
    return dp[len];
};
// dfs
const wordBreak = (s, wordDict) => {
    const len = s.length;
    const wordSet = new Set(wordDict);
    const memo = new Array(len);
  
    const canBreak = (start) => {
      if (start == len) return true;
      if (memo[start] !== undefined) return memo[start]; // memo中有，就用memo中的
  
      for (let i = start + 1; i <= len; i++) {
        const prefix = s.slice(start, i);
        if (wordSet.has(prefix) && canBreak(i)) {
          memo[start] = true; // 当前递归的结果存一下
          return true;
        }
      }
      memo[start] = false; // 当前递归的结果存一下
      return false;
    };
    return canBreak(0);
  };
// bfs
const wordBreak = (s, wordDict) => {
    const wordSet = new Set(wordDict);
    const len = s.length;
    const visited = new Array(len);
  
    const queue = [];
    queue.push(0);
  
    while (queue.length) {
      const start = queue.shift();  // 考察出列的指针
      if (visited[start]) continue; // 是访问过的，跳过
      visited[start] = true;        // 未访问过的，记录一下
  
      for (let i = start + 1; i <= len; i++) { // 用指针i去划分两部分
        const prefix = s.slice(start, i);      // 前缀部分
        if (wordSet.has(prefix)) {  // 前缀部分是单词
          if (i < len) {            // i还没越界，还能继续划分，让它入列，作为下一层待考察的节点
            queue.push(i);
          } else {  // i==len，指针越界，说明s串一路被切出单词，现在没有剩余子串，不用划分，返回true
            return true;
          }
        } // 前缀部分不是单词，i指针不入列，继续下轮迭代，切出下一个前缀部分，再试
      }
    }
    return false; // BFS完所有节点（考察了所有划分的可能）都没返回true，则返回false
  };

  /* 142.环形链表 
  给定一个链表，返回链表开始入环的第一个节点。 如果链表无环，则返回 null。

如果链表中有某个节点，可以通过连续跟踪 next 指针再次到达，则链表中存在环。 为了表示给定链表中的环，评测系统内部使用整数 pos 来表示链表尾连接到链表中的位置（索引从 0 开始）。如果 pos 是 -1，则在该链表中没有环。注意：pos 不作为参数进行传递，仅仅是为了标识链表的实际情况。

不允许修改 链表。
*/
// 哈希表思路，遍历链表，开始重复的第一个节点就是入环点
var detectCycle = function(head) {
    let visited = new Set();
    while(head) {
        if(visited.has(head)) {
            return head;
        }
        visited.add(head);
        head = head.next;
    }
    return null;
};
// 快慢指针思路，a+(n+1)b+nc=2(a+b)⟹a=c+(n−1)(b+c) =》 a=c+(n-1)(b+c)a=c+(n−1)(b+c) ；从相遇点到入环点的距离加上 n-1n−1 圈的环长，恰好等于从链表头部到入环点的距离。

//因此，当发现 slow与 fast 相遇时，我们再额外使用一个指针ptr。起始，它指向链表头部；随后，它和slow 每次向后移动一个位置。最终，它们会在入环点相遇。


var detectCycle = function(head) {
    if(head === null) {
        return null;
    }
    let fast = head, slow = head;
    while(fast) {
        slow = slow.next;
        if(fast.next !== null) {
            fast = fast.next.next;
        } else {
            return null;
        }
        if(fast === slow) {
            let ptr = head;
            while(ptr !== slow) {
                ptr = ptr.next;
                slow = slow.next;
            }
            return ptr;
        }
    }
    return null;
};

/* 148.排序链表 
给你链表的头结点 head ，请将其按 升序 排列并返回 排序后的链表 。

进阶：你可以在 O(n log n) 时间复杂度和常数级空间复杂度下，对链表进行排序吗？*/
// 暴力
var sortList = function(head) {
    if(!head) {
        return null;
    }
    let arr = [];
    while(head) {
        arr.push(head.val);
        head = head.next;
    }
    arr.sort((a,b) => a - b);
    let pre = new ListNode(0,null), Chead = pre;
    for(let i = 0; i < arr.length; i++) {
        let cur = new ListNode(arr[i],null);
        Chead.next = cur;
        Chead = Chead.next;
    }
    return pre.next;
};
var sortList = function(head) {
    if(!head) { // 边界判断
        return null;
    }
    let arr = []; // 数组存储打断的链表节点
    while(head) { // 打断节点
        let t = head.next;
        head.next = null;
        arr.push(head);
        head = t;
    }
    arr.sort((a, b) => a.val - b.val);// 排序
    for(let i = 0; i < arr.length - 1; i++) {
        arr[i].next = arr[i+1]; // 链接
    }
    return arr[0];
}
// 归并 自顶向下
const merge = (head1, head2) => {
    const dummyHead = new ListNode(0);
    let temp = dummyHead, temp1 = head1, temp2 = head2;
    while (temp1 !== null && temp2 !== null) {//合并子区间 小的节点先连
        if (temp1.val <= temp2.val) {
            temp.next = temp1;
            temp1 = temp1.next;
        } else {
            temp.next = temp2;
            temp2 = temp2.next;
        }
        temp = temp.next;
    }
    if (temp1 !== null) {//两条链表还有节点没合并完，直接合并过来
        temp.next = temp1;
    } else if (temp2 !== null) {
        temp.next = temp2;
    }
    return dummyHead.next;
}

const toSortList = (head, tail) => {
    if (head === null) {//极端情况
        return head;
    }
    if (head.next === tail) {//分割到只剩一个节点
        head.next = null;
        return head;
    }
    let slow = head, fast = head;
    while (fast !== tail) {//的到中间节点
        slow = slow.next;
        fast = fast.next;
        if (fast !== tail) {
            fast = fast.next;
        }
    }
    const mid = slow;
    return merge(toSortList(head, mid), toSortList(mid, tail));//分割区间 递归合并
}

var sortList = function(head) {
    return toSortList(head, null);
};
// 自底向上
const merge = (head1, head2) => {
    const dummyHead = new ListNode(0);
    let temp = dummyHead, temp1 = head1, temp2 = head2;
    while (temp1 !== null && temp2 !== null) {
        if (temp1.val <= temp2.val) {
            temp.next = temp1;
            temp1 = temp1.next;
        } else {
            temp.next = temp2;
            temp2 = temp2.next;
        }
        temp = temp.next;
    }
    if (temp1 !== null) {
        temp.next = temp1;
    } else if (temp2 !== null) {
        temp.next = temp2;
    }
    return dummyHead.next;
}

var sortList = function(head) {
    if (head === null) {
        return head;
    }
    let length = 0;
    let node = head;
    while (node !== null) {
        length++;
        node = node.next;
    }
    const dummyHead = new ListNode(0, head);
    for (let subLength = 1; subLength < length; subLength <<= 1) {
        let prev = dummyHead, curr = dummyHead.next;
        while (curr !== null) {
            let head1 = curr;
            for (let i = 1; i < subLength && curr.next !== null; i++) {
                curr = curr.next;
            }
            let head2 = curr.next;
            curr.next = null;
            curr = head2;
            for (let i = 1; i < subLength && curr != null && curr.next !== null; i++) {
                curr = curr.next;
            }
            let next = null;
            if (curr !== null) {
                next = curr.next;
                curr.next = null;
            }
            const merged = merge(head1, head2);
            prev.next = merged;
            while (prev.next !== null) {
                prev = prev.next;
            }
            curr = next;
        }
    }
    return dummyHead.next;
};

/*152.乘积最大的子数组
给你一个整数数组nums，请你找出数组中乘积最大的连续子数组（该数组中至少包含一个数字），并返回该子数组对应的乘积。
思路：动态规划

状态定义：dp[i][0]表示从第 0 项到第 i 项范围内的子数组的最小乘积，dp[i][1]表示从第 0 项到第 i 项范围内的子数组的最大乘积

初始状态：dp[0][0]=nums[0], dp[0][1]=nums[0]

分情况讨论:

不和别人乘，就 nums[i]自己
num[i] 是负数，希望乘上前面的最大积
num[i] 是正数，希望乘上前面的最小积
状态转移方程：

dp[i] [0]=min(dp[i−1] [0]∗num[i] , dp[i−1] [1] ∗ num[i], num[i])
dp[i] [1]=max(dp[i−1] [0]∗num[i] , dp[i−1] [1] ∗ num[i], num[i])
状态压缩：dp[i][x]只与dp[i][x]-1，所以只需定义两个变量，prevMin = nums[0]，prevMax = nums[0]

状态压缩之后的方程：

prevMin = Math.min(prevMin * num[i], prevMax * num[i], nums[i])
prevMax = Math.max(prevMin * num[i], prevMax * num[i], nums[i]) */
var maxProduct = function(nums) {
    let res = nums[0], preMin = nums[0], preMax = nums[0];
    let temp1 = 0, temp2 = 0;
    for(let i = 1; i < nums.length; i++) {
        temp1 = preMin * nums[i];
        temp2 = preMax * nums[i];
        preMin = Math.min(temp1, temp2, nums[i]);
        preMax = Math.max(temp1, temp2, nums[i]);
        res = Math.max(res, preMax);
    }
    return res;
};

/* 198.打家劫舍
 你是一个专业的小偷，计划偷窃沿街的房屋。每间房内都藏有一定的现金，影响你偷窃的唯一制约因素就是相邻的房屋装有相互连通的防盗系统，如果两间相邻的房屋在同一晚上被小偷闯入，系统会自动报警。

给定一个代表每个房屋存放金额的非负整数数组，计算你 不触动警报装置的情况下 ，一夜之内能够偷窃到的最高金额。
动态规划：一家必偷，两家挑最大，三家以上：dp[i] = Math.max(dp[i-1], dp[i-2] + nums[i])*/
var rob = function(nums) {
    if(!nums.length) {
        return 0;
    }
    let n = nums.length, dp = new Array(n).fill(0);
    dp[0] = nums[0], dp[1] =Math.max(nums[0], nums[1]);
    for(let i = 2; i < n; i++){
        dp[i] = Math.max(dp[i-1], dp[i-2] + nums[i]);
    }
    return dp[n-1];
};
var rob = function(nums) {
    if(!nums.length) {
        return 0;
    }
    if(nums.length === 1) {
        return nums[0];
    }
    let n = nums.length, first = nums[0], second = Math.max(nums[0], nums[1]);
    for(let i = 2; i < n; i++){
        let temp = second;
        second = Math.max(first + nums[i], second);
        first = temp;
    }
    return second;
};
/* 200.岛屿数量
给你一个由 '1'（陆地）和 '0'（水）组成的的二维网格，请你计算网格中岛屿的数量。

岛屿总是被水包围，并且每座岛屿只能由水平方向和/或竖直方向上相邻的陆地连接形成。

此外，你可以假设该网格的四条边均被水包围。*/
// dfs
/* DFS为什么要沉岛
    遍历遇到 1 即遇到土地，土地肯定在一个岛上，计数 +1
    如果不把与它和同在一个岛的土地变成 0，则DFS遍历到它们时，会对一个岛重复计数
   怎么找出同处一岛的所有 1
    DFS，以当前 1 为入口
    DFS 做的事情：
    1.将当前的 1 变 0
    2.当前坐标的上下左右依次递归，同处一个岛的 1 都变 0
    dfs 出口：超出矩阵边界，或遇到 0。不用沉岛，直接返回*/
var numIslands = function(grid) {
    let count = 0;
    for (let i = 0; i < grid.length; i++) {
        for (let j = 0; j < grid[0].length; j++) {
        if (grid[i][j] === '1') {
            count++;
            turnZero(i, j, grid);
        }
        }
    }
    return count;
};
function turnZero(i, j, grid) {
    if (i < 0 || i >= grid.length || j < 0 || j >= grid[0].length || grid[i][j] === '0') return
    grid[i][j] = '0';
    turnZero(i, j + 1, grid);
    turnZero(i, j - 1, grid);
    turnZero(i + 1, j, grid);
    turnZero(i - 1, j, grid);
}
// bfs
/*  1.遇到 1 就计数 +1
    2.维护一个队列，遇到 1 就让它的坐标入列
    3.节点出列，并考察四个方向，如果是 1，将它转为 0，并将节点入列
    4.如果越界了或遇到 0 ，则跳过不用入列
    5.出列...入列...直到没有可以入列的节点，则当前岛屿的所有 1 都转 0 了*/
var numIslands = function(grid) {
    let count = 0;
    let queue = [];
    for (let i = 0; i < grid.length; i++) {
        for (let j = 0; j < grid[0].length; j++) {
        if (grid[i][j] === '1') {
            count++;
            grid[i][j] = '0';// 做标记，避免重复遍历
            queue.push([i, j]);
            turnZero(queue, grid);
        }
        }
    }
    return count;
};
function turnZero(queue, grid) {
    const dirs = [[0, 1], [1, 0], [0, -1], [-1, 0]];
    while (queue.length) {
        const cur = queue.shift();
        for (const dir of dirs) {
        const x = cur[0] + dir[0];
        const y = cur[1] + dir[1];
        if (x < 0 || x >= grid.length || y < 0 || y >= grid[0].length || grid[x][y] !== '1') {
            continue
        }
        grid[x][y] = '0';
        queue.push([x, y]);
        }
    }
}
/* 207.课程表 
你这个学期必须选修 numCourses 门课程，记为 0 到 numCourses - 1 。

在选修某些课程之前需要一些先修课程。 先修课程按数组 prerequisites 给出，其中 prerequisites[i] = [ai, bi] ，表示如果要学习课程 ai 则 必须 先学习课程  bi 。

例如，先修课程对 [0, 1] 表示：想要学习课程 0 ，你需要先完成课程 1 。
请你判断是否可能完成所有课程的学习？如果可以，返回 true ；否则，返回 false 。*/
var canFinish = function(numCourses, prerequisites) {
    const inDegree = new Array(numCourses).fill(0); // 入度数组
  const map = {};                                 // 邻接表
  for (let i = 0; i < prerequisites.length; i++) {
    inDegree[prerequisites[i][0]]++;              // 求课的初始入度值
    if (map[prerequisites[i][1]]) {               // 当前课已经存在于邻接表
      map[prerequisites[i][1]].push(prerequisites[i][0]); // 添加依赖它的后续课
    } else {                                      // 当前课不存在于邻接表
      map[prerequisites[i][1]] = [prerequisites[i][0]];
    }
  }
  const queue = [];
  for (let i = 0; i < inDegree.length; i++) { // 所有入度为0的课入列
    if (inDegree[i] == 0) queue.push(i);
  }
  let count = 0;
  while (queue.length) {
    const selected = queue.shift();           // 当前选的课，出列
    count++;                                  // 选课数+1
    const toEnQueue = map[selected];          // 获取这门课对应的后续课
    if (toEnQueue && toEnQueue.length) {      // 确实有后续课
      for (let i = 0; i < toEnQueue.length; i++) {
        inDegree[toEnQueue[i]]--;             // 依赖它的后续课的入度-1
        if (inDegree[toEnQueue[i]] == 0) {    // 如果因此减为0，入列
          queue.push(toEnQueue[i]);
        }
      }
    }
  }
  return count == numCourses; // 选了的课等于总课数，true，否则false
}

/* 208.实现Trie(前缀树)
Trie（发音类似 "try"）或者说 前缀树 是一种树形数据结构，用于高效地存储和检索字符串数据集中的键。这一数据结构有相当多的应用情景，例如自动补完和拼写检查。

请你实现 Trie 类：

Trie() 初始化前缀树对象。
void insert(String word) 向前缀树中插入字符串 word 。
boolean search(String word) 如果字符串 word 在前缀树中，返回 true（即，在检索之前已经插入）；否则，返回 false 。
boolean startsWith(String prefix) 如果之前已经插入的字符串 word 的前缀之一为 prefix ，返回 true ；否则，返回 false 。 */
var Trie = function() {
    this.children = {};
};

Trie.prototype.insert = function(word) {
    let node = this.children;
    for (const ch of word) {
        if (!node[ch]) {
            node[ch] = {};
        }
        node = node[ch];
    }
    node.isEnd = true;
};

Trie.prototype.searchPrefix = function(prefix) {
    let node = this.children;
    for (const ch of prefix) {
        if (!node[ch]) {
            return false;
        }
        node = node[ch];
    }
    return node;
}

Trie.prototype.search = function(word) {
    const node = this.searchPrefix(word);
    return node !== undefined && node.isEnd !== undefined;
};

Trie.prototype.startsWith = function(prefix) {
    return this.searchPrefix(prefix);
};

/* 221.最大正方形
在一个由 '0' 和 '1' 组成的二维矩阵内，找到只包含 '1' 的最大正方形，并返回其面积。 */
/* 暴力求解
找到一个值为1的元素，把它当做是正方形的左上角元素，每次新增一行一列并且判断新增的所有元素都为1，都为1当前正方形边长+1；记录最大边长，乘积即为最大面积 
时间复杂度：O(mn *min(m,n)2)
空间复杂度：O（1）*/
var maximalSquare = function(matrix) {
    let maxSide = 0;
    if (matrix == null || matrix.length == 0 || matrix[0].length == 0) {
        return maxSide;
    }
    let m = matrix.length, n = matrix[0].length;
    for (let i = 0; i < m; i++) {
        for (let j = 0; j < n; j++) {
            if (matrix[i][j] == '1') {
                // 遇到一个 1 作为正方形的左上角
                maxSide = Math.max(maxSide, 1);
                // 计算可能的最大正方形边长
                let currentMaxSide = Math.min(m - i, n - j);
                for (let k = 1; k < currentMaxSide; k++) {
                    // 判断新增的一行一列是否均为 1
                    let flag = true;
                    if (matrix[i + k][j + k] == '0') {
                        break;
                    }
                    for (let temp = 0; temp < k; temp++) {
                        if (matrix[i + k][j + temp] == '0' || matrix[i + temp][j + k] == '0') {
                            flag = false;
                            break;
                        }
                    }
                    if (flag) {
                        maxSide = Math.max(maxSide, k + 1);
                    } else {
                        break;
                    }
                }
            }
        }
    }
    let maxSquare = maxSide * maxSide;
    return maxSquare;
};
/* 动态规划
 dp[i][j]表示以（i，j）为右下角的正方形边长最大值，只有当前元素matrix[i][j]为1的时候，最大正方形才可能转移，转移方程为：
    dp(i,j)=min(dp(i−1,j),dp(i−1,j−1),dp(i,j−1))+1
 边界条件：当i或j有一个为0，且当前元素值为1，dp[i][j]为1
 时间空间复杂度：O（mn）*/
var maximalSquare = function(matrix) {
    if(!matrix.length) {
        return 0;
    }
    let m = matrix.length, n = matrix[0].length, max = Number.MIN_VALUE;
    let dp = new Array(m).fill().map(() =>{return new Array(n).fill(0)});
    for(let i = 0; i < m; i++) {
        for(let j = 0; j <n; j++) {
            if(matrix[i][j] == "1"){
                if(i == 0 || j == 0){
                    dp[i][j] = 1;
                } else {
                    dp[i][j] = Math.min(dp[i-1][j], dp[i][j-1], dp[i-1][j-1]) + 1;
                }
                max = Math.max(dp[i][j], max);
            }
            
        }
    } 
    return max * max;
};

/* 236.二叉树的最近公共祖先
 给定一个二叉树, 找到该树中两个指定节点的最近公共祖先。

百度百科中最近公共祖先的定义为：“对于有根树 T 的两个节点 p、q，最近公共祖先表示为一个节点 x，满足 x 是 p、q 的祖先且 x 的深度尽可能大（一个节点也可以是它自己的祖先）。”*/
/* 思路：深度优先搜索
 最近公共祖先判断条件：(lson && rson)∣∣((x = p∣∣x = q) && (lson​∣∣rson​))
(lson && rson)表示两个节点pq各在当前节点的一条子树上，((x = p∣∣x = q) && (lson​∣∣rson​))表示当前节点为两个节点中的一个，且另一个在当前节点的子树上
由于布尔值是从叶子结点开始赋值的，所以满足条件时，最近的祖先肯定会先访问到，满足题意*/
var lowestCommonAncestor = function(root, p, q) {
    let res;
    const dfs = function(root, p, q){
        if(root === null) {
            return false;
        }
        const lson = dfs(root.left, p, q);
        const rson = dfs(root.right, p, q);
        if((lson && rson) || ((root.val === p.val || root.val === q.val) && (lson || rson))) {
            res = root;
        }
        return lson || rson || (root.val === p.val || root.val === q.val);
    }
    dfs(root, p, q);
    return res;
};
var lowestCommonAncestor = function(root, p, q) {
    // 使用递归的方法
    // 需要从下到上，所以使用后序遍历
    // 1. 确定递归的函数
    const travelTree = function(root,p,q) {
        // 2. 确定递归终止条件
        if(root === null || root === p||root === q) {
            return root;
        }
        // 3. 确定递归单层逻辑
        let left = travelTree(root.left,p,q);
        let right = travelTree(root.right,p,q);
        if(left !== null&&right !== null) {
            return root;
        }
        if(left ===null) {
            return right;
        }
        return left;
    }
   return  travelTree(root,p,q)
};
/* 238.除自身以外数组的乘积
给你一个整数数组 nums，返回 数组 answer ，其中 answer[i] 等于 nums 中除 nums[i] 之外其余各元素的乘积 。

题目数据 保证 数组 nums之中任意元素的全部前缀元素和后缀的乘积都在  32 位 整数范围内。

请不要使用除法，且在 O(n) 时间复杂度内完成此题。*/

/* 左右两侧乘积法 不开辟左右空间：O（n）， O（1）*/
var productExceptSelf = function(nums) {
    let n = nums.length;
    let res = new Array(n);
    res[0] = 1;
    for(let i = 1; i < n; i++ ){
        res[i] = nums[i-1] * res[i-1];
    }
    let rightRes = 1;
    for(let i = n-1; i >= 0; i--){
        res[i] *= rightRes;
        rightRes *= nums[i];
    }
    return res;
};
/* 左右两侧乘积 开辟左右空间： O（n）， O（n） */
var productExceptSelf = function(nums) {
    const length = nums.length;

    // L 和 R 分别表示左右两侧的乘积列表
    const L = new Array(length);
    const R = new Array(length);

    const answer = new Array(length);

    // L[i] 为索引 i 左侧所有元素的乘积
    // 对于索引为 '0' 的元素，因为左侧没有元素，所以 L[0] = 1
    L[0] = 1;
    for (let i = 1; i < length; i++) {
        L[i] = nums[i - 1] * L[i - 1];
    }

    // R[i] 为索引 i 右侧所有元素的乘积
    // 对于索引为 'length-1' 的元素，因为右侧没有元素，所以 R[length-1] = 1
    R[length - 1] = 1;
    for (let i = length - 2; i >= 0; i--) {
        R[i] = nums[i + 1] * R[i + 1];
    }

    // 对于索引 i，除 nums[i] 之外其余各元素的乘积就是左侧所有元素的乘积乘以右侧所有元素的乘积
    for (let i = 0; i < length; i++) {
        answer[i] = L[i] * R[i];
    }

    return answer;
};

/* 240. 搜索二维矩阵
 编写一个高效的算法来搜索 m x n 矩阵 matrix 中的一个目标值 target 。该矩阵具有以下特性：

每行的元素从左到右升序排列。
每列的元素从上到下升序排列。
 */
/* 二分 */
var searchMatrix = function(matrix, target) {
    for (const row of matrix) {
        const index = search(row, target);
        if (index >= 0) {
            return true;
        }
    }
    return false;
};

const search = (nums, target) => {
    let low = 0, high = nums.length - 1;
    while (low <= high) {
        const mid = Math.floor((high - low) / 2) + low;
        const num = nums[mid];
        if (num === target) {
            return mid;
        } else if (num > target) {
            high = mid - 1;
        } else {
            low = mid + 1;
        }
    }
    return -1;
}
/* z字形查找 */
var searchMatrix = function(matrix, target) {
    const m = matrix.length, n = matrix[0].length;
    let x = 0, y = n - 1;
    while (x < m && y >= 0) {
        if (matrix[x][y] === target) {
            return true;
        }
        if (matrix[x][y] > target) {
            --y;
        } else {
            ++x;
        }
    }
    return false;
};

/* 279.完全平方数 
给你一个整数 n ，返回 和为 n 的完全平方数的最少数量 。

完全平方数 是一个整数，其值等于另一个整数的平方；换句话说，其值等于一个整数自乘的积。例如，1、4、9 和 16 都是完全平方数，而 3 和 11 不是。*/
/* 动态规划：O（n*n1/2），O（n） */
var numSquares = function(n) {
    let f = new Array(n+1).fill(0);
    for(let i = 1; i <= n; i++) {
        let minn = Number.MAX_VALUE;
        for(let j = 1; j * j <= i; j++) {
            minn = Math.min(minn, f[i - j*j]);
        }
        f[i] = minn + 1;
    }
    return f[n];
}
/* 四平方和定理 */
var numSquares = function(n) {
    if (isPerfectSquare(n)) {
        return 1;
    }
    if (checkAnswer4(n)) {
        return 4;
    }
    for (let i = 1; i * i <= n; i++) {
        let j = n - i * i;
        if (isPerfectSquare(j)) {
            return 2;
        }
    }
    return 3;
}

// 判断是否为完全平方数
const isPerfectSquare = (x) => {
    const y = Math.floor(Math.sqrt(x));
    return y * y == x;
}

// 判断是否能表示为 4^k*(8m+7)
const checkAnswer4 = (x) => {
    while (x % 4 == 0) {
        x /= 4;
    }
    return x % 8 == 7;
}

/* 287.寻找重复数 
给定一个包含 n + 1 个整数的数组 nums ，其数字都在 [1, n] 范围内（包括 1 和 n），可知至少存在一个重复的整数。

假设 nums 只有 一个重复的整数 ，返回 这个重复的数 。

你设计的解决方案必须 不修改 数组 nums 且只用常量级 O(1) 的额外空间。*/
/* 硬找 */
var findDuplicate = function(nums) {
    for(let i = 0; i < nums.length; i++) {
        if(nums.indexOf(nums[i]) != i) {
            return nums[i];
        }
    }
};
/* 二分 */
var findDuplicate = function(nums) {
    const n = nums.length;
    let l = 1, r = n - 1, ans = -1;
    while (l <= r) {
        let mid = (l + r) >> 1;
        let cnt = 0;
        for (let i = 0; i < n; ++i) {
            cnt += nums[i] <= mid;
        }
        if (cnt <= mid) {
            l = mid + 1;
        } else {
            r = mid - 1;
            ans = mid;
        }
    }
    return ans;
};
/* 快慢指针 :O(n),O(1)*/
var findDuplicate = function(nums) {
    let slow = 0, fast = 0;
    slow = nums[slow];
    fast = nums[nums[fast]];
    while(slow != fast) {
        slow = nums[slow];
        fast = nums[nums[fast]];
    }
    slow = 0;
    while(slow != fast) {
        slow = nums[slow];
        fast = nums[fast];
    }
    return slow;
};

/* 300.最长递增子序列
给你一个整数数组 nums ，找到其中最长严格递增子序列的长度。

子序列 是由数组派生而来的序列，删除（或不删除）数组中的元素而不改变其余元素的顺序。例如，[3,6,2,7] 是数组 [0,3,1,6,2,2,7] 的子序列。
*/
/* 动态规划，O（n2），O（n） */
var lengthOfLIS = function(nums) {
    if(nums.length == 0) {
        return 0;
    }
    let dp = new Array(nums.length).fill(1);
    let maxlen = 1;
    for(let i = 1; i < nums.length; i++) {
        for(let j = 0; j < i; j++) {
            if(nums[i] > nums[j]) {
                dp[i] = Math.max(dp[i], dp[j] + 1);
            }
        }
        maxlen = Math.max(maxlen, dp[i]);
    }
    return maxlen;
};
/* 二分查找，O（nlogn），O（n） */
var lengthOfLIS = function(nums) {
    let n = nums.length;
    if(n <= 1){
        return n;
    }
    let tail = [nums[0]];
    for(let i = 0; i < n; i++) {
        if(nums[i] > tail[tail.length - 1]) {
            tail.push(nums[i]);
        } else {
            let left = 0, right = tail.length - 1;
            while(left < right){
                let mid = (left + right) >> 1;
                if(tail[mid] < nums[i]){
                    left = mid + 1;
                } else {
                    right = mid;
                }
            }
            tail[left] = nums[i];
        }
    }
    return tail.length;
};

/* 309.最佳买卖股票时机含冷冻期 */
/* 动态规划，O（n），O（n）
状态一：买入股票状态（今天买入股票，或者是之前就买入了股票然后没有操作）
卖出股票状态，这里就有两种卖出股票状态
状态二：两天前就卖出了股票，度过了冷冻期，一直没操作，今天保持卖出股票状态
状态三：今天卖出了股票
状态四：今天为冷冻期状态，但冷冻期状态不可持续，只有一天！

达到买入股票状态（状态一）即：dp[i][0]，有两个具体操作：

    操作一：前一天就是持有股票状态（状态一），dp[i][0] = dp[i - 1][0]
    操作二：今天买入了，有两种情况
            前一天是冷冻期（状态四），dp[i - 1][3] - prices[i]
            前一天是保持卖出股票状态（状态二），dp[i - 1][1] - prices[i]
    所以操作二取最大值，即：max(dp[i - 1][3], dp[i - 1][1]) - prices[i]
    那么dp[i][0] = max(dp[i - 1][0], max(dp[i - 1][3], dp[i - 1][1]) - prices[i]);

达到保持卖出股票状态（状态二）即：dp[i][1]，有两个具体操作：

    操作一：前一天就是状态二
    操作二：前一天是冷冻期（状态四）
    dp[i][1] = max(dp[i - 1][1], dp[i - 1][3]);

达到今天就卖出股票状态（状态三），即：dp[i][2] ，只有一个操作：

    操作一：昨天一定是买入股票状态（状态一），今天卖出
    即：dp[i][2] = dp[i - 1][0] + prices[i];

达到冷冻期状态（状态四），即：dp[i][3]，只有一个操作：

    操作一：昨天卖出了股票（状态三）
    p[i][3] = dp[i - 1][2];*/
var maxProfit = function(prices) {
    if(prices.length < 2) {
        return 0;
    } else if(prices.length < 3) {
        return Math.max(0, prices[1] - prices[0]);
    }
    let dp = Array.from(new Array(prices.length), () => Array(4).fill(0));
    dp[0][0] = 0 - prices[0];

    for(i = 1; i < prices.length; i++) {
        dp[i][0] = Math.max(dp[i - 1][0], Math.max(dp[i-1][1], dp[i-1][3]) - prices[i]);
        dp[i][1] = Math.max(dp[i -1][1], dp[i - 1][3]);
        dp[i][2] = dp[i-1][0] + prices[i];
        dp[i][3] = dp[i-1][2];
    }

    return Math.max(dp[prices.length - 1][1], dp[prices.length - 1][2], dp[prices.length - 1][3]);
};

/* 337.打家劫舍三
 小偷又发现了一个新的可行窃的地区。这个地区只有一个入口，我们称之为 root 。

除了 root 之外，每栋房子有且只有一个“父“房子与之相连。一番侦察之后，聪明的小偷意识到“这个地方的所有房屋的排列类似于一棵二叉树”。 如果 两个直接相连的房子在同一天晚上被打劫 ，房屋将自动报警。

给定二叉树的 root 。返回 在不触动警报的情况下 ，小偷能够盗取的最高金额 。*/
/* 动态规划+dfs */
var rob = function(root) {
    const dfs = (node) => {
        if(node === null) {
            return [0,0];
        }
        const l = dfs(node.left);
        const r = dfs(node.right);
        const selected = node.val + l[1] + r[1];
        const notSelected = Math.max(l[0], l[1]) + Math.max(r[0], r[1]);
        return [selected, notSelected];
    }
    let res = dfs(root);
    return Math.max(res[0], res[1]);
}

/* 347.前k个高频元素 
给你一个整数数组 nums 和一个整数 k ，请你返回其中出现频率前 k 高的元素。你可以按 任意顺序 返回答案*/
let topKFrequent = function(nums, k) {
    let map = new Map(), arr = Array.from(new Set(nums));
    nums.map((num) => {
        if(map.has(num)) {
            map.set(num, map.get(num) + 1);
        } else {
            map.set(num, 1);
        }
    })
    arr.sort((a,b) => map.get(b) - map.get(a));
    return arr.slice(0,k);
};

/* 394.字符串解码 */
/* 利用栈 */
var decodeString = (s) => {
    let stack = []
    for (const char of s) {
      if (char !== ']') { // ] 前的字符都入栈
        stack.push(char)
        continue
      }
      let cur = stack.pop() // 弹出一个来检测
      let str = '' // 组装字符串
      // 接下来肯定是遇到字母，直到遇到 [
      while (cur !== '[') {
        str = cur + str // cur字符加在左边
        cur = stack.pop() // 再拉出一个
      }
      // 此时cur为 [，接下来要遇到数字
      let num = ''
      cur = stack.pop() // 用下一个将 [ 覆盖
      while (!isNaN(cur)) {
        num = cur + num // 数字字符加在左边
        cur = stack.pop() // 再拉出一个
      }
      // 现在要么是字母，要么是 [
      stack.push(cur)
      stack.push(str.repeat(num))
    }
    return stack.join('')
  }
  /* 递归 */
  var decodeString = function(s, cur = 0) {
    let k = 0;
    let decoded = '';
    while (cur < s.length) {
        if (s[cur] === '[') {
            const [str, pos] = decodeString(s, cur + 1);
            decoded += str.repeat(k);
            k = 0;
            cur = pos;
        } else if (s[cur] === ']') {
            return [decoded, cur + 1];
        } else if (/[0-9]/.test(s[cur])) {
            k = k * 10 + parseInt(s[cur++]);
        } else {
            decoded += s[cur++];
        }
    }
    return decoded;
};

/* 399.除法求职
给你一个变量对数组 equations 和一个实数值数组 values 作为已知条件，其中 equations[i] = [Ai, Bi] 和 values[i] 共同表示等式 Ai / Bi = values[i] 。每个 Ai 或 Bi 是一个表示单个变量的字符串。

另有一些以数组 queries 表示的问题，其中 queries[j] = [Cj, Dj] 表示第 j 个问题，请你根据已知条件找出 Cj / Dj = ? 的结果作为答案。

返回 所有问题的答案 。如果存在某个无法确定的答案，则用 -1.0 替代这个答案。如果问题中出现了给定的已知条件中没有出现的字符串，也需要用 -1.0 替代这个答案。

注意：输入总是有效的。你可以假设除法运算中不会出现除数为 0 的情况，且不存在任何矛盾的结果。*/
/* 广度优先搜索 */
var calcEquation = function(equations, values, queries) {
    let nvars = 0;
    const variables = new Map();

    const n = equations.length;
    for (let i = 0; i < n; i++) {
        if (!variables.has(equations[i][0])) {
            variables.set(equations[i][0], nvars++);
        }
        if (!variables.has(equations[i][1])) {
            variables.set(equations[i][1], nvars++);
        }
    }

    // 对于每个点，存储其直接连接到的所有点及对应的权值
    const edges = new Array(nvars).fill(0);
    for (let i = 0; i < nvars; i++) {
        edges[i] = [];
    }
    for (let i = 0; i < n; i++) {
        const va = variables.get(equations[i][0]), vb = variables.get(equations[i][1]);
        edges[va].push([vb, values[i]]);
        edges[vb].push([va, 1.0 / values[i]]);
    }

    const queriesCount = queries.length;
    const ret = [];
    for (let i = 0; i < queriesCount; i++) {
        const query = queries[i];
        let result = -1.0;
        if (variables.has(query[0]) && variables.has(query[1])) {
            const ia = variables.get(query[0]), ib = variables.get(query[1]);
            if (ia === ib) {
                result = 1.0;
            } else {
                const points = [];
                points.push(ia);
                const ratios = new Array(nvars).fill(-1.0);
                ratios[ia] = 1.0;

                while (points.length && ratios[ib] < 0) {
                    const x = points.pop();
                    for (const [y, val] of edges[x]) {
                        if (ratios[y] < 0) {
                            ratios[y] = ratios[x] * val;
                            points.push(y);
                        }
                    }
                }
                result = ratios[ib];
            }
        }
        ret[i] = result;
    }
    return ret;
};

/* 406.根据身高重建队列
 假设有打乱顺序的一群人站成一个队列，数组 people 表示队列中一些人的属性（不一定按顺序）。每个 people[i] = [hi, ki] 表示第 i 个人的身高为 hi ，前面 正好 有 ki 个身高大于或等于 hi 的人。

请你重新构造并返回输入数组 people 所表示的队列。返回的队列应该格式化为数组 queue ，其中 queue[j] = [hj, kj] 是队列中第 j 个人的属性（queue[0] 是排在队列前面的人）。
*/
/* 按身高从高到低排列，按前面有多少高的人插入新队列 */
var reconstructQueue = function(people) {
    people.sort((a,b) => a[0] === b[0] ? a[1] - b[1] : b[0] - a[0]);
    let queue = [];
    for(let i = 0; i < people.length; i++) {
        queue.splice(people[i][1], 0 , people[i]);
    }
    return queue;
};
var reconstructQueue = function(people) {
    people.sort((a, b) => a[0] - b[0] || b[1] - a[1]);
    return people.reduce((p, v, t) => (t = v[1], p[p.findIndex(_=>_ === void 0 && t-- === 0)] = v, p), Array(people.length));
};

/* 416.分割等和子集 
给你一个 只包含正整数 的 非空 数组 nums 。请你判断是否可以将这个数组分割成两个子集，使得两个子集的元素和相等。*/
/* 动态规划 */
var canPartition = function(nums) {
    if(nums.length < 2) {
        return false;
    }
    let sum = 0, maxNum = 0;
    for(const num of nums) {
        sum += num;
        maxNum = maxNum > num ? maxNum : num;
    }
    if(sum % 2 == 1) {
        return false;
    }
    let target = Math.floor(sum / 2);
    if(maxNum > target){
        return false;
    }
    let dp = new Array(target + 1).fill(false);
    dp[0] = true;
    for(const num of nums){
        for(let j = target; j >= num; --j){
            dp[j] = dp[j] | dp[j - num];
        }
    }
    return dp[target];
};

/* 437.路径总和三
 给定一个二叉树的根节点 root ，和一个整数 targetSum ，求该二叉树里节点值之和等于 targetSum 的 路径 的数目。

路径 不需要从根节点开始，也不需要在叶子节点结束，但是路径方向必须是向下的（只能从父节点到子节点）*/
/* 动态规划 */
var pathSum = function(root, targetSum) {
    if (root == null) {
        return 0;
    }
    
    let ret = rootSum(root, targetSum);
    ret += pathSum(root.left, targetSum);
    ret += pathSum(root.right, targetSum);
    return ret;
};
const rootSum = (root, targetSum) => {
    let ret = 0;

    if (root == null) {
        return 0;
    }
    const val = root.val;
    if (val === targetSum) {
        ret++;
    } 

    ret += rootSum(root.left, targetSum - val);
    ret += rootSum(root.right, targetSum - val);
    return ret;
}
/* 前缀和 */
var pathSum = function(root, targetSum) {
    const prefix = new Map();
    prefix.set(0, 1);
    return dfs(root, prefix, 0, targetSum);
}

const dfs = (root, prefix, curr, targetSum) => {
    if (root == null) {
        return 0;
    }

    let ret = 0;
    curr += root.val;

    ret = prefix.get(curr - targetSum) || 0;
    prefix.set(curr, (prefix.get(curr) || 0) + 1);
    ret += dfs(root.left, prefix, curr, targetSum);
    ret += dfs(root.right, prefix, curr, targetSum);
    prefix.set(curr, (prefix.get(curr) || 0) - 1);

    return ret;
}

/* 438.找到字符串中所有字母异位词 
给定两个字符串 s 和 p，找到 s 中所有 p 的 异位词 的子串，返回这些子串的起始索引。不考虑答案输出的顺序。

异位词 指由相同字母重排列形成的字符串（包括相同的字符串）。

滑动窗口*/
var findAnagrams = function(s, p) {
    const sLen = s.length, pLen = p.length;
    if(sLen < pLen) {
        return [];
    }
    const ans = [], sCount = new Array(26).fill(0), pCount = new Array(26).fill(0);
    for(let i = 0; i < pLen; i++) {
        sCount[s[i].charCodeAt() - 'a'.charCodeAt()]++;
        pCount[p[i].charCodeAt() - 'a'.charCodeAt()]++;
    }
    if(sCount.toString() === pCount.toString()) {
        ans.push(0);
    }
    for(let i = 0; i < sLen - pLen; i++) {
        sCount[s[i].charCodeAt() - 'a'.charCodeAt()]--;
        sCount[s[i + pLen].charCodeAt() - 'a'.charCodeAt()]++;
        if(sCount.toString() === pCount.toString()) {
            ans.push(i+1);
        }
    }
    return ans;
}

/* 494.目标和
 给你一个整数数组 nums 和一个整数 target 。

向数组中的每个整数前添加 '+' 或 '-' ，然后串联起所有整数，可以构造一个 表达式 ：*/
/* 动态规划 */
var findTargetSumWays = function(nums, target) {
    let sum = 0;
    for(let num of nums) {
        sum += num;
    }
    const diff = sum - target;
    if(diff < 0 || diff % 2 !== 0) {
        return 0;
    }
    const neg = Math.floor(diff / 2);
    const dp = new Array(neg + 1).fill(0);
    dp[0] = 1;
    for(let num of nums) {
        for(let j = neg; j >= num; j--) {
            dp[j] += dp[j - num];
        }
    }
    return dp[neg];
}

/* 538.把二叉树转换为累加树
给出二叉 搜索 树的根节点，该树的节点值各不相同，请你将其转换为累加树（Greater Sum Tree），使每个节点 node 的新值等于原树中大于或等于 node.val 的值之和。

提醒一下，二叉搜索树满足下列约束条件：

节点的左子树仅包含键 小于 节点键的节点。
节点的右子树仅包含键 大于 节点键的节点。
左右子树也必须是二叉搜索树。

反序的中序遍历 */
var convertBST = function(root) {
    let sum = 0;
    const convertInOrder = (root) => {
        if (root) {  // 遍历到null节点，开始返回
            convertInOrder(root.right); // 先进入右子树

            sum += root.val;     // 节点值累加给sum
            root.val = sum;      // 累加的结果，赋给root.val
        
            convertInOrder(root.left);  // 然后才进入左子树
        }
    };
    convertInOrder(root); // 递归的入口，从根节点开始
    return root;
}; 

/* 560.和为k子数组 */
/* 暴力枚举 */
var subarraySum = function(nums, k) {
    let count = 0;
    for(let i = 0; i < nums.length; i++) {
        let sum = 0;
        for(let j = i; j >= 0; j--){
            sum += nums[j];
            if(sum === k) {
                count++;
            }
        }
    }
    return count;
}
/* 前缀和 */
var subarraySum = function(nums, k) {
    const mp = new Map();
    mp.set(0,1);
    let count = 0, prev = 0;
    for(let num of nums) {
        prev += num;
        if(mp.has(prev - k)) {
            count += mp.get(prev - k);
        }
        if(mp.has(prev)) {
            mp.set(prev, mp.get(prev) + 1);
        } else {
            mp.set(prev, 1);
        }
    }
    return count;
}

/* 581.最短无序子数组
给你一个整数数组 nums ，你需要找出一个 连续子数组 ，如果对这个子数组进行升序排序，那么整个数组都会变为升序排序。

请你找出符合题意的 最短 子数组，并输出它的长度。
进阶：你可以设计一个时间复杂度为 O(n) 的解决方案吗？ */
var findUnsortedSubarray = function(nums) {
    if(isSorted(nums)) {
        return 0;
    }
    const numsSorted = [...nums].sort((a,b) => a-b);
    let left = 0;
    while(nums[left] === numsSorted[left]) {
        left ++;
    }
    let right = nums.length - 1;
    while(nums[right] === numsSorted[right]) {
        right --;
    }
    return right - left + 1;
}
const isSorted =function(nums) {
    for (let i = 1; i < nums.length; i++) {
        if (nums[i] < nums[i - 1]) {
            return false;
        }
    }
    return true;
}
var findUnsortedSubarray = function(nums) {
    const n = nums.length;
    let maxn = -Number.MAX_VALUE, right = -1;
    let minn = Number.MAX_VALUE, left = -1;
    for (let i = 0; i < n; i++) {
        if (maxn > nums[i]) {
            right = i;
        } else {
            maxn = nums[i];
        }
        if (minn < nums[n - i - 1]) {
            left = n - i - 1;
        } else {
            minn = nums[n - i - 1];
        }
    }
    return right === -1 ? 0 : right - left + 1;
};

/* 621.任务调度器
给你一个用字符数组 tasks 表示的 CPU 需要执行的任务列表。其中每个字母表示一种不同种类的任务。任务可以以任意顺序执行，并且每个任务都可以在 1 个单位时间内执行完。在任何一个单位时间，CPU 可以完成一个任务，或者处于待命状态。

然而，两个 相同种类 的任务之间必须有长度为整数 n 的冷却时间，因此至少有连续 n 个单位时间内 CPU 在执行不同的任务，或者在待命状态。

你需要计算完成所有任务所需要的 最短时间 。 */
var leastInterval = function(tasks, n) {
    const freq = _.countBy(tasks);

    // 最多的执行次数
    const maxExec = Math.max(...Object.values(freq));
    // 具有最多执行次数的任务数量
    let maxCount = 0;
    Object.values(freq).forEach(v => {
        if (v === maxExec) {
            maxCount++;
        }
    })

    return Math.max((maxExec - 1) * (n + 1) + maxCount, tasks.length);
};
var leastInterval = function(tasks, n) {
    let arr = Array(26).fill(0);
    for (let c of tasks) {
        //统计各个字母出现的次数
        arr[c.charCodeAt() - "A".charCodeAt()]++;
    }
    let max = 0;
    for (let i = 0; i < 26; i++) {
        //找到最大次数
        max = Math.max(max, arr[i]);
    }
    let ret = (max - 1) * (n + 1); //计算前n-1行n的间隔的时间大小
    for (let i = 0; i < 26; i++) {
        //计算和最大次数相同的字母个数，然后累加进ret
        if (arr[i] == max) {
            ret++;
        }
    }
    return Math.max(ret, tasks.length); //在tasks的长度和ret中取较大的一个
};

var countSubstrings = function(s) {
    const n = s.length;
    let ans = 0;
    for (let i = 0; i < 2 * n - 1; ++i) {
        let l = i / 2, r = i / 2 + i % 2;
        while (l >= 0 && r < n && s.charAt(l) == s.charAt(r)) {
            --l;
            ++r;
            ++ans;
        }
    }
    return ans;
};
var countSubstrings = function(s) {
    let n = s.length;
    let t = ['$', '#'];
    for (let i = 0; i < n; ++i) {
        t.push(s.charAt(i));
        t.push('#');
    }
    n = t.length;
    t.push('!');
    t = t.join('');

    const f = new Array(n);
    let iMax = 0, rMax = 0, ans = 0;
    for (let i = 1; i < n; ++i) {
        // 初始化 f[i]
        f[i] = i <= rMax ? Math.min(rMax - i + 1, f[2 * iMax - i]) : 1;
        // 中心拓展
        while (t.charAt(i + f[i]) == t.charAt(i - f[i])) {
            ++f[i];
        }
        // 动态维护 iMax 和 rMax
        if (i + f[i] - 1 > rMax) {
            iMax = i;
            rMax = i + f[i] - 1;
        }
        // 统计答案, 当前贡献为 (f[i] - 1) / 2 上取整
        ans += Math.floor(f[i] / 2);
    }

    return ans;
};

/* 739.每日温度
给定一个整数数组 temperatures ，表示每天的温度，返回一个数组 answer ，其中 answer[i] 是指在第 i 天之后，才会有更高的温度。如果气温在这之后都不会升高，请在该位置用 0 来代替。 */
/* 暴力 O(n2), O(1)*/
var dailyTemperatures = function(temperatures) {
    const res = new Array(temperatures.length).fill(0);
    for(let i = 0; i < temperatures.length; i++) {
        for(let j = i+1; j < temperatures.length; j++) {
            if(temperatures[j] > temperatures[i]) {
                res[i] = j - i;
                break;
            }
        }
    }
    return res;
};
/* 单调栈 O(n), O(n)*/
var dailyTemperatures = function(temperatures) {
    const res = new Array(temperatures.length).fill(0);
    let stack = [];
    for(let i = temperatures.length - 1; i >= 0; i--) {
        while(stack.length && temperatures[i] >= temperatures[stack[stack.length - 1]]) {
            stack.pop();
        }
        if(stack.length) {
            res[i] = stack[stack.length - 1] - i;
        }
        stack.push(i)
    }
    return res;
};