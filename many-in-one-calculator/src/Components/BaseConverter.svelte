<script type="ts">
    import { createEventDispatcher } from "svelte";
    import { onArrowChangeFocus, onEnter, useMediaQuery } from "../Utils";
    import { Converter } from "../Calculation/BaseConversion";
import { onDestroy, update_await_block_branch } from "svelte/internal";
    const dispatch = createEventDispatcher();
    function onError(message:string){
        dispatch("alert",{
            type:"snackbar",
            message:message,
        });
    }
    const converter = new Converter(onUpdate,onError);
    let inputs:[HTMLInputElement,HTMLInputElement] = [null, null];
    let selects:[HTMLSelectElement,HTMLSelectElement] = [null, null];
    let isTwoComplement:boolean = converter.isTwoComplement;
    function onUpdate(updated:{[key:string]:string}){
        inputs[0].value = updated.from;
        inputs[1].value = updated.to;
        selects[0].selectedIndex = parseInt(updated.fromIndex);
        selects[1].selectedIndex = parseInt(updated.toIndex);
    }
    function onAltKey(e:KeyboardEvent){
        if (e.key === 'Alt'){
            e.preventDefault();
            bringUpToDate();
            converter.swap();
        }
    }
    function bringUpToDate(){
        converter.update({
            fromType: selects[0].selectedIndex,
            toType: selects[1].selectedIndex,
            from: inputs[0].value,
            to: inputs[1].value,
            isTwoComplement: isTwoComplement
        });
    }
    function convert(sideEffect:boolean){
        if (sideEffect && !inputs[0].value) return;
        bringUpToDate();
        converter.convert();
    }
    let isSmallScreen:boolean = false;
    const unsubscriber = useMediaQuery("screen and (max-width: 420px)").subscribe(data => {isSmallScreen = data});
    onDestroy(unsubscriber);
</script>

<div class="center-h">
    <div class:center-v = {!isSmallScreen} class:center-h = {isSmallScreen} id="select-types">
        <select bind:this={selects[0]} on:change={()=>{convert(true)}}>
            <option value="binary">Binary</option>
            <option value="octal">Octal</option>
            <option value="decimal" selected>Decimal</option>
            <option value="hexadecimal">Hexadecimal</option>
        </select>
        <label><input type="checkbox" bind:checked={isTwoComplement} on:click={()=>{convert(true)}}> Two's Complement</label>
        <select bind:this={selects[1]} on:change={()=>{convert(true)}}>
            <option value="binary">Binary</option>
            <option value="octal">Octal</option>
            <option value="decimal" selected>Decimal</option>
            <option value="hexadecimal">Hexadecimal</option>
        </select>
    </div>
    <div class:center-v = {!isSmallScreen} class:center-h = {isSmallScreen}>
        <input type="text" bind:this={inputs[0]}
        on:keydown = {(e)=>{
            onEnter(e,()=>{convert(false)});
            onAltKey(e);
        }}>
        <button on:click={()=>{bringUpToDate(); converter.swap()}}>&#8646;</button>
        <input type="text" bind:this={inputs[1]} disabled>
    </div>
    <button class="full-width" on:click={()=>{convert(false)}}>Convert</button>
</div>

<style>
    #select-types {
        margin-bottom: 20px;
    }
    .center-v select {margin: 0px 30px;}
    button {padding: 10px 20px;}
    label {font-size: 0.8em;}
    .center-v input {width: 45%;}
    .center-h input {width: 100%;}
    input:disabled {
        background-color: var(--theme-input);
        color: var(--theme-dark);
    }
</style>