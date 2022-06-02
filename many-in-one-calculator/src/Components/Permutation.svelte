<script type="ts">
    import {factorial, stringPermutation, FORMULAS, OPERATIONS} from "../Calculation/Elements/Permutation";
    import { Direction, FrontendUtils,BackendUtils } from "../Utils";
    import { createEventDispatcher } from "svelte";
    const dispatch = createEventDispatcher();
    let permcombiSettings: [boolean,boolean] = [false,false],
    permcombiFormula = "";
    let permutStringInput:string = "";
    let factorialDivisionResult:string = "",
    permcombiResult:string = "",
    permutStringResult:string = "";

    let factDivInputUp:HTMLInputElement, factDivInputDown:HTMLInputElement;
    let permcombiInputLeft:HTMLInputElement, permcombiInputRight:HTMLInputElement;

    function onError(message:string){
        dispatch("alert",{
            type:"snackbar",
            message:message
        });
    }
    function factorialDivision(){
        const operands = [parseInt(factDivInputUp.value),parseInt(factDivInputDown.value)];
        try {
            BackendUtils.assertIsntNaN(...operands);
            BackendUtils.assertIsntNegative(...operands);
        } catch (e){
            BackendUtils.errorHandling(e,onError);
            return;
        }
        if (operands[0] < operands[1]){
            factorialDivisionResult = (1/factorial(operands[1],operands[0])).toString();
        } else {
            factorialDivisionResult = factorial(operands[0],operands[1]).toString();
        }
    }
    function calcPermCombi(){
        const operands = [parseInt(permcombiInputLeft.value),parseInt(permcombiInputRight.value)];
        try {
            BackendUtils.assertIsntNaN(...operands);
            BackendUtils.assertIsntNegative(...operands);
        } catch (e){
            BackendUtils.errorHandling(e,onError);
            return;
        }
        if (operands[0] < operands[1]){
            onError("The left operand of the Combination/Permutation function should be greater than the right operand!")
            return;
        }
        const idx = (permcombiSettings[0] ? 1 : 0) + (permcombiSettings[1] ? 2 : 0);
        permcombiResult = OPERATIONS[idx](operands[0],operands[1]).toString();
        permcombiFormula = FORMULAS[idx];
    }

    function stringPermut(){
        const counter = Object.create(null);
        for (let chr of permutStringInput){
            if (chr in counter) counter[chr]++;
            else counter[chr] = 1;
        }
        permutStringResult = stringPermutation(permutStringInput.length,Object.values(counter)).toString() + '\n';
        for (let [key,value] of Object.entries(counter)){
            permutStringResult += `${key} : ${value}\n`;
        }
    }
</script>

<div class="center-h">
    <h3>Factorial Division</h3>
    <div class="center-v">
        <div class="center-h">
            <div class="bigger">
                <input type="number" class="shorter" min="0"
                on:keydown={(e)=>{
                    FrontendUtils.onEnter(e,factorialDivision);
                    FrontendUtils.onArrowChangeFocus(e,factDivInputDown,Direction.UP|Direction.DOWN);
                }} bind:this={factDivInputUp}> !
            </div>
            <hr>
            <div class="bigger">
                <input type="number" class="shorter" min="0"
                on:keydown={(e)=>{
                    FrontendUtils.onEnter(e,factorialDivision);
                    FrontendUtils.onArrowChangeFocus(e,factDivInputUp,Direction.UP|Direction.DOWN);
                }} bind:this={factDivInputDown}> !
            </div>
        </div>
        <p class="bigger">=</p>
        <div class="result">{factorialDivisionResult}</div>
    </div>
    <hr>
    <h3>Permutation/Combination</h3>
    <div class="center-v">
        <label>
            <input type="checkbox" bind:checked={permcombiSettings[0]}
            on:click={()=>{
                if (permcombiInputLeft.value && permcombiInputRight.value) calcPermCombi();
            }}> Ordered</label>
        <label>
            <input type="checkbox" bind:checked={permcombiSettings[1]}
            on:click={()=>{
                if (permcombiInputLeft.value && permcombiInputRight.value) calcPermCombi();
            }}> Repeatable</label>
    </div>
    <div class="center-v">
        <p class="bigger">{#if permcombiSettings[0]}P{:else}C{/if}(</p>
        <input type="number" class="shorter" min="0"
        on:keydown={(e)=>{
            FrontendUtils.onEnter(e,calcPermCombi);
            FrontendUtils.onArrowChangeFocus(e,permcombiInputRight,Direction.LEFT|Direction.RIGHT);
        }} bind:this={permcombiInputLeft}>
        <p class="bigger">,</p>
        <input type="number" class="shorter" min="0"
        on:keydown={(e)=>{
            FrontendUtils.onEnter(e,calcPermCombi);
            FrontendUtils.onArrowChangeFocus(e,permcombiInputLeft,Direction.LEFT|Direction.RIGHT);
        }} bind:this={permcombiInputRight}>
        <p class="bigger">) =</p>
        <div class="result">{permcombiResult}</div>
    </div>
    <div class="result full-width">{permcombiFormula}</div>
    <hr>
    <h3>String Permutation</h3>
    <input type="text" bind:value={permutStringInput}
    on:keydown={(e)=>{FrontendUtils.onEnter(e,stringPermut)}} class="full-width">
    <div class="result full-width max-500-y">{permutStringResult}</div>
    <hr>
</div>

<style>
    .bigger {font-size: 1.4em;}
    .bigger input {font-size: 1.2em;}
    .shorter {max-width: 80px; font-size: 1.2em;}
    p.bigger {margin: 0px 15px;}
    .result {
        border: 2px solid black;
        padding: 10px;
        font-size: 1.2em;
    }
    label {margin-right: 20px;}
    @media screen and (max-width: 540px){
        .shorter {
            max-width: 60px;
            max-height: 40px;
            font-size: 1em;
        }
    }
    @media screen and (max-width: 360px){
        .shorter {
            max-width: 45px;
            max-height: 30px;
            font-size: 0.8em;
        }
    }
</style>