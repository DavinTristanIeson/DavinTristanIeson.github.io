<script type="ts">
    import { createEventDispatcher } from "svelte";
    export let contents:[string,any][];
    export let visible = true;

    const dispatch = createEventDispatcher();
    let yesNoStates: boolean[] = new Array(contents.length).fill(false);
    let selected:[string,any][] = [];
    function setAsSelected(name,value,index){
        if (yesNoStates[value]) selected = selected.filter(x => x[1] !== value);
        else {
            selected.push([name,value]);
            selected = selected;
        }
        yesNoStates[index] = !yesNoStates[index];
        console.log(selected,yesNoStates);
        dispatch("selected",{
            "name": selected.map(x => x[0]),
            "value": selected.map(x => x[1]),
        });
    }
    export function reload(){
        yesNoStates = new Array(contents.length).fill(false);
        selected = [];
    }
</script>

{#if visible}
<div class="dropdown">
    <span>{selected.map(x=>x[0]).join(", ")}</span>
    {#if contents.length > 0}
    <div class="dropdown-content">
        {#each contents as content,idx}
        <div data-value="{content[1]}"
        on:click={()=>{setAsSelected(content[0],content[1],idx)}}
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