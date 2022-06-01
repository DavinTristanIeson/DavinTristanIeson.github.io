import type { Calculator,FractionCalculator } from "./Calculator";
import type { CalculatorSystem } from "./CalculatorSystem";
import { Fraction } from "./Fraction";

interface CalculatorDisplayI<T extends number|bigint|Fraction> {
    onError: (message:string)=>void;
    onUpdate: (updated:{[key:string]:string})=>void;
    calculator:CalculatorSystem<T>
    insert: (piece:string)=>void
    clear: (allClear:boolean)=>void
    rollback: ()=>void
    calculate: (operation:string)=>void
    keyboardListener: (e:KeyboardEvent)=>void
}

export class BasicCalculatorDisplay implements CalculatorDisplayI<number> {
    calculatorInput:string = "";
    pastCalculated:string = "0";
    // vulnerable input makes it so that the moment any input from the calculator buttons happen, the past input just disappears.
    private vulnerableInput:boolean = false;
    calculator:Calculator;
    onError: (message:string)=>void;
    onUpdate: (updated:{[key:string]:string})=>void;
    constructor(calculator:Calculator,onUpdate:(updated:{[key:string]:string})=>void,onError:(message:string)=>void){
        this.calculator = calculator;
        this.onUpdate = onUpdate;
        this.onError = onError;
    }
    render(){
        this.onUpdate({
            input:this.calculatorInput,
            past:this.pastCalculated,
        });
    }
    insert(numpiece:string){
        // inserts a character into the calculator
        if (this.vulnerableInput){
            // destroys the current input if the input is 'vulnerable'
            this.clear();
        }
        // make sure so there's only one dot in the calculator
        if (numpiece == "." && this.calculatorInput.includes(".")) return;
        this.calculatorInput += numpiece;
        this.render();
    }
    flipSign(){
        // adds or removes the '-' prefix unless the input is just 0, for which a sign is unnecessary.
        if (this.calculatorInput === '0' || this.calculatorInput.length === 0) return;
        if (this.calculatorInput.startsWith("-")) this.calculatorInput = this.calculatorInput.substring(1);
        else this.calculatorInput = "-" + this.calculatorInput;
        this.render();
    }
    clear(allClear:boolean=false){
        this.calculatorInput = "";
        this.vulnerableInput = false;
        // for AC button, it clears the calculator history (well, not everything, it leaves just the recentmost operand)
        if (allClear){
            this.pastCalculated = "";
            this.calculator.clear();
        } else {
            // else just clear the current input (CE button)
            this.pastCalculated = this.calculator.getOperationQueue();
        }
        this.render();
    }
    // go back to the past operand/operation
    rollback(){
        this.calculatorInput = this.calculator.pop().toString();
        this.pastCalculated = this.calculator.getOperationQueue();
        this.render();
    }
    private assertIsntNaN(input:number){
        if (isNaN(input)){
            throw "Input must be a valid number";
        }
    }
    calculate(operation:string){
        // parse the input first without caring whether it's NaN or not
        let current:number = parseFloat(this.calculatorInput);
        // check if the operation is instantaneous
        let isInstant = this.calculator.isInstantOperation(operation);
        try {
            if (isInstant){
                // if the operation is instant, it executes instantly at the input area
                operation !== "euler" && operation !== "pi" && this.assertIsntNaN(current);
                // force operation executes the operation without saving it.
                this.calculatorInput = this.calculator.forceOperation(current, operation).toString();
            } else if (this.calculator.isPrepared()){
                // if the calculator is already ready to execute operation (it already has the first operand and the queued operation)
                if (!this.calculatorInput){
                    // if there's no input but another operation is about to be queued, just change the already queued operation to the new one
                    this.calculator.changeOperation(operation);
                } else {
                    // execute the operation if everything else is correct
                    this.assertIsntNaN(current);
                    this.calculator.executeOperation(current,operation);
                }
            } else {
                // if there's no enqueued operation, then just queue the new operand and operation
                this.assertIsntNaN(current);
                this.calculator.push({
                    operand: current,
                    operation: operation,
                });
            }
            if (!operation){
                // if there's no operation (basically the '=' button), empty the past calculated value
                // display the latest calculated value, and make it so that the input is 'vulnerable'.
                this.calculatorInput = this.calculator.recent().toString();
                this.pastCalculated = "";
                this.vulnerableInput = true
                this.render();
                return;
            }
            this.pastCalculated = this.calculator.getOperationQueue();
            if (!isInstant) this.clear();
        } catch (e){
            this.onError(e.toString());
        }
        this.render();
    }
    keyboardListener(e:KeyboardEvent){
        if (e.key !== "ArrowLeft" && e.key !== "ArrowRight"){
            e.preventDefault();
        }
        switch (e.key){
            case '+': this.calculate("add"); break;
            case '-': this.calculate("sub"); break;
            case 'x': this.calculate("mult"); break;
            case '*': this.calculate("mult"); break;
            case '/': this.calculate("div"); break;
            case '%': this.calculate("mod"); break;
            case '^': this.calculate("exp"); break;
            case '!': this.calculate("fact"); break;
            case "Enter": this.calculate(""); break;
            case "=": this.calculate(""); break;
            case "Delete":this.clear(e.ctrlKey); break;
            case "PageDown": this.rollback(); break;
        }
        
        const eligibleInput = ('0' <= e.key && e.key <= '9') ||
        (e.key === '.' && !(this.calculatorInput.includes('.') || this.calculatorInput.length === 0)) ||
        (e.key === '_' && this.calculatorInput.length === 0)
        if (eligibleInput){
            this.calculatorInput += (e.key === '_' ? '-' : e.key);
            this.render();
        } else if (e.key === 'Backspace'){
            this.calculatorInput = this.calculatorInput.substring(0,this.calculatorInput.length-1);
            this.render();
        }
    }
}

export class FractionCalculatorDisplay implements CalculatorDisplayI<Fraction> {
    onError: (message: string) => void;
    onUpdate: (updated: { [key: string]: string; }) => void;
    calculator: CalculatorSystem<Fraction>;
    private vulnerableInput:boolean = false;
    // the focused input field
    focusedOnNumerator:boolean = true;
    numeratorInput:string = "";
    denominatorInput:string = "";
    pastCalculated:string = "";
    // the fraction in the [number] [fraction] format
    mixedFraction:string = "";
    // the floating point value of the fraction
    decimalValue:string = "";
    constructor(calculator:FractionCalculator,onUpdate:(updated:{[key:string]:string})=>void,onError:(message:string)=>void){
        this.calculator = calculator;
        this.onUpdate = onUpdate;
        this.onError = onError;
    }
    render(){
        this.onUpdate({
            numerator:this.numeratorInput,
            denominator:this.denominatorInput,
            past:this.pastCalculated,
            mixed:this.mixedFraction,
            decimal:this.decimalValue,
            focus:(this.focusedOnNumerator ? "numerator" : "denominator")
        });
    }
    switchFocus(force:boolean|null = null){
        if (force !== null) this.focusedOnNumerator = force;
        else this.focusedOnNumerator = !this.focusedOnNumerator;
        this.render();
    }
    insert(numpiece:string){
        // inserts a character into the calculator
        if (this.vulnerableInput){
            // destroys the current input if the input is 'vulnerable'
            this.clear(false);
        }
        if (this.focusedOnNumerator) this.numeratorInput += numpiece;
        else this.denominatorInput += numpiece;
        this.render();
    }
    clear(allClear = false){
        this.numeratorInput = "";
        this.denominatorInput = "";
        this.mixedFraction = "";
        this.decimalValue = "";
        this.vulnerableInput = false;
        // for AC button, it clears the calculator history (well, not everything, it leaves just the recentmost operand)
        if (allClear){
            this.pastCalculated = "";
            this.calculator.clear();
        } else {
            // else just clear the current input (CE button)
            this.pastCalculated = this.calculator.getOperationQueue();
        }
        this.render();
    }
    fillInputs(fraction:Fraction){
        this.numeratorInput = fraction.numerator.toString();
        this.denominatorInput = fraction.denominator.toString();
        this.mixedFraction = fraction.toMixedFraction();
        this.decimalValue = fraction.toDecimal().toString();
    }
    rollback(){
        this.fillInputs(this.calculator.pop());
        this.pastCalculated = this.calculator.getOperationQueue();
        this.render();
    }
    private assertIsntNaN(input:number){
        if (isNaN(input)){
            throw "Input must be a valid number";
        }
    }
    calculate(operation: string){
        let numerator = parseInt(this.numeratorInput), denominator = parseInt(this.denominatorInput);
        let isInstant = this.calculator.isInstantOperation(operation);
        if (!isInstant) this.switchFocus(true);
        try {
            if (isInstant){
                // if the operation is instant, it executes instantly at the input area
                this.assertIsntNaN(numerator); this.assertIsntNaN(denominator);
                // force operation executes the operation without saving it.
                this.fillInputs(this.calculator.forceOperation(new Fraction(numerator,denominator), operation));
            } else if (this.calculator.isPrepared()){
                // if the calculator is already ready to execute operation (it already has the first operand and the queued operation)
                if (!this.numeratorInput || !this.denominatorInput){
                    // if there's no input but another operation is about to be queued, just change the already queued operation to the new one
                    this.calculator.changeOperation(operation);
                } else {
                    this.assertIsntNaN(numerator); this.assertIsntNaN(denominator);
                    // execute the operation if everything else is correct
                    this.calculator.executeOperation(new Fraction(numerator,denominator),operation);
                }
            } else {
                // if there's no enqueued operation, then just queue the new operand and operation
                this.assertIsntNaN(numerator); this.assertIsntNaN(denominator);
                this.calculator.push({
                    operand: new Fraction(numerator,denominator),
                    operation: operation,
                });
            }
            if (!operation){
                // if there's no operation (basically the '=' button), empty the past calculated value
                // display the latest calculated value, and make it so that the input is 'vulnerable'.
                this.fillInputs(this.calculator.recent());
                this.pastCalculated = "";
                this.vulnerableInput = true
                this.render();
                return;
            }
            this.pastCalculated = this.calculator.getOperationQueue();
            if (!isInstant) this.clear();
        } catch (e){
            this.onError(e.toString());
        }
        this.render();
    }
    flipSign(){
        // adds or removes the '-' prefix unless the input is just 0, for which a sign is unnecessary.
        if (this.numeratorInput === '0' || this.numeratorInput.length === 0) return;
        if (this.numeratorInput.startsWith("-")) this.numeratorInput = this.numeratorInput.substring(1);
        else this.numeratorInput = "-" + this.numeratorInput;
        this.render();
    }
    keyboardListener(e:KeyboardEvent){
        if (e.key !== "ArrowLeft" && e.key !== "ArrowRight"){
            e.preventDefault();
        }
        switch (e.key){
            case '+': this.calculate("add"); break;
            case '-': this.calculate("sub"); break;
            case 'x': this.calculate("mult"); break;
            case '*': this.calculate("mult"); break;
            case '/': this.calculate("div"); break;
            case '^': this.calculate("exp2"); break;
            case "Enter": this.calculate(""); break;
            case "=": this.calculate(""); break;
            case "Delete":this.clear(e.ctrlKey); break;
            case "PageDown": this.rollback(); break;
            case "ArrowUp": this.switchFocus(); break;
            case "ArrowDown": this.switchFocus(); break;
        }
        if (this.focusedOnNumerator){
            const eligibleInput = ('0' <= e.key && e.key <= '9') ||
            (e.key === '_' && this.numeratorInput.length === 0);
            if (eligibleInput){
                this.numeratorInput += (e.key === '_' ? '-' : e.key);
                this.render();
            } else if (e.key === 'Backspace'){
                this.numeratorInput = this.numeratorInput.substring(0,this.numeratorInput.length-1);
                this.render();
            }
        } else {
            const eligibleInput = ('0' <= e.key && e.key <= '9') ||
            (e.key === '_' && this.denominatorInput.length === 0);
            if (eligibleInput){
                this.denominatorInput += (e.key === '_' ? '-' : e.key);
                this.render();
            } else if (e.key === 'Backspace'){
                this.denominatorInput = this.denominatorInput.substring(0,this.denominatorInput.length-1);
                this.render();
            }
        }
        
    }
}