var majorityElement = function(nums) {
    const k = nums.length >> 1;
    const map = new Map();
    for(let i = 0; i < nums.length; i++){
        if(!map.get(nums[i])){
            map.set(nums[i],1);
        }else{
            map.set(nums[i],map.get(nums[i]) + 1);
        }
    }
    for(arr of map){
        if(arr[1] > k){
            return arr;
        }
    }
};
let nums = [1, 2, 3, 2, 2, 2, 5, 4, 2];
console.log(majorityElement(nums));
var isMatch = function(s, p) {
    const m = s.length, n = p.length;
    const dp = new Array(m + 1).fill(0).map(x => new Array(n + 1).fill(false));
    dp[0][0] = true;
    for(let i = 2; i <= n; i += 2) {
        dp[0][i] = dp[0][i-2] && p[i-1] === '*';
    }
    for(let i = 1; i <= m; i++){
        for(let j = 1; j <= n; j++) {
            if(p[j-1] === '*') {
                dp[i][j] = dp[i][j-2] || dp[i-1][j] && (s[i-1] === p[j-2] || p[j-2] === '.');
            } else {
                dp[i][j] = dp[i-1][j-1] && (s[i-1] === p[j-1] || p[j-1] === '.');
            }
        }
    }
    return dp[m][n];
}
var nthUglyNumber = function(n) {
    const dp = new Array(n+1).fill(0);
    dp[1] = 1;
    let p2 = 1, p3 = 1, p5 = 1;
    for(let i = 2; i <= n; i++) {
        const num2 = dp[p2] * 2, num3 = dp[p3] * 3, num5 = dp[p5] * 5;
        dp[i] = Math.min(num2, num3, num5);
        if(dp[i] === num2) {
            p2++;
        }
        if(dp[i] === num3) {
            p3++;
        }
        if(dp[i] === num5) {
            p5++;
        }
    }
    return dp[n]
}
var dicesProbability = function(n) {
    let dp = new Array(6).fill(1/6);
    for(let i = 2; i <= n; i++) {
        let temp = new Array(5 * i + 1).fill(0);
        for(let j = 0; j < dp.length; j++) {
            for(let k = 0; k < 6; k++) {
                temp[j + k] += dp[j] / 6;
            }
        }
        dp = temp
    }
    return dp;
}
var permutation = function(s) {
    const res = [], vis = [];
    const arr = Array.from(s).sort();
    const n = s.length;
    const cur = [];
    const backTrack = function(arr, i, n, cur) {
        if(i === n) {
            res.push(cur.toString());
            return
        }
        for(let j = 0; j < n; j++) {
            if(vis[j] || (j > 0 && !vis[j-1] && arr[j-1] === arr[j])) {
                continue
            }
            vis[j] = true;
            cur.push(arr[j]);
            backTrack(arr, i+1, n, cur);
            cur.pop();
            vis[j] = false;
        }
    }
    backTrack(arr, 0, n, cur);
    const size = res.length;
    const resArr = new Array(size).fill(0);
    for (let i = 0; i < size; i++) {
        resArr[i] = res[i].split(',').join('');
    }
    return resArr;
}
let s = 'aab';
console.log(permutation(s));
var add = function(a, b) {
    let m = a.length - 1, n = b.length - 1;
    let res = [], jinwei = 0;
    while(m >=0 && n >=0) {
        const x = a[m] - '0', y = b[n] - '0';
        if(x + y + jinwei === 3){
            jinwei = 1;
            res.push(1);
        } else if(x + y + jinwei === 2) {
            jinwei = 1;
            res.push(0);
        } else if(x + y + jinwei === 1) {
            jinwei = 0;
            res.push(1);
        } else {
            jinwei = 0;
            res.push(0);
        }
        m--;
        n--;
    }
    while(m >= 0) {
        const x = a[m] - '0';
        let sum = x + jinwei;
        if(sum === 2) {
            jinwei = 1;
            res.push(0);
        } else if( sum === 1) {
            jinwei = 0;
            res.push(1);
        } else {
            jinwei = 0;
            res.push(0);
        }
        m --;
    }
    while(n >= 0) {
        const y = a[n] - '0';
        let sum = y + jinwei;
        if(sum === 2) {
            jinwei = 1;
            res.push(0);
        } else if( sum === 1) {
            jinwei = 0;
            res.push(1);
        } else {
            jinwei = 0;
            res.push(0);
        }
        n--;
    }
    if(jinwei === 1) {
        res.push(1);
    }
    return res.reverse().join('');
}
var flatten = function(head) {
    const dfs = (node) => {
        let cur = node;
        // 记录链表的最后一个节点
        let last = null;

        while (cur) {
            let next = cur.next;
            //  如果有子节点，那么首先处理子节点
            if (cur.child) {
                const childLast = dfs(cur.child);

                next = cur.next;
                //  将 node 与 child 相连
                cur.next = cur.child;
                cur.child.prev = cur;

                //  如果 next 不为空，就将 last 与 next 相连
                if (next != null) {
                    childLast.next = next;
                    next.prev = childLast;
                }

                // 将 child 置为空
                cur.child = null;
                last = childLast;
            } else {
                last = cur;
            }
            cur = next;

        }
        return last;
    }

    dfs(head);
    return head;
};
const address = [
    {
      addressId: 1,
      addressName: '北京市',
      subDistrict: [
        {
          addressId: 11,
          addressName: '海淀区',
          subDistrict: [
            {
              addressId: 111,
              addressName: '中关村',
            },
          ],
        },
        {
          addressId: 12,
          addressName: '朝阳区',
        },
      ],
    },
    {
      addressId: 2,
      addressName: '河北省',
    },
  ];
  function convert(arr) {
    let newArr = [];
    for (let i = 0; i < arr.length; i++) {
      let obj = arr[i];
      let newObj = {};
      for (const key in obj) {
        const newKey = key.replace(/([A-Z])/g, '_$1').toLowerCase();
        if (Array.isArray(obj[key])) {
          newObj[newKey] = convert(obj[key]);
        } else {
          newObj[newKey] = obj[key];
        }
      }
      newArr.push(newObj);
    }
    return newArr;
  }
  console.log(convert(address));