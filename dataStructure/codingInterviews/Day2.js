/* 06.从尾到头打印链表
   24.翻转链表 */
/* 35.复杂链表的复制 */
/**
 * // Definition for a Node.
 * function Node(val, next, random) {
 *    this.val = val;
 *    this.next = next;
 *    this.random = random;
 * };
 */
/**
 * @param {Node} head
 * @return {Node}
 */
 var copyRandomList = function(head, cachedNode = new Map()) {
    if (head === null) {
        return null;
    }
    if (!cachedNode.has(head)) {
        cachedNode.set(head, {val: head.val}), Object.assign(cachedNode.get(head), {next: copyRandomList(head.next, cachedNode), random: copyRandomList(head.random, cachedNode)})
    }
    return cachedNode.get(head);
}
var copyRandomList = function(head) {
    if (head === null) {
        return null;
    }
    for (let node = head; node !== null; node = node.next.next) {
        const nodeNew = new Node(node.val, node.next, null);
        node.next = nodeNew;
    }
    for (let node = head; node !== null; node = node.next.next) {
        const nodeNew = node.next;
        nodeNew.random = (node.random !== null) ? node.random.next : null;
    }
    const headNew = head.next;
    for (let node = head; node !== null; node = node.next) {
        const nodeNew = node.next;
        node.next = node.next.next;
        nodeNew.next = (nodeNew.next !== null) ? nodeNew.next.next : null;
    }
    return headNew;
};
var copyRandomList = function(head) {
    if (head == null) {
        return null;
    }
    // cur指向头节点
    let cur = head;
    // 复制各节点，并构建拼接链表
    while (cur) {
        // 复制cur节点并且next正确指向之后  再延着next指针走下去
        let temp = new Node(cur.val, cur.next, null);
        cur.next = temp;
        cur = temp.next;
    }
    cur = head;
    // 构建各新节点的 random 指向
    while (cur) {
        if (cur.random) {
            cur.next.random = cur.random.next;
        }
        cur = cur.next.next;
    }
    // 拆分两链表;
    cur = head.next;
    let pre = head,
    res = head.next;
    while (cur.next) {
        pre.next = pre.next.next;
        cur.next = cur.next.next;
        pre = pre.next;
        cur = cur.next;
    }
    // 单独处理原链表尾节点
    pre.next = null;
    // 返回新链表头节点
    return res;
};