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