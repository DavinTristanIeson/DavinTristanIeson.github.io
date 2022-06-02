import type { DisplayBackend } from "../../Utils/BackEndUtils";
import type { TruthTable,TruthColumn } from "../Elements/TruthTable";

export class TruthTableDisplay implements DisplayBackend<TruthTable> {
    truthTable: TruthTable;
    tableElement: HTMLTableElement = null;
    onUpdate: (updated: TruthTable) => void;
    onError: (message: string) => void;
    variableInput:HTMLInputElement;
    constructor(truthTable:TruthTable,onUpdate:(truthTable:TruthTable)=>void,onError:(message:string)=>void){
        this.truthTable = truthTable;
        this.onUpdate = onUpdate;
        this.onError = onError;
    }
    render(){
        this.onUpdate(this.truthTable);
    }
    registerVariables(){
        let variables:string[] = [];
        if (this.variableInput){
            variables = this.variableInput.value.split(" ");
        } else {
            console.error("variableInput is not initialized!");
            return;
        }
        this.truthTable.clear(true);
        try {
            this.truthTable.initializeVariables(variables);
        } catch (e){
            this.onError(e);
            return;
        }
        console.log(this.truthTable);
        this.render();
    }
    addColumn(){

    }
}