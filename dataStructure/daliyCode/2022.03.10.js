/* N叉树的前序遍历 
给定一个 n 叉树的根节点  root ，返回 其节点值的 前序遍历 。

n 叉树 在输入中按层序遍历进行序列化表示，每组子节点由空值 null 分隔（请参见示例）。

输入：root = [1,null,3,2,4,null,5,6]
输出：[1,3,5,6,2,4]*/
/* 递归 */
var preorder = function(root) {
    const res = [];
    help(root, res);
    return res;
};
const help = function(root, res) {
    if(root === null) {
        return;
    }
    res.push(root.val);
    for(const node of root.children) {
        help(node, res);
    }
}