// 迷宫老鼠问题
function raInAmaze(maze){
    const solution = [];
    for(let i = 0; i < maze.length; i++){
        solution[i] = [];
        for(let j = 0; j < maze[i].length; j++){
            solution[i][j] = 0;
        }
    }
    if(findPath(maze,0,0,solution)){
        return solution
    }
    return 'NO PATH FOUND';
}
function findPath(maze,x,y,solution){
    const n = maze.length;
    if(x === n-1 && y === n-1){
        solution[x][y] = 1;
        return true;
    }
    if(isSafe(maze,x,y)){
        solution[x][y] = 1;
        if(findPath(maze,x+1,y,solution)){
            return true;
        }
        if(findPath(maze,x,y+1,solution)){
            return true;
        }
        solution[x][y]= 0;
        return false;
    }
    return false;
}
function isSafe(maze,x,y){
    const n = maze.length;
    if(x >= 0 && y >= 0 && x < n && y < n && maze[x][y] !== 0){
        return true;
    }
    return false;
}

// 数独解题器
function sudokuSolver(matrix){
    if(solveSudoku(matrix)){
        return matrix;
    }
    return '问题无解！';
}
function solveSudoku(matrix){
    let row = 0;
    let col = 0;
    let checkBlankSpaces = false;
    for(row = 0; row < matrix.length; row ++){
        for(col = 0; col < matrix[row].length; col++){
            if(matrix[row][col] === 0){
                checkBlankSpaces = true;
                break;
            }
        }
        if(checkBlankSpaces = true){
            break;
        }
    }
    if(checkBlankSpaces === false){
        return true;
    }
    for(let num = 1; num <= 9; num++){
        if(isCorrect(matrix,row,col,num)){
            matrix[row][col] = num;
            if(solveSudoku(matrix)){
                return true;
            }
            matrix[row][col] = 0;
        }
    }
    return false;
}
function isCorrect(matrix,row,col,num){
    return (
        !usedInRow(matrix,row,num) &&
        !usedInCol(matrix,col,num) &&
        !usedInBox(matrix,row - (row % 3),col - (col % 3),num)
    );
}
function usedInRow(matrix, row, num){
    for(let col = 0; col < matrix.length; col++){
        if(matrix[row][col] === num){
            return true;
        }
    }
    return false;
}
function usedInCol(matrix, col, num){
    for(let row = 0; row < matrix.length; row++){
        if(matrix[row][col] === num){
            return true;
        }
    }
    return false;
}
function usedInBox(matrix, boxStartRow, boxStartCol, num){
    for(let row = 0; row < 3; row ++){
        for(let col = 0; col < 3; col ++){
            if(matrix[row + boxStartRow][col + boxStartCol] === num){
                return true;
            }
        }
    }
    return false;
}
/* 给你一个字符串 s 和一个字符规律 p，请你来实现一个支持 '.' 和 '*' 的正则表达式匹配。

'.' 匹配任意单个字符
'*' 匹配零个或多个前面的那一个元素
所谓匹配，是要涵盖 整个 字符串 s的，而不是部分字符串。 */
/*边界情况
1. dp[0][0] = true;
2. dp[i][0] = false; (i > 0)
3. dp[0][j](j > 0)可能为true
        如：s = "", p = "a*"是匹配的。
对于第一种情况：
p是小写字母，那么我们只需要判断s[i]是否等于p[j]
dp[i][j] = dp[i - 1][j - 1]; (s[i] == p[j])
dp[i][j] = false; (s[i] != p[j])
对于第二种情况：
由于p == '.'，因此p可以匹配任一字符，所以：
dp[i][j] = dp[i - 1][j - 1];
对于第三种情况：
p是'*'，对于'x*'意思是：匹配零次或多次x。因此也是最复杂的情况了。对于s[i]和p[j-1]，我们可以再细分为两种情况：
（1）s[i]与p[j-1]不匹配
对于不匹配来讲，也就是'x*'匹配零次，即不使用'x*'，所有此时的状态转移方程为：dp[i][j] = dp[i][j - 2]。
不匹配条件表示为s[i] != p[j-1]，但是只是如此吗？不是的！如果p[j-1]是点号'.'的话，那也是匹配的，所以：
dp[i][j] = dp[i][j - 2]; (s[i] != p[j-1] && p[j-1] != '.')
（2）s[i]与p[j-1]匹配
对于匹配的情况而言，可以是匹配多次（dp[i][j] = dp[i-1][j]），也可以是匹配一次（dp[i][j] = dp[i][j-1]），
但是匹配多次是包含了匹配一次的情况，这里举个栗子：
s = “afs”，p = "afs*"
匹配多次：dp[3][4] = dp[2][4]
匹配一次：dp[3][4] = dp[3][3]
其实结果上是一样的，都是true，只不过这里dp[2][4]表示不使用"s*"时，s与p匹配，而dp[3][3]是直接匹配。
所以由上我们得到此种情况下的结论：dp[i][j] = dp[i-1][j]？
显然我们漏掉了一种情况，这里也是最重要的地方！也就是如果p[j-1]是'.'呢，那既然'.*'可以表示任意一段字符串，有什么问题呢？（其实这个我一开始也没有想到，在提交的时候发现有个用例过不了！）同样来个栗子：
s = "ab"，p = "ab.*"，
dp[2][4]应该是true，但是按照上面的写法的话dp[2][4] = dp[1][4]就是false，这里应该匹配零次".*"，即：dp[2][4] = dp[2][2]。因此，正确的结论是：
dp[i][j] = dp[i-1][j] || dp[i][j - 2];
 */
var isMatch = function(s, p) {
    if (s == null || p == null) return false;
  
    const sLen = s.length, pLen = p.length;
  
    const dp = new Array(sLen + 1);
    for (let i = 0; i < dp.length; i++) {
      dp[i] = new Array(pLen + 1).fill(false); // 将项默认为false
    }
    // base case
    dp[0][0] = true;
    for (let j = 1; j < pLen + 1; j++) {
      if (p[j - 1] == "*") dp[0][j] = dp[0][j - 2];
    }
    // 迭代
    for (let i = 1; i < sLen + 1; i++) {
      for (let j = 1; j < pLen + 1; j++) {
  
        if (s[i - 1] == p[j - 1] || p[j - 1] == ".") {
          dp[i][j] = dp[i - 1][j - 1];
        } else if (p[j - 1] == "*") {
          if (s[i - 1] == p[j - 2] || p[j - 2] == ".") {
            dp[i][j] = dp[i][j - 2] || dp[i - 1][j - 2] || dp[i - 1][j];
          } else {
            dp[i][j] = dp[i][j - 2];
          }
        }
      }
    }
    return dp[sLen][pLen]; // 长sLen的s串 是否匹配 长pLen的p串
  };