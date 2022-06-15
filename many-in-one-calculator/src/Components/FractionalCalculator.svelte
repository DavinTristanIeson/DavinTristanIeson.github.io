<script type="ts">
    import { FractionCalculator } from "../Calculation/Elements/Calculator";
    import { FractionCalculatorDisplay } from "../Calculation/Displays/CalculatorDisplay";
    import { createEventDispatcher } from "svelte";

    const dispatch = createEventDispatcher();
    const calculator = new FractionCalculatorDisplay(new FractionCalculator(),onUpdate,onError);
    let focusedOnNumerator = true;
    function onError(message:string){
        dispatch("alert",{
            type:"snackbar",
            message:message,
        });
    }
    function onUpdate(focus:boolean){
        focusedOnNumerator = focus;
    }
</script>

<article>
    <div class="past-calculated" bind:this={calculator.pastCalculated}></div>
    <div>
        <input type="number" class:focused = {focusedOnNumerator}
        class="full-width"
        bind:this = {calculator.numeratorInput} placeholder="0"
        on:keydown = {(e)=>{calculator.keyboardListener(e);}}
        on:focus = {()=>{calculator.switchFocus(true)}}>
        <hr>
        <input type="number" class="full-width" class:focused = {!focusedOnNumerator}
        bind:this = {calculator.denominatorInput} placeholder="0"
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
        <button class="calc-btn disabled" on:click={()=>{}} title="None"></button>
    </div>
    <table>
        <tr>
            <th>Complete Fraction</th>
            <td bind:this={calculator.mixedFraction}></td>
        </tr>
        <tr>
            <th>Decimal Value</th>
            <td bind:this={calculator.decimalValue}></td>
        </tr>
    </table>
</article>

<style>
    .past-calculated {
        color: var(--theme-separator);
        text-align: left;
        margin-top: 20px;
    }
    input[type=number] {
        background-color: var(--theme-disabled);
        margin: 0px;
        font-size: 1.4em;
    }
    table td,th {
        text-align: left;
        padding: 5px;
    }
    input[type=number].focused {background-color: var(--theme-input)}
    hr {
        height: 2px;
        margin: 20px 0px;
    }
    .calculator-grid {
        grid-template-columns: 1fr 1fr 1fr 1fr;
        margin: 20px 0px;
    }
    @media screen and (max-width: 450px){
        input[type=number] {
            font-size: 1.2em;
        }
        .calculator-grid {
            column-gap: 5px;
            row-gap: 5px;
        }
    }
</style>