<script lang="ts">
    import { Calculator } from "../Calculation/Elements";
    import { BasicCalculatorDisplay } from "../Calculation/Displays";
    import { createEventDispatcher } from "svelte";
    
    const calculator = new BasicCalculatorDisplay(new Calculator(),onError);
    const dispatch = createEventDispatcher();
    function onError(message:string){
        dispatch("alert",{
            type:"snackbar",
            message:message,
        });
    }
</script>

<article>
    <div id="past-calculated" bind:this={calculator.pastCalculated}></div>
    <input type="number" id="calculator-input" class="full-width"
    bind:this = {calculator.calculatorInput} placeholder="0"
    on:keydown = {(e)=>{calculator.keyboardListener(e);}}>
    <div class="calculator-grid">
        <button class="calc-btn" on:click={()=>{calculator.calculate("add")}}>+</button>
        <button class="calc-btn" on:click={()=>{calculator.calculate("sub")}}>-</button>
        <button class="calc-btn" on:click={()=>{calculator.calculate("mult")}}>x</button>
        <button class="calc-btn" on:click={()=>{calculator.calculate("div")}}>/</button>
        <button class="calc-btn" on:click={()=>{calculator.clear(true)}}>AC</button>
        <button class="calc-btn" on:click={()=>{calculator.insert("7")}}>7</button>
        <button class="calc-btn" on:click={()=>{calculator.insert("8")}}>8</button>
        <button class="calc-btn" on:click={()=>{calculator.insert("9")}}>9</button>
        <button class="calc-btn" on:click={()=>{calculator.calculate("exp")}}>x<sup>n</sup></button>
        <button class="calc-btn" on:click={()=>{calculator.clear(false)}}>CE</button>
        <button class="calc-btn" on:click={()=>{calculator.insert("4")}}>4</button>
        <button class="calc-btn" on:click={()=>{calculator.insert("5")}}>5</button>
        <button class="calc-btn" on:click={()=>{calculator.insert("6")}}>6</button>
        <button class="calc-btn" on:click={()=>{calculator.calculate("mod")}}>%</button>
        <button class="calc-btn" on:click={()=>{calculator.rollback()}}>&#11119;</button>
        <button class="calc-btn" on:click={()=>{calculator.insert("1")}}>1</button>
        <button class="calc-btn" on:click={()=>{calculator.insert("2")}}>2</button>
        <button class="calc-btn" on:click={()=>{calculator.insert("3")}}>3</button>
        <button class="calc-btn" on:click={()=>{calculator.calculate("log")}}>log</button>
        <button class="calc-btn" on:click={()=>{calculator.calculate("sqrt")}}>&Sqrt;</button>
        <button class="calc-btn" on:click={()=>{calculator.insert("0")}}>0</button>
        <button class="calc-btn" on:click={()=>{calculator.insert(".")}}>.</button>
        <button class="calc-btn" on:click={()=>{calculator.calculate("")}}>=</button>
        <button class="calc-btn" on:click={()=>{calculator.calculate("ln")}}>ln</button>
        <button class="calc-btn" on:click={()=>{calculator.calculate("inv")}}>1/x</button>
        <button class="calc-btn" on:click={()=>{calculator.calculate("fact")}}>n!</button>
        <button class="calc-btn" on:click={()=>{calculator.calculate("round")}}>⌊n⌉</button>
        <button class="calc-btn" on:click={()=>{calculator.flipSign()}}>-/+</button>
        <button class="calc-btn" on:click={()=>{calculator.calculate("pi")}}>&pi;</button>
        <button class="calc-btn" on:click={()=>{calculator.calculate("euler")}}>e</button>
    </div>
</article>

<style>
    #past-calculated {color: var(--theme-disabled);}
    input[type=number] {
        font-size: 1.4em;
    }
    .calculator-grid {grid-template-columns: 1fr 1fr 1fr 1fr 1fr;}
    .calculator-grid .calc-btn {margin: 0px;}
    @media screen and (max-width: 450px){
        input[type=number] {
            font-size: 1.2em;
        }
    }
</style>