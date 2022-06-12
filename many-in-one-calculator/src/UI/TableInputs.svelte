<script type="ts">
    import { Direction, FrontendUtils } from "../Utils";
    export let inputs:string[];
    export let action:()=>void;
    export let useResult:boolean = false;
    export let result:string = "";
    export let value:(number|null)[] = Array(inputs.length).fill(null);
    let inputNodes:HTMLInputElement[] = Array(inputs.length).fill(null);

    function wrapIndex(index:number){
        if (index < 0) index = inputs.length-1;
        else if (index >= inputs.length) index = 0;
        return index;
    }
</script>

<table class="full-width">
    {#each inputs as row,i}
    <tr>
        <th>{row}</th>
        <td>
            <input type="number" bind:value={value[i]} bind:this={inputNodes[i]}
            on:keydown={(e)=>{
                FrontendUtils.onEnter(e,action);
                FrontendUtils.onArrowChangeFocus(e,inputNodes[wrapIndex(i+1)],Direction.DOWN);
                FrontendUtils.onArrowChangeFocus(e,inputNodes[wrapIndex(i-1)],Direction.UP);
            }}>
        </td>
    </tr>
    {/each}
    {#if useResult}
    <tr>
        <th>Result</th>
        <td>{result}</td>
    </tr>
    {/if}
</table>

<style>
    td {padding: 0px;}
</style>