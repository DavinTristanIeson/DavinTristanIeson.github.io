import type { Fraction } from "./Fraction";

export class CalculatorSystem<T extends number|bigint|Fraction> {
    protected history:{operand:T, operation:string}[] = [];
    // all the supported operations
    private operations: {
        [key:string]:(operand1:T, operand2?:T)=>T
    };
    constructor(operations:{
        [key:string]:(operand1:T, operand2?:T)=>T
    }){
        this.operations = operations;
    }
    // returns the recent operand and operation respectively. Why not pair it together? Because recent().operand is too long to type
    recent():T{
        return this.history[this.history.length-1]?.operand ?? (0 as T);
    }
    recentOperation():string {
        return this.history[this.history.length-1]?.operation ?? "";
    }
    pop():T {
        // just like a stack/array pop
        return this.history.pop()?.operand ?? 0 as T;
    }
    push(...entries:{operand:T, operation:string}[]){
        for (let entry of entries){
            this.history.push(entry);
        }
    }
    clear(completeReset:boolean=false){
        let past:{operand:T,operation:string};
        // removes all the history except for the last value, unless you want a complete reset
        if (this.history.length && !completeReset){
            past = {
                operand:this.recent(),
                operation:this.recentOperation()
            }
        }
        this.history = [];
        if (past) this.push(past);
    }
    // if there's an operation in the queue, then it is prepared
    isPrepared():boolean{
        return !!this.recentOperation();
    }
    // change the latest operation
    changeOperation(operationString:string){
        if (this.history.length === 0) return;
        this.history[this.history.length-1].operation = operationString;
    };
    executeOperation(value:T, nextOperation:string):T {
        // if the recent operation is an invalid operation, then just don't bother and return the recent value
        if (!this.operations?.[this.recentOperation()]){
            return this.recent();
        }
        // enqueue a new operation if it exists, or just "" if there's none
        this.push({
            operand: this.operations[this.recentOperation()]?.(this.recent(),value),
            operation: nextOperation,
        });
        return this.recent();
    }
    forceOperation(value:T, operation:string):T {
        // for instantaneous operation
        return this.operations[operation]?.(value,this.recent());
    }
    getOperationSymbol():string {
        // returns the symbol of the operation for pastCalculated
        return CalculatorSystem.OPERATION_TO_SYMBOL[this.recentOperation()] ?? "";
    }
    getOperationQueue():string {
        // a simpler method call for pastCalculated
        return this.recent() + ' ' + this.getOperationSymbol();
    }
    // to be overwritten in child; checks whether the operation is an instant operation or not.
    isInstantOperation(operationString:string):boolean {return false;}
    static applyThousandSeparators(number:number): string {
        let returned:string[] = []
        while (number > 0){
            returned.push((number % 1000).toString());
            number /= 1000;
        }
        returned.reverse()
        return returned.join('');
    }
    static OPERATION_TO_SYMBOL = {
        "add":'+',
        "sub":'-',
        "mult":'x',
        "div":"/",
        "mod":"%",
        "exp":"^",
        "log":"log",
        "ln":"ln",
        "sqrt":"sqrt",
        "inv":"inv"
    }
}