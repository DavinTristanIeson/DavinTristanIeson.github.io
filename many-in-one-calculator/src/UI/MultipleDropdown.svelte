<script type="ts">
    import { createEventDispatcher } from "svelte";
    const dispatch = createEventDispatcher();
    export let contents:[string,any][];
    export let visible = true;

    let yesNoStates: boolean[] = new Array(contents.length).fill(false);
    export let selected:any[] = [];
    $: selectedNames = contents.filter(x => selected.includes(x[1])).map(x => x[0]);
    function select(value,index){
        if (yesNoStates[index]) selected = selected.filter(x => x !== value);
        else {
            selected.push(value);
            selected = selected;
        }
        yesNoStates[index] = !yesNoStates[index];
        dispatch("selected",{
            value,index
        });
    }
    export function reload(){
        yesNoStates = new Array(contents.length).fill(false);
        selected = [];
    }
</script>

{#if visible}
<div class="dropdown">
    <span>{selectedNames.join(", ")}</span>
    {#if contents.length > 0}
    <div class="dropdown-content">
        {#each contents as content,idx}
        <div data-value="{content[1]}"
        on:click={()=>{select(content[1],idx)}}
        >{content[0]}</div>
        {/each}
    </div>
    {/if}
</div>
{/if}

<style>
    .dropdown span {
        display:block;
        max-width: 80px;
    }
</style>