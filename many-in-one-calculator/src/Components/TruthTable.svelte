<script type="ts">
    import { TruthTable,ALL_TRUTH_OPERATIONS } from "../Calculation/Elements/TruthTable";
    import { createEventDispatcher } from "svelte";
    import { TruthTableDisplay } from "../Calculation/Displays/TruthTableDisplay";
    import { FrontendUtils } from "../Utils/FrontEndUtils";
    import Dropdown from "../UI/Dropdown.svelte";
    import MultipleDropdown from "../UI/MultipleDropdown.svelte";
    const dispatch = createEventDispatcher();


    let table:TruthTable = new TruthTable([]);
    let truthTable = new TruthTableDisplay(table,onUpdate,onError);
    let filteredColumns = table.filteredColumns;
    let visibleOperands:[boolean,boolean] = [true,true];
    let childrenComponent = [null,null,null,null,null];
    function onUpdate(updated){
        table = updated;
        filteredColumns = table.filteredColumns;
    }
    function onError(message:string){
        dispatch("alert",{
            type:"snackbar",
            message:message,
        });
    }
    function changeOperandVisibility(e:CustomEvent<{name:string,value:number}>){
        const comparer = e.detail.name;
        if (comparer === "TRUE" || comparer === "FALSE"){
            visibleOperands = [false,false];
        } else if (comparer === "NOT"){
            visibleOperands = [true,false];
        }
        truthTable.operation = e.detail.value;
    }
    function resetAll(){
        for (let child of childrenComponent) child?.reload?.();
    }
</script>

<div>
    <div class="input-w-btn">
        <input type="text"
        placeholder={`Variables separated by spaces`}
        on:keydown={(e)=>{FrontendUtils.onEnter(e,()=>{truthTable.registerVariables(); resetAll()})}}
        bind:this={truthTable.variableInput}>
        <button on:click={()=>{truthTable.registerVariables()}}>Register Variables</button>
    </div>
    <div class="center-h full-width">
        <div class="center-v">
            <Dropdown bind:this={childrenComponent[0]} contents={Object.entries(table.addressBook)} visible={visibleOperands[0]}
            on:selected={(e)=>{truthTable.operand1 = e.detail.value ?? -1;}}/>
            <Dropdown bind:this={childrenComponent[1]} contents={ALL_TRUTH_OPERATIONS} on:selected={(e)=>changeOperandVisibility(e)}/>
            <Dropdown bind:this={childrenComponent[2]} contents={Object.entries(table.addressBook)} visible={visibleOperands[1]}
            on:selected={(e)=>{truthTable.operand2 = e.detail.value ?? -1;}}/>
        </div>
        <button class="full-width"
        on:click={()=>{truthTable.addColumn();}}>Add Column</button>
    </div>
    <div class="center-h">
        <div class="full-width" id="filter">
            <div class="center-v">
                WHERE<MultipleDropdown bind:this={childrenComponent[4]} contents={Object.entries(table.addressBook)}
                on:selected={(e)=>{truthTable.whereIsTrue = e.detail.value}}/>is TRUE
            </div> AND <div class="center-v">
                WHERE<MultipleDropdown bind:this={childrenComponent[5]} contents={Object.entries(table.addressBook)}
                on:selected={(e)=>{truthTable.whereIsFalse = e.detail.value}}/>is FALSE
            </div>
        </div>
        <button class="full-width" on:click={()=>truthTable.setFilter()}>Filter</button>
    </div>
    <div class="center-h">
        <div class="max-500-y max-300-x">
            {#if filteredColumns.length > 0}
                <table id="truth-table" class="full-width"
                bind:this={truthTable.tableElement}>
                    <tr>
                        {#each filteredColumns as column}
                            <th>{column.name}</th>
                        {/each}
                    </tr>
                    {#each Array(filteredColumns[0].length) as _, id}
                        <tr>
                            {#each filteredColumns as column}
                                <td class:falsey={!column.get(id)}>{column.getChar(id)}</td>
                            {/each}
                        </tr>
                    {/each}
                </table>
            {/if}
        </div>
    </div>
</div>

<style>
    #truth-table td {
        padding: 10px;
        background-color:var(--theme-main);
    }
    #truth-table td.falsey {background-color:var(--theme-error);}
    .max-300-x {
        max-width: 300px;
        overflow-x: auto;
    }
    #filter {
        display: flex;
        flex-direction: row;
        align-items: center;
    }
    @media screen and (max-width: 450px){
        #filter {
            flex-direction: column;
        }
    }
</style>