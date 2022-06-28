<script type="ts">
    import { createEventDispatcher } from "svelte";
    import { evaluate,simplify,derivative,rationalize } from "mathjs";
import { BackendUtils, Direction, FrontendUtils } from "../Utils";
    const dispatch = createEventDispatcher();
    function onError(message:string){
        dispatch("alert",{
            type: "snackbar",
            message: message
        });
    }
    let scopes:[string,number][] = [];
    let scopeInputs:HTMLInputElement[][] = [];
    let mathExpression:string = "";
    let mathResult:string = "";
    function addVariable(){
        scopes.push([`var${scopes.length}`,0]);
        scopeInputs.push([null,null]);
        scopes = scopes;
    }
    function assembleScopeToObject():{
        [key:string]:number
    }{
        const obj:{
            [key:string]:number
        } = {};
        for (let scope of scopes){
            obj[scope[0]] = scope[1];
        }
        return obj;
    }
    function evaluateExpression(){
        if (!BackendUtils.tryCatch(()=>{
            BackendUtils.assertNotEmpty(mathExpression);
            return true;
        },onError)) return;
        try {
            mathResult = evaluate(mathExpression,assembleScopeToObject()).toString();
        } catch (e){
            onError(e.toString());
        }
    }
    function wrapIndex(r:number){
        if (r < 0) r = scopeInputs.length-1;
        else if (r >= scopeInputs.length) r = 0;
        return r;
    }

    let simplifyString:string = "";
    let simplifyResult:string = "";
    function simplifyExpression(){
        if (!BackendUtils.tryCatch(()=>{
            BackendUtils.assertNotEmpty(simplifyString);
            return true;
        },onError)) return;
        try {
            simplifyResult = simplify(simplifyString).toString();
        } catch (e){
            onError(e.toString());
        }
    }

    let deriveString:string = "";
    let deriveResult:string = "";
    let derivedVariable:string = "";
    function deriveExpression(){
        if (!BackendUtils.tryCatch(()=>{
            BackendUtils.assertNotEmpty(deriveString,derivedVariable);
            return true;
        },onError)) return;
        try {
            deriveResult = derivative(deriveString,derivedVariable).toString();
        } catch (e){
            onError(e.toString());
        }
    }

    let rationalizeString:string = "";
    let rationalResult:string = "";
    function rationalizeExpression(){
        if (!BackendUtils.tryCatch(()=>{
            BackendUtils.assertNotEmpty(rationalizeString);
            return true;
        },onError)) return;
        try {
            rationalResult = rationalize(rationalizeString).toString();
        } catch (e){
            onError(e.toString());
        }
    }
</script>

<h3>Evaluate</h3>
<input type="text" class="full-width resizeable max-500-y"
bind:value={mathExpression}
on:keydown={(e)=>{
    FrontendUtils.onEnter(e,evaluateExpression);
}}>
<button class="full-width"
on:click={evaluateExpression}>Evaluate</button>
<div class="result full-width">{mathResult}</div>
<table class="full-width">
    <tr>
        <th>Name</th>
        <th>Value</th>
    </tr>
    {#each scopes as scope,r}
    <tr>
        <td><input type="text" bind:value={scope[0]} bind:this={scopeInputs[r][0]}
            on:keydown={(e)=>{
                FrontendUtils.onArrowChangeFocus(e,scopeInputs[wrapIndex(r+1)][0],Direction.DOWN);
                FrontendUtils.onArrowChangeFocus(e,scopeInputs[wrapIndex(r-1)][0],Direction.UP);
                FrontendUtils.onArrowChangeFocus(e,scopeInputs[r][1],Direction.LEFT|Direction.RIGHT);
            }}></td>
        <td><input type="number" bind:value={scope[1]} bind:this={scopeInputs[r][1]}
            on:keydown={(e)=>{
                FrontendUtils.onArrowChangeFocus(e,scopeInputs[wrapIndex(r+1)][1],Direction.DOWN);
                FrontendUtils.onArrowChangeFocus(e,scopeInputs[wrapIndex(r-1)][1],Direction.UP);
                FrontendUtils.onArrowChangeFocus(e,scopeInputs[r][0],Direction.LEFT|Direction.RIGHT);
            }}></td>
    </tr>
    {/each}
</table>
<button class="full-width"
on:click={addVariable}>Add Variable</button>

<hr>
<h3>Simplify</h3>
<input type="text" class="full-width resizeable max-500-y"
bind:value={simplifyString}
on:keydown={(e)=>{
    FrontendUtils.onEnter(e,simplifyExpression);
}}>
<button class="full-width"
on:click={simplifyExpression}>Simplify</button>
<div class="result full-width">{simplifyResult}</div>

<hr>
<h3>Derivative</h3>
<input type="text" class="full-width resizeable max-500-y"
bind:value={deriveString}
on:keydown={(e)=>{
    FrontendUtils.onEnter(e,deriveExpression);
}}>
<label class="input-w-label">
    d/d{"{}"}
    <input type="text" class="shorter" bind:value={derivedVariable}>
</label>
<button class="full-width"
on:click={deriveExpression}>Derive</button>
<div class="result full-width">{deriveResult}</div>

<hr>
<h3>Rationalize</h3>
<input type="text" class="full-width resizeable max-500-y"
bind:value={rationalizeString}
on:keydown={(e)=>{
    FrontendUtils.onEnter(e,rationalizeExpression);
}}>
<button class="full-width"
on:click={rationalizeExpression}>Rationalize</button>
<div class="result full-width">{rationalResult}</div>

<style>
    .resizeable {
        resize:vertical;
        overflow-y: auto;
    }
    .result {
        margin: 20px 0px;
    }
    td {padding: 0px;}
    td input {margin: 0px; width: 100%;}
</style>