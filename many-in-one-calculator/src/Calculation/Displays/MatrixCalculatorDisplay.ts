import { Matrix, subtract } from "mathjs";
import { add, multiply, inv, transpose,det,matrix } from "mathjs";
import { BackendUtils, DisplayError, UserError } from "../../Utils";
import { CalculatorSystem } from "../Elements/CalculatorSystem";
import type { CalculatorDisplayI } from "./CalculatorDisplay";
export class MatrixCalculator extends CalculatorSystem<Matrix> {
    constructor(){
        super({
            "add": (op1:Matrix,op2:Matrix)=>{
                if (!MatrixCalculator.isSizeEqual(op1,op2)) throw new UserError("Addition must include matrices of equal size");
                return add(op1,op2);
            },
            "sub": (op1:Matrix,op2:Matrix)=>{
                if (!MatrixCalculator.isSizeEqual(op1,op2)) throw new UserError("Addition must include matrices of equal size");
                return subtract(op1,op2);
            },
            "mult": (op1:Matrix,op2:Matrix)=>{
                if (!MatrixCalculator.isColumnEqualToRow(op1,op2)) throw new UserError("Columns of the first matrix must be the same size of the rows of the second matrix");
                return multiply(op1,op2);
            },
            "inv": (op:Matrix)=>{
                if (!MatrixCalculator.isSquare(op)) throw new UserError("Matrix must have equally-sized rows and columns")
                else if (det(op) === 0) throw new UserError("This matrix cannot be inverted as its determinant is 0")
                return inv(op);
            },
            "exp2": (op:Matrix)=>{
                if (!MatrixCalculator.isColumnEqualToRow(op,op)) throw new UserError("Matrix must have equally-sized rows and columns")
                return multiply(op,op);
            },
            "tp": (op:Matrix)=>transpose(op)
        });
    }
    static det(op:Matrix){
        if (!MatrixCalculator.isSquare(op)) throw new UserError("Matrix must have equally-sized rows and columns")
        return det(op);
    }
    isInstantOperation(operationString: string): boolean {
        return (operationString == "inv" || operationString == "exp2" || operationString == "tp");
    }
    static isSizeEqual(mat1:Matrix,mat2:Matrix){
        const size1 = mat1.size(), size2 = mat2.size();
        return size1[0] === size2[0] && size1[1] === size2[1];
    }
    static isColumnEqualToRow(mat1:Matrix,mat2:Matrix){
        const size1 = mat1.size(), size2 = mat2.size();
        return size1[1] === size2[0];
    }
    static isSquare(mat:Matrix){
        const size = mat.size();
        return size[0] === size[1];
    }
}

export interface MatrixCalculatorUpdatePayload {
    calculatorInput:number[][],
    pastCalculated:string[][],
    lastOperation:string;
    determinant:string;
}

export class MatrixCalculatorDisplay implements CalculatorDisplayI<Matrix>,DisplayError {
    onError: (message: string) => void;
    onUpdate: (updated: {}) => void;
    calculator: CalculatorSystem<Matrix>;
    insert(piece:string){/* useless in this calculator */};
    calculatorInput:(number|null)[][] = [];
    pastCalculated:string[][] = [];
    static MAX_MATRIX_SIZE = [6,6];
    constructor(calculator:MatrixCalculator,onUpdate: (updated: MatrixCalculatorUpdatePayload)=>void, onError: (message:string)=>void){
        this.calculator = calculator;
        this.onUpdate = onUpdate;
        this.onError = onError;
        this.calculatorInput = this.emptyInput<number|null>(null);
        this.pastCalculated = this.emptyInput<string>("");
        this.render();
    }
    render(){
        let determinant;
        try {
            determinant = MatrixCalculator.det(this.calculator.recent()).toString();
        } catch {
            determinant = "-";
        }
        this.onUpdate({
            calculatorInput: this.calculatorInput,
            pastCalculated: this.pastCalculated,
            lastOperation: this.calculator.getOperationSymbol(),
            determinant: determinant
        });
    }
    update(payload:MatrixCalculatorUpdatePayload){
        this.calculatorInput = payload.calculatorInput;
        this.pastCalculated = payload.pastCalculated;
    }
    clear(allClear: boolean = false){
        this.calculatorInput = this.emptyInput<number|null>(null);
        if (allClear){
            this.pastCalculated = this.emptyInput<string>("");
            this.calculator.clear();
        } else {
            this.pastCalculated = this.matrixToString(this.calculator.recent());
        }
        this.render();
    }
    rollback(){
        this.calculatorInput = this.matrixToArray2D(this.calculator.pop());
        this.pastCalculated = this.matrixToString(this.calculator.recent());
        this.render();
    }
    calculate(operation: string){
        let isInstant = this.calculator.isInstantOperation(operation);
        try {
            let current = this.array2DtoMatrix(this.calculatorInput);
            if (isInstant){
                this.calculatorInput = this.matrixToArray2D(this.calculator.forceOperation(current,operation));
            } else if (this.calculator.isPrepared()){
                this.calculatorInput = this.matrixToArray2D(this.calculator.executeOperation(current,operation));
            } else {
                this.calculator.push({
                    operand: current,
                    operation: operation
                });
            }
        } catch (e){
            BackendUtils.errorHandling(e,this.onError);
            return;
        }
        if (!operation){
            this.calculatorInput = this.matrixToArray2D(this.calculator.recent());
            this.pastCalculated = this.emptyInput<string>("");
            this.render();
            return;
        }
        this.pastCalculated = this.matrixToString(this.calculator.recent());
        if (!isInstant) this.clear();
        this.render();
    }
    keyboardListener(e: KeyboardEvent){
        switch (e.key){
            case '+':
                this.calculate("add");
                e.preventDefault(); break;
            case '-':
                this.calculate("sub");
                e.preventDefault(); break;
            case 'x': this.calculate("mult"); break;
            case '*': this.calculate("mult"); break;
            case '^': this.calculate("exp2"); break;
            case "Enter":
                e.preventDefault();
                this.calculate(""); break;
            case "=": this.calculate(""); break;
            case "Delete":this.clear(e.ctrlKey); break;
            case "PageDown":
                e.preventDefault();
                this.rollback(); break;
        }
    }
    matrixToString(matrix:Matrix){
        let stringified:string[][] = [];
        for (let r = 0; r < MatrixCalculatorDisplay.MAX_MATRIX_SIZE[0]; r++){
            stringified.push([]);
            for (let c = 0; c < MatrixCalculatorDisplay.MAX_MATRIX_SIZE[1]; c++){
                let strpos;
                try {strpos = matrix.get([r,c]).toString();} catch (e){strpos = "";}
                stringified[r].push(strpos);
            }
        }
        return stringified;
    }
    matrixToArray2D(matrix:Matrix):number[][] {
        let arr2d:(number|null)[][] = [];
        const sizes = matrix.size();
        for (let r = 0; r < MatrixCalculatorDisplay.MAX_MATRIX_SIZE[0]; r++){
            arr2d.push([]);
            for (let c = 0; c < MatrixCalculatorDisplay.MAX_MATRIX_SIZE[1]; c++){
                arr2d[r].push((sizes[0] <= r || sizes[1] <= c ? null : matrix.get([r,c])));
            }
        }
        return arr2d;
    }
    array2DtoMatrix(array2d:(number|null)[][]){
        let limits:number[] = [0,0];
        for (let r = limits[0]; r < array2d.length; r++){
            for (let c = limits[1]; c < array2d[r].length; c++){
                if (array2d[r][c] !== null) limits = [r,c];
            }
        }
        let matproto:number[][] = [];
        for (let r = 0; r <= limits[0]; r++){
            matproto.push([]);
            for (let c = 0; c <= limits[1]; c++){
                if (array2d[r][c] === null) throw new UserError("Cannot parse the inputted matrix");
                matproto[r].push(array2d[r][c]);
            }
        }
        return matrix(matproto);
    }
    stringToMatrix(stringified:string[][]):Matrix{
        let limits:number[] = [0,0];
        for (let r = limits[0]; r < stringified.length; r++){
            for (let c = limits[1]; c < stringified[r].length; c++){
                if (stringified[r][c] !== "") limits = [r,c];
            }
        }
        let arr2d:number[][] = [];
        for (let r = 0; r <= limits[0]; r++){
            arr2d.push([]);
            for (let c = 0; c <= limits[1]; c++){
                arr2d[r].push(parseFloat(stringified[r][c]));
            }
            BackendUtils.assertIsntNaN(...arr2d[r]);
        }
        return matrix(arr2d);
    }
    emptyInput<T>(value:T,sizes:number[]=MatrixCalculatorDisplay.MAX_MATRIX_SIZE){
        let empty:T[][] = [];
        for (let i = 0; i < sizes[0]; i++){
            empty.push([]);
            for (let j = 0; j < sizes[1]; j++){
                empty[i].push(value);
            }
        }
        return empty;
    }
}