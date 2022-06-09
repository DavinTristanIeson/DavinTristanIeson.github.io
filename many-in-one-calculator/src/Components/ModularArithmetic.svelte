<script type="ts">
    import * as mod from "../Calculation/Elements/ModularArithmetic";
    import { BackendUtils, Direction, FrontendUtils } from "../Utils";
    import { createEventDispatcher } from "svelte";
    const dispatch = createEventDispatcher();
    function onError(message:string){
        dispatch("alert",{
            type:"snackbar",
            message:message
        });
    }

    let fastExpParams:[number|null,number|null,number|null] = [null,null,null];
    let fastExpResult:string = "";
    let fastExpInputs:[HTMLInputElement,HTMLInputElement,HTMLInputElement] = [null,null,null];
    function modularExponentiation(){
        if (!BackendUtils.tryCatch(()=>BackendUtils.assertIsntNaN(...fastExpParams),onError)) return;
        mod.modularExponentiation(fastExpParams[0],fastExpParams[1],fastExpParams[2]).then(result => {
            fastExpResult = result.toString();
        })
    }

    let generatedModulo:number[] = [];
    let modGenParams:[number|null,number|null] = [null,null];
    let modGenInputs:[HTMLInputElement,HTMLInputElement] = [null,null];
    let isPrimitiveRoot:string = "";
    function generateModulo(){
        if (!BackendUtils.tryCatch(()=>BackendUtils.assertIsntNaN(...modGenParams),onError)) return;
        mod.moduloGenerator(modGenParams[0],modGenParams[1]).then(result => {generatedModulo = result});
        mod.isPrimitiveRoot(generatedModulo).then(result => {
            isPrimitiveRoot = result ? "Primitive Root" : "Not Primitive Root";
        });
    }

    let discLogParams:[number|null,number|null,number|null] = [null,null,null];
    let discLogInputs:[HTMLInputElement,HTMLInputElement,HTMLInputElement] = [null,null,null];
    let discLogResult:string = "";
    function discreteLogarithm(){
        if (!BackendUtils.tryCatch(()=>BackendUtils.assertIsntNaN(...discLogParams),onError)) return;
        mod.discreteLogarithm(discLogParams[0],discLogParams[1],discLogParams[2]).then(result => {
            discLogResult = (result !== null ? result.toString() : "None");
        });
    }

    let primRootParam:number|null = null;
    let primRootResult:string = "";
    function primitiveRoot(){
        if (!BackendUtils.tryCatch(()=>BackendUtils.assertIsntNaN(primRootParam),onError)) return;
        mod.primitiveRootOf(primRootParam).then(result => {
            primRootResult = `[${result.join(", ")}]`;
        });
    }
</script>

<h3>Fast Exponentiation</h3>
<div class="center-v">
    <input type="number" class="shorter" bind:value={fastExpParams[0]} bind:this={fastExpInputs[0]}
    on:keydown={(e)=>{
        FrontendUtils.onEnter(e,modularExponentiation);
        FrontendUtils.onArrowChangeFocus(e,fastExpInputs[1],Direction.RIGHT);
        FrontendUtils.onArrowChangeFocus(e,fastExpInputs[2],Direction.LEFT);
    }}>
    <p class="bigchar"> ^ </p>
    <input type="number" class="shorter" bind:value={fastExpParams[1]} bind:this={fastExpInputs[1]}
    on:keydown={(e)=>{
        FrontendUtils.onEnter(e,modularExponentiation);
        FrontendUtils.onArrowChangeFocus(e,fastExpInputs[2],Direction.RIGHT);
        FrontendUtils.onArrowChangeFocus(e,fastExpInputs[0],Direction.LEFT);
    }}>
    <p class="bigchar"> % </p>
    <input type="number" class="shorter" bind:value={fastExpParams[2]} bind:this={fastExpInputs[2]}
    on:keydown={(e)=>{
        FrontendUtils.onEnter(e,modularExponentiation);
        FrontendUtils.onArrowChangeFocus(e,fastExpInputs[0],Direction.RIGHT);
        FrontendUtils.onArrowChangeFocus(e,fastExpInputs[1],Direction.LEFT);
    }}>
    <p class="bigchar"> = </p>
    <div class="result">{fastExpResult}</div>
</div>

<hr>
<h3>Modulo Generator</h3>
<div class="max-500-y">
    <table>
        <tr>
            <th>Root</th>
            <td>
                <input type="number" bind:value={modGenParams[0]} bind:this={modGenInputs[0]}
                on:keydown={(e)=>{
                    FrontendUtils.onEnter(e,generateModulo);
                    FrontendUtils.onArrowChangeFocus(e,modGenInputs[1],Direction.DOWN|Direction.UP);
                }}>
            </td>
        </tr>
        <tr>
            <th>Mod</th>
            <td>
                <input type="number" bind:value={modGenParams[1]} bind:this={modGenInputs[1]}
                on:keydown={(e)=>{
                    FrontendUtils.onEnter(e,generateModulo);
                    FrontendUtils.onArrowChangeFocus(e,modGenInputs[0],Direction.DOWN|Direction.UP);
                }}>
            </td>
        </tr>
        <tr>
            <th>i</th>
            <th>Root ^ i % Mod</th>
        </tr>
        {#each generatedModulo as row,i}
        <tr>
            <td>{i+1}</td>
            <td>{row}</td>
        </tr>
        {/each}
    </table>
</div>
<p>{isPrimitiveRoot}</p>

<hr>
<h3>Discrete Logarithm</h3>
<table>
    <tr>
        <th>Root</th>
        <td>
            <input type="number" bind:value={discLogParams[0]} bind:this={discLogInputs[0]}
            on:keydown={(e)=>{
                FrontendUtils.onEnter(e,discreteLogarithm);
                FrontendUtils.onArrowChangeFocus(e,discLogInputs[1],Direction.DOWN);
                FrontendUtils.onArrowChangeFocus(e,discLogInputs[2],Direction.UP);
            }}>
        </td>
    </tr>
    <tr>
        <th>Mod</th>
        <td>
            <input type="number" bind:value={discLogParams[1]} bind:this={discLogInputs[1]}
            on:keydown={(e)=>{
                FrontendUtils.onEnter(e,discreteLogarithm);
                FrontendUtils.onArrowChangeFocus(e,discLogInputs[2],Direction.DOWN);
                FrontendUtils.onArrowChangeFocus(e,discLogInputs[0],Direction.UP);
            }}>
        </td>
    </tr>
    <tr>
        <th>Value</th>
        <td>
            <input type="number" bind:value={discLogParams[2]} bind:this={discLogInputs[2]}
            on:keydown={(e)=>{
                FrontendUtils.onEnter(e,discreteLogarithm);
                FrontendUtils.onArrowChangeFocus(e,discLogInputs[0],Direction.DOWN);
                FrontendUtils.onArrowChangeFocus(e,discLogInputs[1],Direction.UP);
            }}>
        </td>
    </tr>
    <tr>
        <th>Result</th>
        <td>{discLogResult}</td>
    </tr>
</table>

<hr>
<h3>Primitive Roots</h3>
<label><span class="bigchar">Mod : </span><input type="number" bind:value={primRootParam}
    on:keydown={(e)=>{FrontendUtils.onEnter(e,primitiveRoot)}}></label>
<div class="result max-500-y">{primRootResult}</div>

<style>
    td {padding: 0px;}
    td input {margin: 0px; width: inherit;}
</style>