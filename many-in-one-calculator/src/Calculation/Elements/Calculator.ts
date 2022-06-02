import { CalculatorSystem } from "./CalculatorSystem";
import type { Fraction } from "./Fraction";

export class Calculator extends CalculatorSystem<number> {
    constructor(){
        super({
            "add": (op1:number,op2:number)=>op1+op2,
            "sub": (op1:number,op2:number)=>op1-op2,
            "mult": (op1:number,op2:number)=>op1*op2,
            "div": (op1:number,op2:number)=>op1/op2,
            "mod": (op1:number,op2:number)=>op1%op2,
            "exp": (op1:number,op2:number)=>op1**op2,
            "log": (op1:number,op2:number)=>Math.log(op2)/Math.log(op1),
            "ln": (op:number)=>Math.log(op),
            "sqrt": (op:number)=>Math.sqrt(op),
            "inv": (op:number)=>1/op,
            "fact": (op:number)=>{
                let result = 1;
                while (op > 1 && result !== Infinity){
                    result*=op;
                    op--;
                }
                return result;
            },
            "round":(op:number)=>Math.round(op),
            "abs":(op:number)=>Math.abs(op),
            "euler":(_:number)=>Math.E,
            "pi":(_:number)=>Math.PI
        });
    }
    getOperationQueue():string {
        if (this.recentOperation() === "log"){
            return `log${this.recent()} (x)`;
        }
        return this.recent().toString() + ' ' + this.getOperationSymbol();
    }
    isInstantOperation(operationString:string):boolean {
        return (operationString === "ln" ||
        operationString === "sqrt" ||
        operationString === "inv" ||
        operationString === "round" || 
        operationString === "fact" ||
        operationString === "euler" ||
        operationString === "pi");
    }
}

export class FractionCalculator extends CalculatorSystem<Fraction> {
    constructor(){
        super({
            "add": (op1:Fraction, op2:Fraction) => op1.add(op2),
            "sub": (op1:Fraction ,op2:Fraction)=> op1.sub(op2),
            "mult": (op1:Fraction ,op2:Fraction)=> op1.mult(op2),
            "div": (op1:Fraction ,op2:Fraction)=> op1.div(op2),
            "inv": (op:Fraction) => op.flip(),
            "exp2": (op:Fraction) => {
                return op.mult(op);
            }
        });
    }
    getOperationQueue(): string {
        return this.recent().toString() + ' ' + this.getOperationSymbol();
    }
    isInstantOperation(operationString: string): boolean {
        return (operationString === "inv" || operationString === "exp2")
    }
}