<script type="ts">
    import { TrigonometryDisplay } from "../Calculation/TrigonometryDisplay";
    import { createEventDispatcher, onDestroy } from "svelte";
    import { useMediaQuery } from "../Utils";
    const dispatch = createEventDispatcher();
    const display = new TrigonometryDisplay(onUpdate,onError);
    let trigInput:string = "";
    let sincostan:[string,string,string,string,string,string] = ["-","-","-","-","-","-"];
    let tableHeaders:[string,string,string,string,string,string] = ["sin","cos","tan","cosec","sec","cot"];
    let inversed:boolean = false;
    let unit:string = "deg";
    function onUpdate(updated:{[key:string]:string}){
        sincostan = [updated.sin,updated.cos,updated.tan,updated.cosec,updated.sec,updated.cot];
        inversed = !!updated.inverse.length;
        tableHeaders = (inversed ? ["asin","acos","atan","acosec","asec","acot"] : ["sin","cos","tan","cosec","sec","cot"]);
        unit = updated.inputMethod;
    }
    function onError(message:string){
        dispatch("alert",{
            type:"snackbar",
            message:message
        });
    }
    function calculate(isSideEffect:boolean){
        if (isSideEffect && trigInput.length === 0) return;
        display.calculateTrigonometry(trigInput);
    }
    function operationOnInput(callback:(number)=>number){
        const value = parseFloat(trigInput);
        if (isNaN(value)){
            onError("Input must be a valid number")
            return;
        }
        trigInput = callback(value).toString();
    }
    function onEnter(e:KeyboardEvent,callback:()=>void){
        if (e.key !== "Enter") return;
        callback();
    }
    let isSmallScreen:boolean = false;
    const unsubscriber = useMediaQuery("screen and (max-width: 420px)").subscribe(data => {isSmallScreen = data});
    onDestroy(unsubscriber);
</script>

<article class="center-h">
    <div class="input-w-btn">
        <label class="center-v">
        <input type="number" bind:value={trigInput} placeholder="0"
        on:keydown={(e)=>{onEnter(e,()=>{calculate(false)})}}>{#if !inversed}{unit}{/if}
        </label>
        <button on:click={()=>{calculate(false)}}>Calculate</button>
    </div>
    <div class="center-v">
        <button on:click={()=>{
            if (!inversed){
                trigInput = trigInput || "0";
                operationOnInput((num)=>display.changeInputMethod(num))}
            }
        }>{unit}</button>
        <button class:disabled = {inversed} on:click={()=>{
            if (inversed) return;
            operationOnInput((num)=>display.divideBy360deg(num));
            calculate(true);
        }}>% 360&deg;</button>
        <button class:disabled = {inversed} on:click={()=>{
            if (inversed) return;
            operationOnInput((num)=>display.complementOf360deg(num))
            calculate(true);
        }}>360&deg -</button>
        <button class:active = {inversed}
        on:click={()=>{
            display.inverseOperation();
            calculate(true);
        }}>inv</button>
    </div>
    <table class="full-width">
        {#if !isSmallScreen}
        <tr>
            <th>{tableHeaders[0]}</th>
            <th>{tableHeaders[1]}</th>
            <th>{tableHeaders[2]}</th>
        </tr>
        <tr>
            <td>{sincostan[0]} {#if inversed && sincostan[0] !== "-"}{unit}{/if}</td>
            <td>{sincostan[1]} {#if inversed && sincostan[1] !== "-"}{unit}{/if}</td>
            <td>{sincostan[2]} {#if inversed && sincostan[2] !== "-"}{unit}{/if}</td>
        </tr>
        <tr>
            <th>{tableHeaders[3]}</th>
            <th>{tableHeaders[4]}</th>
            <th>{tableHeaders[5]}</th>
        </tr>
        <tr>
            <td>{sincostan[3]} {#if inversed && sincostan[3] !== "-"}{unit}{/if}</td>
            <td>{sincostan[4]} {#if inversed && sincostan[4] !== "-"}{unit}{/if}</td>
            <td>{sincostan[5]} {#if inversed && sincostan[5] !== "-"}{unit}{/if}</td>
        </tr>
        {:else}
        <tr>
            <th>{tableHeaders[0]}</th>
            <th>{tableHeaders[3]}</th>
        </tr>
        <tr>
            <td>{sincostan[0]} {#if inversed && sincostan[0] !== "-"}{unit}{/if}</td>
            <td>{sincostan[3]} {#if inversed && sincostan[3] !== "-"}{unit}{/if}</td>
        </tr>
        <tr>
            <th>{tableHeaders[1]}</th>
            <th>{tableHeaders[4]}</th>
        </tr>
        <tr>
            <td>{sincostan[1]} {#if inversed && sincostan[1] !== "-"}{unit}{/if}</td>
            <td>{sincostan[4]} {#if inversed && sincostan[4] !== "-"}{unit}{/if}</td>
        </tr>
        <tr>
            <th>{tableHeaders[2]}</th>
            <th>{tableHeaders[5]}</th>
        </tr>
        <tr>
            <td>{sincostan[2]} {#if inversed && sincostan[2] !== "-"}{unit}{/if}</td>
            <td>{sincostan[5]} {#if inversed && sincostan[5] !== "-"}{unit}{/if}</td>
        </tr>
        {/if}
    </table>
</article>

<style>
    table {margin-top: 20px;}
    table td {padding: 10px 20px;}
    label {margin-right: 40px;}
    input {width: 100%;}
    @media screen and (max-width: 420px){
        label {margin-right: 10px;}
    }
    .disabled {background-color: var(--theme-disabled);}
    .active {background-color: var(--theme-highlight);}
</style>