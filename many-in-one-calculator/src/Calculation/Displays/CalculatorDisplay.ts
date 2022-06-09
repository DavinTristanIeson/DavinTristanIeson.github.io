import type { Calculator,FractionCalculator } from "../Elements/Calculator";
import type { CalculatorSystem } from "../Elements/CalculatorSystem";
import { Fraction } from "../Elements/Fraction";
import { BackendUtils } from "../../Utils/BackEndUtils";
import type { Matrix } from "mathjs";

export interface CalculatorDisplayI<T extends number|Fraction|Matrix> {
    calculator:CalculatorSystem<T>
    insert: (piece:string)=>void
    clear: (allClear:boolean)=>void
    rollback: ()=>void
    calculate: (operation:string)=>void
    keyboardListener: (e:KeyboardEvent)=>void
}

export class BasicCalculatorDisplay implements CalculatorDisplayI<number> {
    calculatorInput:HTMLInputElement = null;
    pastCalculated:HTMLDivElement = null;
    // vulnerable input makes it so that the moment any input from the calculator buttons happen, the past input just disappears.
    private vulnerableInput:boolean = false;
    private loadedDot:boolean = false;
    calculator:Calculator;
    onError: (message:string)=>void;
    constructor(calculator:Calculator,onError:(message:string)=>void){
        this.calculator = calculator;
        this.onError = onError;
    }
    insert(numpiece:string){
        // inserts a character into the calculator
        if (this.vulnerableInput){
            // destroys the current input if the input is 'vulnerable'
            this.clear();
        }
        // make sure so there's only one dot in the calculator
        // this is because input[type=number] for some goddamn reason doesn't treat 5. in this.calculatorInput.value as a valid number and removes it.
        if (numpiece === "." ){
            // this checks if a decimal point already exists or not
            if (!this.calculatorInput.value.includes(".")){
                // if not, set a .0 suffix to the number
                this.loadedDot = true;
                this.calculatorInput.value += ".0";
            }
            return;
        } else if (this.loadedDot){
            // if an unprocessed dot exists, replace the last 0 with the new numpiece.
            this.calculatorInput.value = this.calculatorInput.value.substring(0,this.calculatorInput.value.length-1) + numpiece;
            this.loadedDot = false;
            return;
        }
        this.calculatorInput.value += numpiece;
    }
    flipSign(){
        // adds or removes the '-' prefix unless the input is just 0, for which a sign is unnecessary.
        if (this.calculatorInput.value === '0' || this.calculatorInput.value.length === 0) return;
        if (this.calculatorInput.value.startsWith("-")) this.calculatorInput.value = this.calculatorInput.value.substring(1);
        else this.calculatorInput.value = "-" + this.calculatorInput.value;
    }
    clear(allClear:boolean=false){
        this.calculatorInput.value = "";
        this.vulnerableInput = false;
        // for AC button, it clears the calculator history (well, not everything, it leaves just the recentmost operand)
        if (allClear){
            this.pastCalculated.textContent = "";
            this.calculator.clear();
        } else {
            // else just clear the current input (CE button)
            this.pastCalculated.textContent = this.calculator.getOperationQueue();
        }
        
    }
    // go back to the past operand/operation
    rollback(){
        this.calculatorInput.value = this.calculator.pop().toString();
        this.pastCalculated.textContent = this.calculator.getOperationQueue();
    }
    assertLessThanInfinity(checkme?:number){
        if (checkme){
            BackendUtils.assertLessThanInfinity(checkme);
        } else {
            BackendUtils.assertLessThanInfinity(this.calculator.recent());
        }
    }
    calculate(operation:string){
        // parse the input first without caring whether it's NaN or not
        let current:number = parseFloat(this.calculatorInput.value);
        // check if the operation is instantaneous
        let isInstant = this.calculator.isInstantOperation(operation);
        try {
            if (isInstant){
                // if the operation is instant, it executes instantly at the input area
                if (operation !== "euler" && operation !== "pi") BackendUtils.assertIsntNaN(current);
                // force operation executes the operation without saving it.
                let result = this.calculator.forceOperation(current, operation);
                this.calculatorInput.value = result.toString();
            } else if (this.calculator.isPrepared()){
                // if the calculator is already ready to execute operation (it already has the first operand and the queued operation)
                if (!this.calculatorInput.value){
                    // if there's no input but another operation is about to be queued, just change the already queued operation to the new one
                    this.calculator.changeOperation(operation);
                } else {
                    // execute the operation if everything else is correct
                    BackendUtils.assertIsntNaN(current);
                    this.calculator.executeOperation(current,operation);
                }
            } else {
                // if there's no enqueued operation, then just queue the new operand and operation
                BackendUtils.assertIsntNaN(current);
                this.calculator.push({
                    operand: current,
                    operation: operation,
                });
            }
        } catch (e){
            BackendUtils.errorHandling(e,this.onError);
            return;
        }
        try {
            this.assertLessThanInfinity();
        } catch (e){
            this.calculator.pop();
            BackendUtils.errorHandling(e,this.onError);
            return;
        }
        if (!operation){
            // if there's no operation (basically the '=' button), empty the past calculated value
            // display the latest calculated value, and make it so that the input is 'vulnerable'.
            this.calculatorInput.value = this.calculator.recent().toString();
            this.pastCalculated.textContent = "";
            this.vulnerableInput = true
            return;
        }
        this.pastCalculated.textContent = this.calculator.getOperationQueue();
        if (!isInstant) this.clear();
    }
    keyboardListener(e:KeyboardEvent){
        switch (e.key){
            case '+':
                this.calculate("add");
                e.preventDefault(); break;
            case '-':
                this.calculate("sub");
                e.preventDefault(); break;
            case 'x': this.calculate("mult"); break;
            case '*': this.calculate("mult"); break;
            case '/': this.calculate("div"); break;
            case '%': this.calculate("mod"); break;
            case '^': this.calculate("exp"); break;
            case '!': this.calculate("fact"); break;
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
}

export class FractionCalculatorDisplay implements CalculatorDisplayI<Fraction> {
    onError: (message: string) => void;
    calculator: CalculatorSystem<Fraction>;
    private vulnerableInput:boolean = false;
    // the focused input field
    focusedOnNumerator:boolean = true;
    numeratorInput:HTMLInputElement = null;
    denominatorInput:HTMLInputElement = null;
    pastCalculated:HTMLDivElement = null;
    // the fraction in the [number] [fraction] format
    mixedFraction:HTMLTableCellElement = null;
    // the floating point value of the fraction
    decimalValue:HTMLTableCellElement = null;
    onUpdate:(focus:boolean)=>void;
    constructor(
        calculator:FractionCalculator,
        onUpdate:(focus:boolean)=>void,
        onError:(message:string)=>void
    ){
        this.calculator = calculator;
        this.onError = onError;
        this.onUpdate = onUpdate;
    }
    setFocus(newValue:boolean|null = null){
        if (newValue !== null) this.switchFocus(true);
        this.onUpdate(this.focusedOnNumerator);
    }
    switchFocus(force:boolean|null = null){
        if (force !== null) this.focusedOnNumerator = force;
        else this.focusedOnNumerator = !this.focusedOnNumerator;

        const activeElement = document.activeElement;
        if (activeElement === this.denominatorInput && this.focusedOnNumerator) this.numeratorInput.focus();
        else if (activeElement === this.numeratorInput && !this.focusedOnNumerator) this.denominatorInput.focus();
        this.setFocus();
    }
    insert(numpiece:string){
        // inserts a character into the calculator
        if (this.vulnerableInput){
            // destroys the current input if the input is 'vulnerable'
            this.clear(false);
        }
        if (this.focusedOnNumerator) this.numeratorInput.value += numpiece;
        else this.denominatorInput.value += numpiece;
    }
    clear(allClear = false){
        this.numeratorInput.value = "";
        this.denominatorInput.value = "";
        this.mixedFraction.textContent = "";
        this.decimalValue.textContent = "";
        this.vulnerableInput = false;
        // for AC button, it clears the calculator history (well, not everything, it leaves just the recentmost operand)
        if (allClear){
            this.pastCalculated.textContent = "";
            this.calculator.clear();
        } else {
            // else just clear the current input (CE button)
            this.pastCalculated.textContent = this.calculator.getOperationQueue();
        }
        this.setFocus(true);
    }
    fillInputs(fraction:Fraction){
        if (!fraction) return;
        this.numeratorInput.value = fraction.numerator.toString();
        this.denominatorInput.value = fraction.denominator.toString();
        this.mixedFraction.textContent = fraction.toMixedFraction();
        this.decimalValue.textContent = fraction.toDecimal().toString();
    }
    rollback(){
        this.fillInputs(this.calculator.pop());
        this.pastCalculated.textContent = this.calculator.getOperationQueue();
    }
    calculate(operation: string){
        let numerator = parseInt(this.numeratorInput.value), denominator = parseInt(this.denominatorInput.value);
        let isInstant = this.calculator.isInstantOperation(operation);
        if (!isInstant) this.switchFocus(true);
        try {
            if (isInstant){
                // if the operation is instant, it executes instantly at the input area
                BackendUtils.assertIsntNaN(numerator,denominator);
                // force operation executes the operation without saving it.
                let result = this.calculator.forceOperation(new Fraction(numerator,denominator),operation);
                this.fillInputs(result);
            } else if (this.calculator.isPrepared()){
                // if the calculator is already ready to execute operation (it already has the first operand and the queued operation)
                if (!this.numeratorInput || !this.denominatorInput){
                    // if there's no input but another operation is about to be queued, just change the already queued operation to the new one
                    this.calculator.changeOperation(operation);
                } else {
                    BackendUtils.assertIsntNaN(numerator,denominator);
                    // execute the operation if everything else is correct
                    this.calculator.executeOperation(new Fraction(numerator,denominator),operation);
                }
            } else {
                // if there's no enqueued operation, then just queue the new operand and operation
                BackendUtils.assertIsntNaN(numerator,denominator);
                this.calculator.push({
                    operand: new Fraction(numerator,denominator),
                    operation: operation,
                });
            }
        } catch (e){
            BackendUtils.errorHandling(e,this.onError);
            return;
        }
        this.setFocus(true);
        if (!operation){
            // if there's no operation (basically the '=' button), empty the past calculated value
            // display the latest calculated value, and make it so that the input is 'vulnerable'.
            this.fillInputs(this.calculator.recent());
            this.pastCalculated.textContent = "";
            this.vulnerableInput = true
            return;
        }
        this.pastCalculated.textContent = this.calculator.getOperationQueue();
        if (!isInstant) this.clear();
    }
    flipSign(){
        // adds or removes the '-' prefix unless the input is just 0, for which a sign is unnecessary.
        if (this.numeratorInput.value === '0' || this.numeratorInput.value.length === 0) return;
        if (this.numeratorInput.value.startsWith("-")) this.numeratorInput.value = this.numeratorInput.value.substring(1);
        else this.numeratorInput.value = "-" + this.numeratorInput.value;
    }
    keyboardListener(e:KeyboardEvent){
        switch (e.key){
            case '+':
                this.calculate("add");
                e.preventDefault(); break;
            case '-':
                this.calculate("sub");
                e.preventDefault(); break;
            case 'x': this.calculate("mult"); break;
            case '*': this.calculate("mult"); break;
            case '/': this.calculate("div"); break;
            case '^': this.calculate("exp2"); break;
            case "Enter":
                e.preventDefault();
                this.calculate(""); break;
            case "=": this.calculate(""); break;
            case "Delete":this.clear(e.ctrlKey); break;
            case "PageDown":
                e.preventDefault();
                this.rollback(); break;
            case "ArrowUp":
                e.preventDefault();    
                this.switchFocus(null); break;
            case "ArrowDown":
                e.preventDefault();    
                this.switchFocus(null); break;
        }
    }
}