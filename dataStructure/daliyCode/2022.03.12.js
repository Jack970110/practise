/* n叉树的后序遍历
给定一个 n 叉树的根节点 root ，返回 其节点值的 后序遍历 。

n 叉树 在输入中按层序遍历进行序列化表示，每组子节点由空值 null 分隔（请参见示例）。 */
var postorder = function(root) {
    let res = [];
    help(root, res);
    return res;
};
const help = function(node, res) {
    if(node === null) {
        return;
    }
    for(const n of node.children) {
        help(n, res);
    }
    res.push(node.val);
}