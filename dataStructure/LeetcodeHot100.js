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
var myAtoi = function(s) {
    const number = parseInt(s, 10);

    if(isNaN(number)) {
        return 0;
    } else if (number < Math.pow(-2, 31) || number > Math.pow(2, 31) - 1) {
        return number < Math.pow(-2, 31) ? Math.pow(-2, 31) : Math.pow(2, 31) - 1;
    } else {
        return number;
    }
  }
//正则
var myAtoi = function(s) {
    const re = new RegExp(/^(-|\+)?\d+/);
    let str = s.trim().match(re);
    let res = str ? Number(str[0]) : 0;
    return res >= 0 ? Math.min(res, 2**31 - 1) : Math.max(res, -(2**31))
};
//自动机
/**
 * @param {string} str
 * @return {number}
 */
 var myAtoi = function(str) {
    // 自动机类
    class Automaton{
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
  
        if(this.state === 'in_number') {
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
    for(let char of str) {
      // 依次进行转换
      automaton.get(char);
    }
  
    // 返回值，整数 = 正负 * 数值
    return automaton.sign * automaton.answer;
  };
/* 19.给你一个链表，删除链表的倒数第 n 个结点，并且返回链表的头结点。 */
// 思路：快慢指针发，先让快指针走n步，然后快慢指针一起走，等快指针到链表末尾，慢指针的下一节点便是要删除节点
var removeNthFromEnd = function(head, n) {
    let fast = head, slow = head;
    for(let i = 0; i < n; i++){
        fast = fast.next;
    }
    if(!fast){
        return head.next;
    }
    while(fast.next){
        fast = fast.next;
        slow = slow.next;
    }
    slow.next = slow.next.next;
    return head;
};