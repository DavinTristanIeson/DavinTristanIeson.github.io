import { DevelopmentError, UserError } from "../../Utils";

export enum TruthOperation {
    NONE,
    AND,
    OR,
    XOR,
    IMPLY,
    BICOND,
    NOT,
    TRUE,
    FALSE
}

export const ALL_TRUTH_OPERATIONS:[string,TruthOperation][] = [
    ["AND",TruthOperation.AND],
    ["OR",TruthOperation.OR],
    ["XOR",TruthOperation.XOR],
    ["IMPLY",TruthOperation.IMPLY],
    ["BICOND",TruthOperation.BICOND],
    ["NOT",TruthOperation.NOT],
    ["TRUE",TruthOperation.TRUE],
    ["FALSE",TruthOperation.FALSE],
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
    filter(callback:(value:boolean,index:number,array:boolean[])=>boolean){
        return new TruthColumn(this.name,this.contents.filter(callback));
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
    get length() {
        return this.contents.length;
    }
    at(index:number){
        return this.contents[index];
    }
}

export type TruthRowFilter = {
    index:number,
    state:boolean
};

export class TruthTable {
    static VARIABLE_LIMIT = 8;
    static VARNAME_MAXLEN = 4;
    columns:TruthColumn[] = [];
    addressBook:{
        [key:string]:number
    } = {};
    rowsCount:number;
    varsCount:number;
    variables:string[];
    filters:TruthRowFilter[] = [];
    initializeVariables(variables:string[]):void {
        if (variables.length > TruthTable.VARIABLE_LIMIT) throw new UserError(`Maximum number of variables is ${TruthTable.VARIABLE_LIMIT}`);
        variables.forEach(x => {
            if (x.length > TruthTable.VARNAME_MAXLEN) throw new UserError(`Variable names should be under ${TruthTable.VARNAME_MAXLEN} characters long!`);
        })
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

    get filteredColumns(){
        let forbidden:Set<number> = new Set<number>();
        for (let filter of this.filters){
            const cur = this.columns[filter.index];
            for (let i = 0; i < cur.length; i++){
                if (cur.at(i) !== filter.state) forbidden.add(i);
            }
        }

        return this.columns.map(col => col.filter((_,idx) => !forbidden.has(idx)));
    }


    addColumn(method:TruthOperation,operands:number[]){
        this.assertValidIndexes(...operands);
        let boologicResult:boolean[], newName:string;
        switch (method){
            case TruthOperation.AND:
                TruthTable.assertEnoughArguments(2);
                newName = `${TruthTable.wrap(this.columns[operands[0]].name)}^${TruthTable.wrap(this.columns[operands[1]].name)}`;
                boologicResult = this.and(operands[0],operands[1]);
                break;
            case TruthOperation.OR:
                TruthTable.assertEnoughArguments(2);
                newName = `${TruthTable.wrap(this.columns[operands[0]].name)}v${TruthTable.wrap(this.columns[operands[1]].name)}`;
                boologicResult = this.or(operands[0],operands[1]);
                break;
            case TruthOperation.XOR:
                TruthTable.assertEnoughArguments(2);
                newName = `${TruthTable.wrap(this.columns[operands[0]].name)}⊕${TruthTable.wrap(this.columns[operands[1]].name)}`;
                boologicResult = this.xor(operands[0],operands[1]);
                break;
            case TruthOperation.IMPLY:
                TruthTable.assertEnoughArguments(2);
                newName = `${TruthTable.wrap(this.columns[operands[0]].name)}→${TruthTable.wrap(this.columns[operands[1]].name)}`;
                boologicResult = this.imply(operands[0],operands[1]);
                break;
            case TruthOperation.BICOND:
                TruthTable.assertEnoughArguments(2);
                newName = `${TruthTable.wrap(this.columns[operands[0]].name)}⟷${TruthTable.wrap(this.columns[operands[1]].name)}`;
                boologicResult = this.bicond(operands[0],operands[1]);
                break;
            case TruthOperation.NOT:
                TruthTable.assertEnoughArguments(1);
                newName = `¬${TruthTable.wrap(this.columns[operands[0]].name)}`;
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
            throw new DevelopmentError("Something wrong happened. No conditions seem to be satisfied. Check the function calls from the front-end");
        } else if (newName in this.addressBook){
            throw new UserError(`The column "${newName}" has already existed in the table!`);
        }
        this.registerColumn(newName,boologicResult);
    }

    registerColumn(name:string,contents:boolean[]){
        this.addressBook[name] = this.columns.length;
        this.columns.push(new TruthColumn(name,contents));
    }
    assertValidVariables(...variables:string[]){
        for (let varname of variables){
            if (!(varname in this.addressBook)) throw new DevelopmentError(`Variable ${varname} is not available!`);
        }
    }
    assertValidIndexes(...indexes:number[]){
        for (let idx of indexes){
            if (idx < 0 || idx >= this.columns.length) throw new DevelopmentError(`Index ${idx} is out of range for the available columns!`);
        }
    }
    addr(name:string):number {return this.addressBook[name];}
    and(col1:number, col2:number){return this.columns[col1].map((val,idx)=>val && this.columns[col2].get(idx));}
    or(col1:number, col2:number){return this.columns[col1].map((val,idx)=>val || this.columns[col2].get(idx));}
    xor(col1:number, col2:number){return this.columns[col1].map((val,idx)=>val !== this.columns[col2].get(idx));}
    imply(col1:number, col2:number){return this.columns[col1].map((val,idx)=> TruthTable.imply(val,this.columns[col2].get(idx),false));}
    bicond(col1:number, col2:number){return this.columns[col1].map((val,idx)=> TruthTable.imply(val,this.columns[col2].get(idx),true));}
    not(col:number){return this.columns[col].map(val => !val);}
    tautology(){return Array(this.rowsCount).fill(true);}
    contradiction(){return Array(this.rowsCount).fill(false);}
    clear(clearAll:boolean = false){
        this.columns = [];
        this.addressBook = {};
        this.filters = [];
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
