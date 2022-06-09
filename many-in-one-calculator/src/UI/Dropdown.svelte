<script type="ts">
    import { createEventDispatcher } from "svelte";
    export let contents:[string,any][];
    export let visible = true;

    const dispatch = createEventDispatcher();
    let selected:[string,any] = ["None",null];
    // let selected:[string,any] = ["None",null];
    function setAsSelected(name,value){
        selected[0] = name;
        selected[1] = value;
        dispatch("selected",{
            name: selected[0],
            value: selected[1]
        });
    }
    export function reload(){
        selected = ["None",null];
    }
</script>

{#if visible}
<div class="dropdown">
    <span>{selected[0]}</span>
    {#if contents.length > 0}
    <div class="dropdown-content">
        {#each contents as content}
        <div data-value="{content[1]}"
        on:click={()=>{setAsSelected(content[0],content[1])}}
        >{content[0]}</div>
        {/each}
    </div>
    {/if}
</div>
{/if}