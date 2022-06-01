<script type="ts">
    import { FractionCalculator } from "../Calculation/Calculator";
    import { FractionCalculatorDisplay } from "../Calculation/CalculatorDisplay";
    import { createEventDispatcher } from "svelte";

    const dispatch = createEventDispatcher();
    const calculator = new FractionCalculatorDisplay(new FractionCalculator(),onUpdate,onError);
    let numeratorInput = calculator.numeratorInput,
    denominatorInput = calculator.denominatorInput,
    pastCalculated = calculator.pastCalculated,
    mixedFraction = calculator.mixedFraction,
    decimalValue = calculator.decimalValue,
    focusedOnNumerator = calculator.focusedOnNumerator;
    function onError(message:string){
        console.log(message);
        dispatch("alert",{
            type:"snackbar",
            message:message,
        });
    }
    function onUpdate(updated:{
        [key:string]:string
    }){
        numeratorInput = updated.numerator;
        denominatorInput = updated.denominator;
        pastCalculated = updated.past;
        mixedFraction = updated.mixed;
        decimalValue = updated.decimal;
        focusedOnNumerator = updated.focus === 'numerator';
    }
</script>

<article>
    <div id="past-calculated">{pastCalculated}</div>
    <div>
        <input type="text" class:focused = {focusedOnNumerator}
        class="full-width"
        bind:value = {numeratorInput} placeholder="0"
        on:keydown = {(e)=>{calculator.keyboardListener(e);}}
        on:focus = {()=>{calculator.switchFocus(true)}}>
        <hr>
        <input type="text" class="full-width" class:focused = {!focusedOnNumerator}
        bind:value = {denominatorInput} placeholder="0"
        on:keydown = {(e)=>{calculator.keyboardListener(e);}}
        on:focus = {()=>{calculator.switchFocus(false)}}>
    </div>
    <div class="calculator-grid">
        <button class="calc-btn" on:click={()=>{calculator.calculate("add")}}>+</button>
        <button class="calc-btn" on:click={()=>{calculator.calculate("sub")}}>-</button>
        <button class="calc-btn" on:click={()=>{calculator.calculate("mult")}}>x</button>
        <button class="calc-btn" on:click={()=>{calculator.calculate("div")}}>/</button>
        <button class="calc-btn" on:click={()=>{calculator.insert("7")}}>7</button>
        <button class="calc-btn" on:click={()=>{calculator.insert("8")}}>8</button>
        <button class="calc-btn" on:click={()=>{calculator.insert("9")}}>9</button>
        <button class="calc-btn" on:click={()=>{calculator.clear(true)}}>AC</button>
        <button class="calc-btn" on:click={()=>{calculator.insert("4")}}>4</button>
        <button class="calc-btn" on:click={()=>{calculator.insert("5")}}>5</button>
        <button class="calc-btn" on:click={()=>{calculator.insert("6")}}>6</button>
        <button class="calc-btn" on:click={()=>{calculator.clear(false)}}>CE</button>
        <button class="calc-btn" on:click={()=>{calculator.insert("1")}}>1</button>
        <button class="calc-btn" on:click={()=>{calculator.insert("2")}}>2</button>
        <button class="calc-btn" on:click={()=>{calculator.insert("3")}}>3</button>
        <button class="calc-btn" on:click={()=>{calculator.rollback()}}>&#11119;</button>
        <button class="calc-btn" on:click={()=>{calculator.insert("0")}}>0</button>
        <button class="calc-btn" on:click={()=>{calculator.switchFocus()}}>&#9650;</button>
        <button class="calc-btn" on:click={()=>{calculator.flipSign()}}>-/+</button>
        <button class="calc-btn" on:click={()=>{calculator.calculate("")}}>=</button>
        <button class="calc-btn" on:click={()=>{calculator.calculate("exp2")}}>x&#178;</button>
        <button class="calc-btn" on:click={()=>{calculator.switchFocus()}}>&#9660;</button>
        <button class="calc-btn" on:click={()=>{calculator.calculate("inv")}}>1/x</button>
        <button class="calc-btn" on:click={()=>{}}>1.0</button>
    </div>
    <table>
        <tr>
            <th>Complete Fraction</th>
            <td>{mixedFraction}</td>
        </tr>
        <tr>
            <th>Decimal Value</th>
            <td>{decimalValue}</td>
        </tr>
    </table>
</article>

<style>
    #past-calculated {color: var(--theme-disabled)}
    input[type=text] {
        background-color: var(--theme-disabled);
        margin: 0px;
        font-size: 1.4em;
    }
    table td,th {
        text-align: left;
        padding: 5px;
    }
    input[type=text].focused {background-color: var(--theme-light)}
    hr {
        height: 2px;
        margin: 20px 0px 0px;
    }
    .calculator-grid {grid-template-columns: 1fr 1fr 1fr 1fr;}
    .calculator-grid .calc-btn {margin: 0px;}
    @media screen and (max-width: 420px){
        input[type=text] {
            font-size: 1.2em;
        }
        .calculator-grid {
            column-gap: 5px;
            row-gap: 5px;
        }
    }
</style>