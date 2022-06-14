<script type="ts">
    import { TruthTable,ALL_TRUTH_OPERATIONS, TruthOperation } from "../Calculation/Elements/TruthTable";
    import { createEventDispatcher,onDestroy } from "svelte";
    import { TruthTableDisplay } from "../Calculation/Displays/TruthTableDisplay";
    import { FrontendUtils } from "../Utils/FrontEndUtils";
    import Dropdown from "../UI/Dropdown.svelte";
    import MultipleDropdown from "../UI/MultipleDropdown.svelte";
    import { useMediaQuery } from "../Utils";
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
    function changeOperandVisibility(e:CustomEvent<{value:TruthOperation,index:number}>){
        const comparer = e.detail.value;
        if (comparer === TruthOperation.TRUE || comparer === TruthOperation.FALSE) visibleOperands = [false,false];
        else if (comparer === TruthOperation.NOT) visibleOperands = [true,false];
        else visibleOperands = [true,true];
        truthTable.operation = e.detail.value;
    }
    function resetAll(){
        for (let child of childrenComponent) child?.reload?.();
    }
    let isSmallScreen:boolean = false;
    const unsubscriber = useMediaQuery("screen and (max-width: 450px)").subscribe(data => {isSmallScreen = data});
    onDestroy(unsubscriber);
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
        <div class:center-v = {!isSmallScreen} class:center-h = {isSmallScreen}>
            <Dropdown bind:this={childrenComponent[0]} contents={Object.entries(table.addressBook)} bind:visible={visibleOperands[0]}
            bind:selected={truthTable.operand1}/>
            <Dropdown bind:this={childrenComponent[1]} contents={ALL_TRUTH_OPERATIONS} on:selected={(e)=>changeOperandVisibility(e)}
                bind:selected={truthTable.operation}/>
            <Dropdown bind:this={childrenComponent[2]} contents={Object.entries(table.addressBook)} bind:visible={visibleOperands[1]}
            bind:selected={truthTable.operand2}/>
        </div>
        <button class="full-width"
        on:click={()=>{truthTable.addColumn();}}>Add Column</button>
    </div>
    <div class="center-h">
        <div class="full-width" id="filter">
            <div class="center-v">
                WHERE<MultipleDropdown bind:this={childrenComponent[4]} contents={Object.entries(table.addressBook)}
                bind:selected={truthTable.whereIsTrue}/>is TRUE
            </div> AND <div class="center-v">
                WHERE<MultipleDropdown bind:this={childrenComponent[5]} contents={Object.entries(table.addressBook)}
                bind:selected={truthTable.whereIsFalse}/>is FALSE
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
    #filter div {margin: 0px 10px;}
    @media screen and (max-width: 450px){
        #filter {
            flex-direction: column;
        }
    }
</style>