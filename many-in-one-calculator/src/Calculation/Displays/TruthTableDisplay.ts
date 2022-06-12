import { BackendUtils, DisplayBackend,UserError } from "../../Utils/BackEndUtils";
import { TruthTable,TruthColumn, TruthRowFilter, TruthOperation } from "../Elements/TruthTable";

export class TruthTableDisplay implements DisplayBackend<TruthTable> {
    truthTable: TruthTable;
    tableElement: HTMLTableElement = null;
    onUpdate: (updated: TruthTable) => void;
    onError: (message: string) => void;
    variableInput:HTMLInputElement;
    operand1:number = -1;
    operand2:number = -1;
    operation:TruthOperation = TruthOperation.NONE;
    whereIsTrue:number[] = [];
    whereIsFalse:number[] = [];
    constructor(truthTable:TruthTable,onUpdate:(truthTable:TruthTable)=>void,onError:(message:string)=>void){
        this.truthTable = truthTable;
        this.onUpdate = onUpdate;
        this.onError = onError;
    }
    render(){
        this.onUpdate(this.truthTable);
    }
    registerVariables(){
        let variables:string[] = this.variableInput.value.split(/\s+/);
        this.truthTable.clear(true);
        try {
            if (variables.length === 0 || variables[0] === '') throw new UserError("At least one variable is required!");
            this.truthTable.initializeVariables(variables);
        } catch (e){
            BackendUtils.errorHandling(e,this.onError);
            return;
        }
        this.operand1 = -1;
        this.operand2 = -1;
        this.operation = TruthOperation.NONE;
        this.render();
    }
    addColumn(){
        try {
            if (this.operand1 < 0 || this.operand2 < 0) throw new UserError("Operands haven't been chosen yet!");
            else if (this.operation === TruthOperation.NONE) throw new UserError("Operation hasn't been chosen yet!");
            this.truthTable.addColumn(this.operation,[this.operand1,this.operand2]);
        } catch (e) {
            BackendUtils.errorHandling(e,this.onError);
            return;
        }
        this.render();
    }
    private parseFiltered(indexes:number[], state:boolean): TruthRowFilter[]{
        // CREDIT: https://stackoverflow.com/questions/5866169/how-to-get-all-selected-values-of-a-multiple-select-box
        return indexes.map(x => {return {index: x, state: state}});
    }
    setFilter(){
        let trueFilters:TruthRowFilter[],falseFilters:TruthRowFilter[];
        trueFilters = this.parseFiltered(this.whereIsTrue,true);
        falseFilters = this.parseFiltered(this.whereIsFalse,false);
        this.truthTable.filters = [...trueFilters,...falseFilters];
        this.render();
    }
}