<script type="ts">
    import * as seq from "../Calculation/Elements/Sequences";
    import { BackendUtils, Direction, FrontendUtils } from "../Utils";
    import { createEventDispatcher } from "svelte";
    import TableInputs from "../UI/TableInputs.svelte";
    const dispatch = createEventDispatcher();
    function onError(message:string){
        dispatch("alert",{
            type:"snackbar",
            message:message
        });
    }

    let pascalTriangleParams:[number|null,number|null] = [null,null];
    let pascalTriangleResult:string = "";
    function pascalTriangle(){
        if (!BackendUtils.tryCatch(()=>{
            BackendUtils.assertIsntNaN(...pascalTriangleParams);
            BackendUtils.assertIsntNegative(...pascalTriangleParams);
            return true;
        },onError)) return;
        else if (pascalTriangleParams[0] > pascalTriangleParams[1]){
            onError("From should be less than To!"); return;
        }
        seq.pascalTriangle(pascalTriangleParams[0],pascalTriangleParams[1]).then(
            result => {
                pascalTriangleResult = result.map(
                    seq => seq.join(", ")
                ).join("\n\n");
            }
        );
    }

    let fibonacciParam:number|null = null;
    let fibonacciResult:string = "";
    function fibonacciSequence(){
        if (!BackendUtils.tryCatch(()=>{
            BackendUtils.assertIsntNaN(fibonacciParam);
            BackendUtils.assertIsntNegative(fibonacciParam);
            return true;
        },onError)) return;
        seq.fibonacci(fibonacciParam).then(result => {
            fibonacciResult = result.join(", ");
        })
    }

    let isSumMode:boolean = true;
    $: modeName = isSumMode ? "Sum" : "Nth-Term"

    let lastItemGiven:boolean = false;
    let arithmeticParams:[number|null,number|null,number|null] = [null,null,null];
    let arithmeticInputs:[HTMLInputElement,HTMLInputElement,HTMLInputElement] = [null,null,null];
    let arithmeticResult:string = "";
    function arithmeticSum(){
        if (!BackendUtils.tryCatch(()=>BackendUtils.assertIsntNaN(...arithmeticParams),onError)) return;
        if (isSumMode){
            if (!lastItemGiven) arithmeticResult = seq.arithmeticSum(arithmeticParams[0],arithmeticParams[1],arithmeticParams[2]).toString();
            else arithmeticResult = seq.arithmeticSumWithLastTerm(arithmeticParams[0],arithmeticParams[1],arithmeticParams[2]).toString();
        } else arithmeticResult = seq.arithmeticNthTerm(arithmeticParams[0],arithmeticParams[1],arithmeticParams[2]).toString();
    }

    let geometricParams:[number|null,number|null,number|null] = [null,null,null];
    let geometricInputs:[HTMLInputElement,HTMLInputElement,HTMLInputElement] = [null,null,null];
    let geometricResult:[string,string] = ["",""];
    function geometricSum(){
        if (!BackendUtils.tryCatch(()=>BackendUtils.assertIsntNaN(...geometricParams),onError)) return;
        if (isSumMode){
            const finiteResult = seq.geometricSum(geometricParams[0],geometricParams[1],geometricParams[2]).toString();
            let infiniteResult = "None";
            if (Math.abs(geometricParams[1]) < 1){
                infiniteResult = seq.infiniteGeometricSum(geometricParams[0],geometricParams[1]).toString();
            }
            geometricResult = [finiteResult,infiniteResult];
        }
        else geometricResult = [seq.geometricNthTerm(geometricParams[0],geometricParams[1],geometricParams[2]).toString(),"None"];
    }

    function resetTableContents(){
        geometricParams = [null,null,null];
        arithmeticParams = [null,null,null];
        geometricResult = ["",""];
        arithmeticResult = "";
    }
</script>

<h3>Sequence Generator</h3>
<h4>Pascal's Triangle</h4>
<TableInputs inputs={["From","To"]} bind:value={pascalTriangleParams} action={pascalTriangle}/>
<div class="result max-500-y">{pascalTriangleResult}</div>

<h4>Fibonacci</h4>
<label><span class="bigchar">Length: </span><input type="number" class="shorter" bind:value={fibonacciParam}
    on:keydown={(e)=>{
        FrontendUtils.onEnter(e,fibonacciSequence);
    }}></label>
<div class="result max-500-y">{fibonacciResult}</div>


<hr>
<label><input type="checkbox" bind:checked={isSumMode}
    on:change={resetTableContents}> {modeName}</label>
<h3>{modeName}s</h3>
<h4>Arithmetic {modeName}</h4>
{#if isSumMode}
<label><input type="checkbox" bind:checked={lastItemGiven}> Last Item Given</label>
{/if}
<table class="full-width">
    <tr>
        <th>From</th>
        <td><input type="number" bind:value={arithmeticParams[0]} bind:this={arithmeticInputs[0]}
            on:keydown={(e)=>{
                FrontendUtils.onEnter(e,arithmeticSum);
                FrontendUtils.onArrowChangeFocus(e,arithmeticInputs[1],Direction.DOWN);
                FrontendUtils.onArrowChangeFocus(e,arithmeticInputs[2],Direction.UP);
            }}></td>
    </tr>
    {#if lastItemGiven && isSumMode}
    <tr>
        <th>To</th>
        <td><input type="number" bind:value={arithmeticParams[1]} bind:this={arithmeticInputs[1]}
            on:keydown={(e)=>{
                FrontendUtils.onEnter(e,arithmeticSum);
                FrontendUtils.onArrowChangeFocus(e,arithmeticInputs[2],Direction.DOWN);
                FrontendUtils.onArrowChangeFocus(e,arithmeticInputs[0],Direction.UP);
            }}></td>
    </tr>
    {:else}
    <tr>
        <th>Step</th>
        <td><input type="number" bind:value={arithmeticParams[1]} bind:this={arithmeticInputs[1]}
            on:keydown={(e)=>{
                FrontendUtils.onEnter(e,arithmeticSum);
                FrontendUtils.onArrowChangeFocus(e,arithmeticInputs[2],Direction.DOWN);
                FrontendUtils.onArrowChangeFocus(e,arithmeticInputs[0],Direction.UP);
            }}></td>
    </tr>
    {/if}
    <tr>
        <th>{isSumMode ? "Length" : "Index"}</th>
        <td><input type="number" bind:value={arithmeticParams[2]} bind:this={arithmeticInputs[2]}
            on:keydown={(e)=>{
                FrontendUtils.onEnter(e,arithmeticSum);
                FrontendUtils.onArrowChangeFocus(e,arithmeticInputs[0],Direction.DOWN);
                FrontendUtils.onArrowChangeFocus(e,arithmeticInputs[1],Direction.UP);
            }}></td>
    </tr>
    <tr>
        <th>Result</th>
        <td>{arithmeticResult}</td>
    </tr>
</table>

<h4>Geometric {modeName}</h4>
<table class="full-width">
    <tr>
        <th>From</th>
        <td><input type="number" bind:value={geometricParams[0]} bind:this={geometricInputs[0]}
            on:keydown={(e)=>{
                FrontendUtils.onEnter(e,geometricSum);
                FrontendUtils.onArrowChangeFocus(e,geometricInputs[1],Direction.DOWN);
                FrontendUtils.onArrowChangeFocus(e,geometricInputs[2],Direction.UP);
            }}></td>
    </tr>
    <tr>
        <th>Ratio</th>
        <td><input type="number" bind:value={geometricParams[1]} bind:this={geometricInputs[1]}
            on:keydown={(e)=>{
                FrontendUtils.onEnter(e,geometricSum);
                FrontendUtils.onArrowChangeFocus(e,geometricInputs[2],Direction.DOWN);
                FrontendUtils.onArrowChangeFocus(e,geometricInputs[0],Direction.UP);
            }}></td>
    </tr>
    <tr>
        <th>{isSumMode ? "Length" : "Index"}</th>
        <td><input type="number" bind:value={geometricParams[2]} bind:this={geometricInputs[2]}
            on:keydown={(e)=>{
                FrontendUtils.onEnter(e,geometricSum);
                FrontendUtils.onArrowChangeFocus(e,geometricInputs[0],Direction.DOWN);
                FrontendUtils.onArrowChangeFocus(e,geometricInputs[1],Direction.UP);
            }}></td>
    </tr>
    {#if isSumMode}
    <tr>
        <th>Fin.</th>
        <td>{geometricResult[0]}</td>
    </tr>
    <tr>
        <th>Inf.</th>
        <td>{geometricResult[1]}</td>
    </tr>
    {:else}
    <tr>
        <th>Result</th>
        <td>{geometricResult[0]}</td>
    </tr>
    {/if}
</table>

<style>
    td {padding: 0px;}
    table {margin-bottom: 10px;}
    h4 {padding:0px; margin:5px 0px;}
</style>
