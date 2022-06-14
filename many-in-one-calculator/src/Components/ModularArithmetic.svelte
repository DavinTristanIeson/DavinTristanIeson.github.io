<script type="ts">
    import * as mod from "../Calculation/Elements/ModularArithmetic";
    import { BackendUtils, Direction, FrontendUtils, useMediaQuery } from "../Utils";
    import TableInputs from "../UI/TableInputs.svelte";
    import { createEventDispatcher, onDestroy } from "svelte";
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
        mod.moduloGenerator(modGenParams[0],modGenParams[1]).then(result => {
            generatedModulo = result;
            mod.isPrimitiveRoot(generatedModulo).then(result => {
                isPrimitiveRoot = result ? "Primitive Root" : "Not Primitive Root";
            });
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

    let isSmallScreen:boolean = false;
    const unsubscriber = useMediaQuery("screen and (max-width: 450px)").subscribe(data => {isSmallScreen = data});
    onDestroy(unsubscriber);
</script>

<h3>Fast Exponentiation</h3>
<div class:center-v = {!isSmallScreen} class:center-h = {isSmallScreen}>
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
    <TableInputs inputs={["Root","Mod"]} action={generateModulo} bind:value={modGenParams}/>
    <table class="full-width">
        <tr>
            <th>&emsp;i&emsp;</th>
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
<TableInputs inputs={["Root","Mod","Value"]} action={discreteLogarithm} bind:value={discLogParams} useResult={true} bind:result={discLogResult}/>

<hr>
<h3>Primitive Roots</h3>
<label><span class="bigchar">Mod : </span><input type="number" bind:value={primRootParam}
    on:keydown={(e)=>{FrontendUtils.onEnter(e,primitiveRoot)}}></label>
<div class="result max-500-y">{primRootResult}</div>