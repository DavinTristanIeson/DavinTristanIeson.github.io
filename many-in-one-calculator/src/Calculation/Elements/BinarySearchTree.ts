import type { AdjacencyList } from "./Graph";
import { PriorityQueue } from "./PriorityQueue";

type BSTNodeKey = string|number;
export class BSTNode {
    key: BSTNodeKey;
    left:BSTNode|null;
    right:BSTNode|null;
    constructor(key:BSTNodeKey,left=null,right=null){
        this.key = key;
        this.left = left;
        this.right = right;
    }
    preorder(): BSTNodeKey[] {
        let path = [this.key];
        if (this.left) path = path.concat(this.left.preorder());
        if (this.right) path = path.concat(this.right.preorder());
        return path;
    }
    inorder(): BSTNodeKey[] {
        let path = [];
        if (this.left) path = path.concat(this.left.inorder());
        path.push(this.key);
        if (this.right) path = path.concat(this.right.inorder());
        return path;
    }
    postorder(): BSTNodeKey[] {
        let path = [];
        if (this.left) path = path.concat(this.left.postorder());
        if (this.right) path = path.concat(this.right.postorder());
        path.push(this.key);
        return path;
    }
    insert(value:BSTNodeKey){
        if (this.key > value){
            if (this.left) this.left.insert(value);
            else this.left = new BSTNode(value);
        } else if (this.key < value){
            if (this.right) this.right.insert(value);
            else this.right = new BSTNode(value);
        }
    }
    find(value:BSTNodeKey){
        if (value < this.key) return this.left ? this.left.find(value) : false;
        else if (value > this.key) return this.right ? this.right.find(value) : false;
        return true;
    }
    toAdjacencyList(): AdjacencyList {
        const result:{[key:string]:string[]} = {}
        const children = [];
        let left = {}, right = {};
        if (this.left){
            children.push(this.left.key.toString());
            left = this.left.toAdjacencyList();
        }
        if (this.right){
            children.push(this.right.key.toString());
            right = this.right.toAdjacencyList();
        }
        result[this.key] = children;
        for (let l in left) result[l] = left[l];
        for (let r in right) result[r] = right[r];
        return result;
    }
    static formatPath(path: BSTNodeKey[]){
        return path.join(" -> ");
    }
    static createTree(source:BSTNodeKey[]){
        if (source.length === 0) return null;
        const root = new BSTNode(source[0]);
        for (let s = 1; s < source.length; s++){
            root.insert(source[s]);
        }
        return root;
    }
}

export class HuffmanNode {
    key:string;
    frequency:number;
    left:HuffmanNode | null;
    right:HuffmanNode | null;
    constructor(key:string,frequency:number,left=null,right=null){
        this.key = key;
        this.frequency = frequency;
        this.left = left;
        this.right = right;
    }
    dictionary(code): {[key:string]: number} {
        const dict: {[key:string]: number} = {};
        if (!this.left && !this.right){
            dict[this.key] = code;
            return dict;
        }
        const left = this.left?.dictionary(code + '0') ?? {};
        for (let l in left) dict[l] = left[l];
        const right = this.right?.dictionary(code + '1') ?? {};
        for (let r in right) dict[r] = right[r];
        return dict;
    }
    static encode(source:{[key:string]:number}){
        // https://www.geeksforgeeks.org/huffman-coding-greedy-algo-3/
        const pq = new PriorityQueue<HuffmanNode>();
        for (let key in source){
            const hn = new HuffmanNode(key,source[key]);
            pq.enqueue(hn,hn.frequency);
        }
        while (pq.length > 1){
            const x = pq.dequeue();
            const y = pq.dequeue();
            const combined = new HuffmanNode('-',x[1]+y[1],x[0],y[0]);
            pq.enqueue(combined,x[1]+y[1]);
        }
        return pq.dequeue()[0];
    }
    static counter(source:string[]){
        const counter:{[key:string]:number} = {};
        for (let key of source){
            if (!(key in counter)) counter[key] = 1;
            else counter[key]++;
        }
        return counter;
    }
}