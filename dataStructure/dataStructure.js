class Graph {
    constructor (isDirected = false){
        this.isDirected = isDirected;
        this.vertices = [];
        this.adjList = new Map();
    }
    addVertex(v) {
        if(!this.vertices.includes(v)){
            this.vertices.push(v);
            this.adjList.set(v,[]);
        }
    }
    addEdge(v,w){
        if (!this.adjList.get(v)) {
            this.addVertex(v);
        }
        if (!this.adjList.get(w)) {
            this.addVertex(w);
        }
        this.adjList.get(v).push(w);
        if (!this.isDirected) {
            this.adjList.get(w).push(v);
        }
    }
    getVertices(){
        return this.vertices;
    }
    getAdjList(){
        return this.adjList;
    }
    toString() {
        let s = '';
        for(let i = 0; i < this.vertices.length; i++) {
            s += `${this.vertices[i]} -> `;
            const neighbors = this.adjList.get(this.vertices[i]);
            neighbors.forEach(value =>{
                s += `${value} `;
            })
            s += '\n';
        }
        return s;
    }
}

class Queue {
    constructor(){
        this.count = 0;
        this.lowestCount = 0;
        this.items = {};
    }
    enqueue(element){
        this.items[this.count] = element;
        this.count ++;
    }
    dequeue(element){
        if(this.items === null){
            return undefined;
        }
        const result = this.items[this.lowestCount];
        delete this.items[this.lowestCount];
        this.lowestCount ++;
        return result;
    }
    isEmpty(){
        return this.count - this.lowestCount === 0;
    }
}

// 链表
class Node {
    constructor(element){
        this.element = element;
        this.next = undefined;
    }
}
class List{
    constructor (){
        this.count = 0;
        this.head = undefined;
    }
    push(element){
        const node = new Node(element);
        let current;
        if(this.head == null){
            this.head = node;
        } else {
            current = this.head;
            while(current.next != null){
                current = current.next;
            }
            current.next = node;
        }
        this.count ++;
    }
    removeAt(index){
        if(index >=0 && index < this.count){
            let current = this.head;
            if(index ===0){
                this.head = current.next;
            } else {
                let previous;
                for(let i = 0; i < index; i++){
                    previous = current;
                    current = current.next;
                }
                previous.next = current.next;
            }
            this.count --;
            return current.element;
        }
        return undefined;
    }
    getElementAt(index){
        if(index >= 0 && index <= this.count){
            let node = this.head;
            for(let i = 0; i < index && node != null; i++){
                node = node.next
            }
            return node;
        }
        return undefined;
    }
    insert(element, index){
        if(index >= 0 && index <= this.count){
            const node = new Node(element);
            if(index ===0){
                const current = this.head;
                node.next = current;
                this.head = node;
            } else {
                const previous = this.getElementAt(index-1);
                const current = previous.next;
                node.next = current;
                previous.next = node;
            }
            this.count ++;
            return true;
        }
        return false;
    }
    indexOf(element){
        let current = this.head;
        for( let i = 0; i < this.count && current != null; i++){
            if(current.element === element){
                return i;
            }
            current = current.next;
        }
        return -1;
    }
    remove(element){
        const index = this.indexOf(element);
        return this.removeAt(index);
    }
    size(){
        return this.count;
    }
    isEmpty(){
        return this.count === 0;
    }
    getHead(){
        return this.head;
    }
    toString(){
        if(this.head == null){
            return '';
        }
        let string = `${this.head.element}`;
        let current = this.head.next;
        for(let i = 1; i < this.count && current != null; i++){
            string = `${string},${current.element}`;
            current = current.next;
        }
        return string;
    }
}

// 二叉搜索树
class treeNode{
    constructor(key){
        this.key = key;
        this.left = null;
        this.right = null;
    }
}
class BinarySearchTree{
    constructor(){
        this.root = null;
    }
    insertNode(node,key){
        if(key < node.key){
            if(node.left == null){
                node.left = new treeNode(key);
            } else {
                this.insertNode(node.left, key);
            }
        } else {
            if(node.right == null) {
                node.right = new treeNode(key);
            } else {
                this.insertNode(node.right, key)
            }
        }
    }
    insert(key){
        if(this.root == null){
            this.root = new treeNode(key);
        } else {
            this.insertNode(this.root, key);
        }
    }
    inOrderTraverse(){
        function inOrder(node){
            if(node){
                inOrder(node.left);
                console.log(node.key);
                inOrder(node.right)
            }
        }
        inOrder(this.root);
    }
    preOrderTraverse(){
        function preOrder(node){
            if(node){
                console.log(node.key);
                preOrder(node.left);
                preOrder(node.right)
            }
        }
        preOrder(this.root);
    }
    postOrderTraverse(){
        function postOrder(node){
            if(node){
                postOrder(node.left);
                postOrder(node.right);
                console.log(node.key);
            }
        }
        postOrder(this.root);
    }
    min(){
        let current = this.root;
        while(current != null && current.left != null){
            current = current.left;
        }
        return current;
    }
    minNode(node){
        let current = node;
        while(current != null && current.left != null){
            current = current.left;
        }
        return current;
    }
    max(){
        let current = this.root;
        while(current != null && current.right != null){
            current = current.right;
        }
        return current;
    }
    search(key){
        function searchNode(node,key){
            if(node == null){
                return false;
            }
            if(node.key < key){
                return searchNode(node.right,key);
            } else if(node.key > key){
                return searchNode(node.left,key);
            }else {
                return true;
            }
        }
        return searchNode(this.root,key);
    }
    remove(key){
        return this.removeNode(this.root, key);
    }
    removeNode(node, key){
        if(node == null) {
            return null;
        }
        if(key < node.key){
            node.left = this.removeNode(node.left, key);
            return node;
        } else if (key > node.key) {
            node.right = this.removeNode(node.right, key);
            return node;
        }else{
            if(node.left == null && node.right == null){
                node = null;
                return node;
            }
            if(node.left == null){
                node = node.right;
                return node;
            } else if(node.right == null){
                node = node.left;
                return node;
            }
            const aux = this.minNode(node.right);
            node.key = aux.key;
            node.right = this.removeNode(node.right, aux.key);
            return node;
        }
    }

}
class Stack{
    constructor(){
        this.items = [];
    }
    
}