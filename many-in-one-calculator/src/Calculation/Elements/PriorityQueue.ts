type PriorityElement<T> = [T,number];
export class PriorityQueue<T> {
    items:PriorityElement<T>[];
    compare:(a:PriorityElement<T>,b:PriorityElement<T>)=>boolean;
    constructor(initializer:PriorityElement<T>[] = [],compare:(a:PriorityElement<T>,b:PriorityElement<T>)=>boolean = (a,b)=>{
        return a[1] > b[1];
    }){
        this.items = [];
        for (let init of initializer){
            this.items.push(init);
        }
        this.compare = compare;
    }
    get length(){
        return this.items.length;
    }
    enqueue(item:T,priority:number){
        let isContained:boolean = false;
        const inserted:[T,number] = [item,priority];
        for (let i = this.length-1; i >= 0; i--){
            if (this.compare(this.items[i],inserted)){
                this.items.splice(i,0,inserted);
                isContained = true;
                break;
            }
        }
        if (!isContained) this.items.unshift(inserted);
    }
    dequeue(){
        return this.items.pop();
    }
    front(){
        return this.items[this.length-1];
    }
    isEmpty(){
        return this.items.length === 0;
    }
    toString(){
        return `[${this.items.join(", ")}]`;
    }
}