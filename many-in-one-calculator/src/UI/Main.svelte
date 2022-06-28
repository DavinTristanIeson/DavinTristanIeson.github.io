<script type="ts">
    import Calculator from "../Components/Calculator.svelte";
    import FractionalCalculator from "../Components/FractionalCalculator.svelte";
    import Factors from "../Components/Factors.svelte";
    import Trigonometry from "../Components/Trigonometry.svelte";
    import Permutation from "../Components/Permutation.svelte";
    import BaseConverter from "../Components/BaseConverter.svelte";
    import Backdrop from "../UI/Backdrop.svelte";
    import TruthTable from "../Components/TruthTable.svelte";
    import MatrixCalculator from "../Components/MatrixCalculator.svelte";
    import ModularArithmetic from "../Components/ModularArithmetic.svelte";
    import Sequences from "../Components/Sequences.svelte";
    import ExpressionParser from "../Components/ExpressionParser.svelte";
    import GraphRepresentation from "../Components/GraphRepresentation.svelte";
    import Djikstra from "../Components/Djikstra.svelte";
    import MinimumSpanningTree from "../Components/MinimumSpanningTree.svelte";
    import BinarySearchTree from "../Components/BinarySearchTree.svelte";
    import { componentManager,CalculationComponent,Direction } from "../Utils";
    import { fly,scale } from "svelte/transition";
    import { bounceInOut } from "svelte/easing";
    
    const ALL_COMPONENTS = {
        "calculator":Calculator,
        "fractionalCalculator":FractionalCalculator,
        "factors":Factors,
        "trigonometry":Trigonometry,
        "permutation":Permutation,
        "baseConverter":BaseConverter,
        "truthTable":TruthTable,
        "matrixCalculator":MatrixCalculator,
        "modularArithmetic":ModularArithmetic,
        "sequences":Sequences,
        "expressionParser":ExpressionParser,
        "graphRepresentation":GraphRepresentation,
        "djikstra": Djikstra,
        "binarySearchTree":BinarySearchTree,
        "minimumSpanningTree":MinimumSpanningTree,
    };
    let mountedComponents:CalculationComponent[] = [];
    let popupContents:string = "";
    let snackbarContents:string = "";
    let closeSnackbarTimeout:number;
    componentManager.selected.subscribe(data => {mountedComponents = data});

    function getComponentIfExist(source:string){
        if (!ALL_COMPONENTS[source]) console.error(`Cannot find component with the name : "${source}"!`);
        else return ALL_COMPONENTS[source];
    }
    function parseAlert(e:CustomEvent){
        if (e.detail.type === "snackbar"){
            snackbarContents = e.detail.message;
            clearTimeout(closeSnackbarTimeout);
            closeSnackbarTimeout = setTimeout(()=>{snackbarContents = ""},3000);
        } else if (e.detail.type === "popup"){
            popupContents = e.detail.message;
        }
    }
</script>
{#if snackbarContents.length > 0}
<div class="snackbar"
in:fly={{y:300,easing:bounceInOut}}
out:fly={{y:300}}>
    {snackbarContents}
</div>
{/if}

{#if popupContents.length > 0}
<Backdrop
onCloseModal={()=>{popupContents = "";}}
direction = {Direction.NONE}>
    <div class="popup" transition:scale on:click|stopPropagation>
        <h2>Alert</h2>
        {popupContents}
    </div>
</Backdrop>
{/if}

{#if mountedComponents.length > 0}
<div class="component-grid">
    {#each mountedComponents as component, index}     
    <div class="card" transition:scale={{delay:index*100}}>
        <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" class="details"
        on:click={() => {popupContents = component.description;}}>
            <circle cx="20" cy="20" r="14" stroke="black" stroke-width="2"/>
            <line x1="20" y1="19" x2="20" y2="28" stroke="black" stroke-width="4" stroke-linecap="round"/>
            <circle class="smalldot" cx="20" cy="13" r="2" fill="black"/>
        </svg>
        <h2>{component.title}</h2>
        <svelte:component this={getComponentIfExist(component.source)} on:alert={parseAlert}/>
    </div>    
    {/each}
</div>
{:else}
<div class="center-h" id="no-components">
    It seems that you have no components mounted!<br>
    Please click on the checkbox icon at the right bottom corner to select your desired components!
</div>
{/if}

<style>
    .component-grid {
        display:grid;
        grid-template-columns: 33% 33% 33%;
    }
    .details line,
    .details circle:not(.smalldot) {stroke: var(--theme-dark);}
    .details .smalldot {fill: var(--theme-dark)}
    .details:hover line,
    .details:hover circle:not(.smalldot) {stroke: var(--theme-highlight);}
    .details:hover .smalldot {fill: var(--theme-highlight)}
    .card {
        box-shadow: var(--slight-shadow);
        margin: 20px;
        padding: 20px;
        /* display: flex; */
        /* flex-direction: column; */
        /* align-items: center; */
        /* white-space: pre-wrap; */
        /* Using text-align rather than flex to deal with the horizontal
        scrolling problem */
        text-align:center;
        overflow-x: auto;
        background-color: var(--theme-light);
        z-index: 0;
    }
    .popup {
        position: absolute;
        left: 50%;
        top: 50%;
        transform: translate(-50%,-50%);
        width: 60vw;
        padding: 20px;
        font-size: 1.4em;
        background-color: var(--theme-light);
        box-shadow: var(--slight-shadow);
        max-height: 80vh;
        z-index: 25;
        overflow-y: auto;
        white-space: pre-wrap;
    }
    h2 {color: var(--theme-dark);
    padding: 0; margin:0;}
    .popup h2 {
        text-align: center;
        color:var(--theme-error);
    }
    .snackbar {
        background-color: var(--theme-snackbar);
        color: var(--theme-light);
        position:fixed;
        bottom: 0px;
        width:100%;
        text-align: center;
        padding: 10px 0px;
        font-size: 2em;
        z-index: 25;
        animation: flash-red 0.5s 0s 1;
    }
    #no-components {
        position: absolute;
        left: 50%; top: 50%;
        transform: translate(-50%,-50%);
        /* So it doesn't appear over the modals */
        z-index: -100;
        color: var(--theme-separator);
        text-align: center;
        font-size: 2em;
        font-weight: bold;
    }
    @keyframes flash-red {
        from {background-color: var(--theme-snackbar); color:var(--theme-light)}
        25% {background-color: var(--theme-error); color: black}
        50% {background-color: var(--theme-snackbar); color:var(--theme-light)}
        75% {background-color: var(--theme-error); color: black}
        to {background-color: var(--theme-snackbar); color:var(--theme-light)}
    }
    @media screen and (max-width: 1200px){
        .component-grid {
            grid-template-columns: 50% 50%;
        }
    }
    @media screen and (max-width: 900px){
        .component-grid {
            grid-template-columns: 100%;
        }
    }
    @media screen and (max-width: 450px){
        .snackbar {
            font-size: 1.2em;
        }
        #no-components {
            font-size: 1.4em;
        }
    }
</style>