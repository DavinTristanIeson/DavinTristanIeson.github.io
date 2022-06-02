<script type="ts">
    import { TruthTable,ALL_TRUTH_OPERATIONS,TruthColumn } from "../Calculation/Elements/TruthTable";
    import { createEventDispatcher, onMount } from "svelte";
    import { TruthTableDisplay } from "../Calculation/Displays/TruthTableDisplay";
    import { FrontendUtils } from "../Utils/FrontEndUtils";
    const dispatch = createEventDispatcher();


    let table:TruthTable = new TruthTable(["a","b","c","d","e","f"]);
    let truthTable = new TruthTableDisplay(table,onUpdate,onError);
    function onUpdate(updated){
        table = updated;
    }
    function onError(message:string){
        console.error(message);
        dispatch("alert",{
            type:"snackbar",
            message:message,
        });
    }
    
</script>

<div>
    <div class="input-w-btn">
        <input type="text"
        placeholder={`Variables separated by spaces`}
        on:keydown={(e)=>{FrontendUtils.onEnter(e,()=>{truthTable.registerVariables()})}}
        bind:this={truthTable.variableInput}>
        <button on:click={()=>{truthTable.registerVariables()}}>Register Variables</button>
    </div>
    <div class="center-h full-width">
        <div class="center-v">
            <select>
                {#each Object.entries(table.addressBook) as location}
                    <option value={location[1]}>{location[0]}</option>
                {/each}
            </select>
            <select>
                {#each ALL_TRUTH_OPERATIONS as operation}
                    <option value={operation.value}>{operation.name}</option>
                {/each}
            </select>
            <select>
                {#each Object.entries(table.addressBook) as location}
                    <option value={location[1]}>{location[0]}</option>
                {/each}
            </select>
        </div>
        <button class="full-width"
        on:click={()=>{truthTable.addColumn();}}>Add Column</button>
    </div>

    <div class="max-500-y">
        <table id="truth-table" class="full-width"
        bind:this={truthTable.tableElement}>
            <tr>
                {#each table.columns as column}
                    <th>{column.name}</th>
                {/each}
            </tr>
            {#each Array(table.rowsCount) as _, id}
                <tr>
                    {#each table.columns as column}
                        <td class:falsey={!column.get(id)}>{column.getChar(id)}</td>
                    {/each}
                </tr>
            {/each}
        </table>
    </div>
</div>

<style>
    #truth-table td {
        padding: 5px;
        background-color:var(--theme-main);
    }
    #truth-table td.falsey {background-color:var(--theme-error);}
</style>