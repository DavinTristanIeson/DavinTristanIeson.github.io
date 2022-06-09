<script type="ts">
    import { MatrixCalculatorDisplay,MatrixCalculatorUpdatePayload,MatrixCalculator } from "../Calculation/Displays/MatrixCalculatorDisplay";
    import { createEventDispatcher } from "svelte";
    
    const dispatch = createEventDispatcher();
    let calculatorInput:(number|null)[][], pastCalculated:string[][];
    let lastOperation:string = "";
    let determinant:string = "";
    const calculator = new MatrixCalculatorDisplay(new MatrixCalculator(),onUpdate,onError);
    let inputs:HTMLInputElement[][] = [];
    for (let r = 0; r < MatrixCalculatorDisplay.MAX_MATRIX_SIZE[0]; r++){
        inputs.push([]);
        for (let c = 0; c < MatrixCalculatorDisplay.MAX_MATRIX_SIZE[1]; c++){
            inputs[r].push(null);
        }
    }
    function onUpdate(updated:MatrixCalculatorUpdatePayload){
        calculatorInput = updated.calculatorInput;
        pastCalculated = updated.pastCalculated;
        lastOperation = updated.lastOperation;
        determinant = updated.determinant;
    }
    function onError(message:string){
        dispatch("alert",{
            type:"snackbar",
            message:message
        });
    }
    function wrapAroundIndex(r:number,c:number):[number,number]{
        if (r === MatrixCalculatorDisplay.MAX_MATRIX_SIZE[0]) r = 0;
        else if (r < 0) r = MatrixCalculatorDisplay.MAX_MATRIX_SIZE[0]-1;
        if (c === MatrixCalculatorDisplay.MAX_MATRIX_SIZE[1]) c = 0;
        else if (c < 0) c = MatrixCalculatorDisplay.MAX_MATRIX_SIZE[1]-1;
        return [r,c];
    }
    function updateCalculatorData(){
        calculator.update({calculatorInput,pastCalculated,lastOperation,determinant});
    }
</script>

<div class="layout">
    <table class="matrix faded">
        {#each pastCalculated as row}
            <tr>
                {#each row as col}
                    <td><div>{col}</div></td>
                {/each}
            </tr>
            {/each}
    </table>
    <p id="operation">{lastOperation}</p>
    <div>
        <table class="matrix">
            {#each calculatorInput as _,r}
                <tr>
                    {#each calculatorInput[r] as col,c}
                        <td>
                            <input type="number" bind:value={col}
                            bind:this={inputs[r][c]} data-index="{r},{c}" class="mat-input"
                            on:keydown={
                                (e)=>{
                                    switch (e.key){
                                        case "ArrowUp":
                                            [r,c] = wrapAroundIndex(r-1,c);
                                            e.preventDefault();
                                            break;
                                        case "ArrowDown":
                                            [r,c] = wrapAroundIndex(r+1,c);
                                            e.preventDefault();
                                            break;
                                        case "ArrowLeft":
                                            [r,c] = wrapAroundIndex(r,c-1);
                                            e.preventDefault();
                                            break;
                                        case "ArrowRight":
                                            [r,c] = wrapAroundIndex(r,c+1);
                                            e.preventDefault();
                                            break;
                                    }
                                    inputs[r][c].focus();
                                    calculator.keyboardListener(e);
                                }
                            }>
                        </td>
                    {/each}
                </tr>
            {/each}
        </table>
    </div>
    <div id="buttons">
        <button class="calc-btn" on:click={()=>{updateCalculatorData();calculator.calculate("add");}}>+</button>
        <button class="calc-btn" on:click={()=>{updateCalculatorData();calculator.calculate("sub");}}>-</button>
        <button class="calc-btn" on:click={()=>{updateCalculatorData();calculator.calculate("mult");}}>x</button>
        <button class="calc-btn" on:click={()=>{updateCalculatorData();calculator.calculate("inv");}}>x^-1</button>
        <button class="calc-btn" on:click={()=>{updateCalculatorData();calculator.calculate("exp2");}}>x&#178;</button>
        <button class="calc-btn" on:click={()=>{updateCalculatorData();calculator.calculate("tp");}}>tp</button>
        <button class="calc-btn" on:click={()=>{updateCalculatorData();calculator.rollback();}}>&#11119;</button>
        <button class="calc-btn" on:click={()=>{updateCalculatorData();calculator.calculate("");}}>=</button>
        <button class="calc-btn" on:click={()=>{calculator.clear(true)}}>AC</button>
        <button class="calc-btn" on:click={()=>{calculator.clear(false)}}>CE</button>
    </div>
    <p><strong>Determinant :</strong> {determinant}</p>
</div>

<style>
    .mat-input {
        width: inherit;
        height: inherit;
        font-size: 1em;
        border: none;
        margin: 0px;
        padding: 0px 5px;
        text-overflow: ellipsis;
    }
    .matrix td {
        width: 70px;
        height: 50px;
        max-width: 70px;
        max-height: 50px;
        overflow-x: auto;
        font-size: 1em;
        text-align: center;
        padding: 5px;
    }
    #operation {
        font-weight: bold;
        font-size: 2em;
    }
    #buttons {
        display:grid;
        grid-template-columns: 1fr 1fr 1fr 1fr 1fr;
    }
    .faded td {
        border: 1px solid var(--theme-disabled);
        color: var(--theme-disabled);
    }
</style>

