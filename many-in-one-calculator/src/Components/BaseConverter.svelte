<script type="ts">
    import { createEventDispatcher } from "svelte";
    import { FrontendUtils,useMediaQuery } from "../Utils";
    import { BaseConverter } from "../Calculation/Elements/BaseConversion";
    import { onDestroy } from "svelte/internal";
    import Dropdown from "../UI/Dropdown.svelte";
    const dispatch = createEventDispatcher();
    function onError(message:string){
        dispatch("alert",{
            type:"snackbar",
            message:message,
        });
    }

    const conversionOptions:[string,any][] = [["Binary","binary"],["Octal","octal"],["Decimal","decimal"],["Hexadecimal","hexadecimal"]];
    const converter = new BaseConverter(onError);

    function swap(){
        const temp = converter.fromType;
        converter.fromType = converter.toType;
        converter.toType = temp;
        const convTemp = converter.from;
        converter.from = converter.to;
        converter.to = convTemp;
    }
    function onAltKey(e:KeyboardEvent){
        if (e.key === 'Alt'){
            e.preventDefault();
            swap();
        }
    }
    function convert(sideEffect:boolean){
        if (sideEffect && !converter.from) return;
        converter.convert();
    }
    let isSmallScreen:boolean = false;
    const unsubscriber = useMediaQuery("screen and (max-width: 450px)").subscribe(data => {isSmallScreen = data});
    onDestroy(unsubscriber);
</script>

<div class="center-h">
    <div class:center-v = {!isSmallScreen} class:center-h = {isSmallScreen} class="select-types">
        <Dropdown contents={conversionOptions} bind:selected={converter.fromType}
            on:selected={(e)=>{convert(true)}}
        />
        <label><input type="checkbox" bind:checked={converter.isTwoComplement} on:click={()=>{convert(true)}}> Two's Complement</label>
        <Dropdown contents={conversionOptions} bind:selected={converter.toType}
        on:selected={(e)=>{convert(true)}}/>
    </div>
    <div class:center-v = {!isSmallScreen} class:center-h = {isSmallScreen}>
        <input type="text" bind:value={converter.from}
        on:keydown = {(e)=>{
            FrontendUtils.onEnter(e,()=>{convert(false)});
            onAltKey(e);
        }}>
        <button on:click={()=>{swap()}}>&#8646;</button>
        <input type="text" bind:value={converter.to} disabled>
    </div>
    <button class="full-width" on:click={()=>{convert(false)}}>Convert</button>
</div>

<style>
    .select-types {
        margin-bottom: 20px;
    }
    button {padding: 10px 20px;}
    label {font-size: 0.8em;}
    .center-v input {width: 45%;}
    .center-h input {width: 100%;}
</style>