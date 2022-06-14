<script type="ts">
    import { createEventDispatcher } from "svelte";
    const dispatch = createEventDispatcher();
    export let contents:[string,any][];
    export let visible = true;
    export let selected:any = null;
    $: selectedName = contents.find(x => x[1] == selected)?.[0] ?? "None";
    function select(value:any,index:number){
        selected = value;
        dispatch("selected",{
            value,index
        });
    }
    export function reload(){
        selected = ["None",null];
    }
</script>

{#if visible}
<div class="dropdown">
    <span>{selectedName}</span>
    {#if contents.length > 0}
    <div class="dropdown-content">
        {#each contents as content,idx}
        <div data-value="{content[1]}"
        on:click={()=>{select(content[1],idx)}}>{content[0]}</div>
        {/each}
    </div>
    {/if}
</div>
{/if}

<style>
    .dropdown {
        text-align: left;
    }
</style>