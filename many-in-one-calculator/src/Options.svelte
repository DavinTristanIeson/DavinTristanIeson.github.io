<script lang="ts">
    import { fly,crossfade } from 'svelte/transition';
    import { flip } from 'svelte/animate';
    import { componentManager, CalculationComponent, CalculationComponentManager} from "./Utils";
import { onDestroy } from 'svelte';
    const [send,receive] = crossfade({});

    let checkedCheckboxes:CalculationComponent[] = [];
    let uncheckedCheckboxes:CalculationComponent[] = [];
    const unsubscribeSelected = componentManager.selected.subscribe(data => {checkedCheckboxes = data;});
    const unsubscribeUnselected = componentManager.unselected.subscribe(data => {uncheckedCheckboxes = data;});
    function pingPongCheckbox(value:CalculationComponent,selected:boolean){
        if (selected){
            const result = checkedCheckboxes.findIndex(item => item.id === value.id);
            if (result >= 0) uncheckedCheckboxes.push(checkedCheckboxes[result]);
            checkedCheckboxes.splice(result,1);
        } else {
            const result = uncheckedCheckboxes.findIndex(item => item.id === value.id);
            if (result >= 0) checkedCheckboxes.push(uncheckedCheckboxes[result]);
            uncheckedCheckboxes.splice(result,1);
        }
        checkedCheckboxes = checkedCheckboxes;
        uncheckedCheckboxes = uncheckedCheckboxes;
    }
    function saveOptions(){
        componentManager.selected.set(checkedCheckboxes);
        componentManager.unselected.set(uncheckedCheckboxes);
        componentManager.saveComponents();
    }
    function resetOptions(){
        componentManager.resetComponents();
    }

    onDestroy(()=>{
        unsubscribeSelected();
        unsubscribeUnselected();
    });
</script>


<div transition:fly={{x:500}} class="modal right"
on:click|stopPropagation>
    <div class="split-in-two">
        <div>
            <h2>Available</h2>
            <!-- I would really like to use a component for this, but Svelte screams about animate not being able to be used in
            non-#each-block-children elements -->
            <ul>
                {#each uncheckedCheckboxes as unchecked (unchecked.id)}
                <li class = "checkbox"
                    in:receive = {{key:unchecked.id}} out:send = {{key:unchecked.id}}
                    animate:flip={{duration:50}}
                    on:click={()=>{pingPongCheckbox(unchecked,false)}}>
                    {unchecked.title}
                </li>
                {/each}
            </ul>
        </div>
        <div>
            <h2>Selected</h2>
            <ul>
                {#each checkedCheckboxes as checked (checked.id)}
                <li class = "checkbox"
                    in:receive = {{key:checked.id}} out:send = {{key:checked.id}}
                    animate:flip={{duration:50}}
                    on:click={()=>{pingPongCheckbox(checked,true)}}
                    >
                    {checked.title}
                </li>
                {/each}
            </ul>
        </div>
    </div>
    <div class="split-in-two bottom">
        <button on:click={saveOptions}>
            Save Options
        </button>
        <button on:click={resetOptions}>
            Reset Options
        </button>
    </div>
</div>


<style>
    .modal {
        position:fixed;
		width:40vw;
        height:inherit;
        padding:30px;
        background-color: var(--theme-main);
	}
    h2 {text-align: center;}
    @media screen and (max-width: 720px){
        .modal {
            width: 70vw;
        }
    }
    .split-in-two {
        column-gap: 10px;
    }
    ul {padding:0;margin:0;list-style-type: none;}
    .checkbox {
        background-color: var(--theme-light);
        padding: 8px;
        margin: 10px 0px;
        border-radius: 6px;
    }
    button {
        margin: 10px;
        background-color: var(--theme-light);
        border: none;
        box-shadow: 0 4px 8px rgba(0,0,0,0.2);
    }
    button:hover {
        background-color: var(--theme-highlight);
    }
    .bottom {
        position:absolute;
        bottom:10%;
        width:inherit;
    }
</style>