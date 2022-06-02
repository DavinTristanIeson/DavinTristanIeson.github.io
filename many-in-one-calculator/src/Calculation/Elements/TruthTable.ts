export enum TruthOperation {
    AND,
    OR,
    XOR,
    IMPLY,
    BICOND,
    NOT,
    TRUE,
    FALSE
}

export const ALL_TRUTH_OPERATIONS = [
    {"name":"AND","value":TruthOperation.AND},
    {"name":"OR","value":TruthOperation.OR},
    {"name":"XOR","value":TruthOperation.XOR},
    {"name":"IMPLY","value":TruthOperation.IMPLY},
    {"name":"BICOND","value":TruthOperation.BICOND},
    {"name":"NOT","value":TruthOperation.NOT},
    {"name":"TRUE","value":TruthOperation.TRUE},
    {"name":"FALSE","value":TruthOperation.FALSE},
]

export class TruthColumn {
    name:string;
    contents:boolean[];
    constructor(name:string,contents:boolean[]){
        this.name = name;
        this.contents = contents;
    }
    map(callback:(value:boolean,index:number,array:boolean[])=>boolean){
        return this.contents.map(callback);
    }
    get(idx:number){
        return this.contents[idx];
    }
    getChar(idx:number):string {
        return (this.contents[idx] ? "T" : "F");
    }
    toString(){
        return `"${this.name}" : ${this.contents.toString()}`;
    }
}

export class TruthTable {
    static VARIABLE_LIMIT = 10;
    columns:TruthColumn[] = [];
    addressBook:{
        [key:string]:number
    } = {};
    rowsCount:number;
    varsCount:number;
    variables:string[];
    initializeVariables(variables:string[]):void {
        if (variables.length > TruthTable.VARIABLE_LIMIT){
            throw `Maximum number of variables is ${TruthTable.VARIABLE_LIMIT}`
        }
        this.varsCount = variables.length;
        this.rowsCount = 2**variables.length;
        let index = 0;
        for (let variable of variables){
            const column:boolean[] = [];
            let currentBoolean = true;
            // Determines the switch point
            const segmentLength = 2**(variables.length-1-index);
            for (let i = 1; i <= this.rowsCount; i++){
                column.push(currentBoolean);
                // add the current boolean value to the array until a switch point is hit, then change to the reverse
                // this is so we can make the TTTTFFFF, TTFFTTFF, TFTFTFTF pattern.
                if (i % segmentLength === 0) currentBoolean = !currentBoolean;
            }

            index++;
            this.registerColumn(variable, column);
        }
    }
    constructor(variables:string[]){
        TruthTable.assertIfUnique(variables);
        this.variables = variables;
        this.initializeVariables(variables);
    }
    addColumn(method:TruthOperation,operands:string[]){
        if (!this.assertValidVariables(...operands)) return;
        let boologicResult:boolean[], newName:string;
        switch (method){
            case TruthOperation.AND:
                TruthTable.assertEnoughArguments(2);
                newName = `${TruthTable.wrap(operands[0])}^${TruthTable.wrap(operands[1])}`;
                boologicResult = this.and(operands[0],operands[1]);
                break;
            case TruthOperation.OR:
                TruthTable.assertEnoughArguments(2);
                newName = `${TruthTable.wrap(operands[0])}v${TruthTable.wrap(operands[1])}`;
                boologicResult = this.or(operands[0],operands[1]);
                break;
            case TruthOperation.XOR:
                TruthTable.assertEnoughArguments(2);
                newName = `${TruthTable.wrap(operands[0])}⊕${TruthTable.wrap(operands[1])}`;
                boologicResult = this.xor(operands[0],operands[1]);
                break;
            case TruthOperation.IMPLY:
                TruthTable.assertEnoughArguments(2);
                newName = `${TruthTable.wrap(operands[0])}→${TruthTable.wrap(operands[1])}`;
                boologicResult = this.imply(operands[0],operands[1]);
                break;
            case TruthOperation.BICOND:
                TruthTable.assertEnoughArguments(2);
                newName = `${TruthTable.wrap(operands[0])}⟷${TruthTable.wrap(operands[1])}`;
                boologicResult = this.bicond(operands[0],operands[1]);
                break;
            case TruthOperation.NOT:
                TruthTable.assertEnoughArguments(1);
                newName = `¬${TruthTable.wrap(operands[0])}`;
                boologicResult = this.not(operands[0]);
                break;
            case TruthOperation.TRUE:
                TruthTable.assertEnoughArguments(2);
                newName = `T`;
                boologicResult = this.tautology();
                break;
            case TruthOperation.FALSE:
                TruthTable.assertEnoughArguments(2);
                newName = `F`;
                boologicResult = this.contradiction();
                break;
        }

        if (!newName){
            console.error("Something wrong happened. No conditions seem to be satisfied. Check the function calls from the front-end");
        }
        this.registerColumn(newName,boologicResult);
    }

    registerColumn(name:string,contents:boolean[]){
        this.addressBook[name] = this.columns.length;
        this.columns.push(new TruthColumn(name,contents));
    }
    assertValidVariables(...variables:string[]){
        for (let varname of variables){
            if (!(varname in this.addressBook)){
                return false;
            }
        }
        return true;
    }
    addr(name:string):number {
        return this.addressBook[name];
    }
    and(col1:string, col2:string){
        return this.columns[this.addr(col1)].map((val,idx)=>val && this.columns[this.addr(col2)].get(idx));
    }
    or(col1:string, col2:string){
        return this.columns[this.addr(col1)].map((val,idx)=>val || this.columns[this.addr(col2)].get(idx));
    }
    xor(col1:string, col2:string){
        return this.columns[this.addr(col1)].map((val,idx)=>val !== this.columns[this.addr(col2)].get(idx));
    }
    imply(col1:string, col2:string){
        return this.columns[this.addr(col1)].map((val,idx)=> TruthTable.imply(val,this.columns[this.addr(col2)].get(idx),false));
    }
    bicond(col1:string, col2:string){
        return this.columns[this.addr(col1)].map((val,idx)=> TruthTable.imply(val,this.columns[this.addr(col2)].get(idx),true));
    }
    not(col:string){
        return this.columns[this.addr(col)].map(val => !val);
    }
    tautology(){
        return Array(this.rowsCount).fill(true);
    }
    contradiction(){
        return Array(this.rowsCount).fill(false);
    }
    clear(clearAll:boolean = false){
        this.columns = [];
        this.addressBook = {};
        if (!clearAll) this.initializeVariables(this.variables);
    }
    static imply(a:boolean, b:boolean, bicond:boolean):boolean {
        return (!a && !bicond) || (a === b);
    }
    static assertEnoughArguments(length:number,...args:string[]){
        if (args.length >= length){
            throw `Not enough arguments (expected: ${length}, received: ${args.length})!`;
        }
    }
    static assertIfUnique<T>(array:T[]){
        if (!(new Set<T>(array).size === array.length)) throw "Variables of the Truth Table should be unique!"
    }
    static wrap(name:string){
        if (name.length > 1) return `(${name})`;
        else return name;
    }
}
