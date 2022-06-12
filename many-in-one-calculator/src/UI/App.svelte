<script lang="ts">
	import Header from "./Header.svelte";
	import Notes from "./Notes.svelte";
	import Options from "./Options.svelte";
	import Main from "./Main.svelte";
	import Backdrop from "./Backdrop.svelte";
	import { Direction } from "../Utils";

	type tabType = "Notes"|"Options"|null;
	let currentTab:tabType = null;

	function switchTabs(tab:tabType){
		if (currentTab === tab){
			currentTab = null;
		} else {
			currentTab = tab;
		}
	}
</script>

<Header/>
<button class="opentab-button left" on:click={()=>{switchTabs("Notes")}}>
	<img src="./Resources/pen-icon.svg" alt="">
</button>
<button class="opentab-button right" on:click={()=>{switchTabs("Options")}}>
	<img src="./Resources/square-icon.svg" alt="">
</button>
	
{#if currentTab == "Notes"}
<Backdrop
onCloseModal = {()=>{switchTabs("Notes");}}
direction = { Direction.LEFT }>
	<Notes/>
</Backdrop>
{:else if currentTab == "Options"}
<Backdrop
onCloseModal = {()=>{switchTabs("Options");}}
direction = { Direction.RIGHT }>
	<Options/>
</Backdrop>
{/if}

<main>
	<Main/>
</main>

<style>
	:global(:root){
		--theme-highlight: #a9e4a8;
		--theme-main: #57AF55;
		--theme-dim: #2a7429;
		--theme-dark: #0a3508;
		--theme-light: #ffffff;
		--theme-input: #ffffff;
		--theme-separator: #aaa;
		--slight-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2);
		--theme-disabled: #aaaaaa;
		--theme-error: rgb(221, 42, 42);
		--theme-snackbar: #444;
	}
	@media (prefers-color-scheme:dark){
		:global(:root){
			--theme-highlight: #4da84c;
			--theme-main: #076d46;
			--theme-dim: #074229;
			--theme-dark: #bbb;
			--theme-light: #3d423d;
			--theme-input: #bbb;
			--theme-separator: #888;
			--slight-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.4);
			--theme-disabled: #444a44;
			--theme-error: rgb(221, 42, 42);
			--theme-snackbar: rgb(145, 158, 147);
		}
		:global(hr){background-color: var(--theme-dark);}
	}
	:global(body){
		padding:0;
		color: var(--theme-dark);
		background-color: var(--theme-light);
	}
	:global(table){
		border-collapse: collapse;
		margin: 10px 0px;
	}
	:global(table td, table th){
		border: 2px solid black;
		text-align: center;
	}
	:global(table td){color: var(--theme-dark);}
	:global(table th){background-color: var(--theme-main); color:black;}
	:global(hr) {
		background-color: var(--theme-separator);
		border:none; outline:none;
		width: 100%;
        height: 2px;
	}
	:global(td input) {
		margin: 0px;
		width: 100%;
		border-radius: 0px !important;
		box-shadow: none !important;
	}
	:global(input:not([type=submit],[type=button],[type=radio],[type=checkbox])){
        padding: 10px;
        font-size: 1.2em;
		/* https://stackoverflow.com/questions/42421361/input-button-elements-not-shrinking-in-a-flex-container */
		min-width: 0px;
		border: none;
		border-radius: 5px;
		background-color: var(--theme-input);
		color: black;
		box-shadow: var(--slight-shadow);
	}
	:global(input:disabled){background-color: var(--theme-disabled); color: var(--theme-dark)}
	:global(input[type="checkbox"]){
		width: 16px;
		height: 16px;
	}
	:global(input[type="checkbox"]:checked){
		background-color: var(--theme-main);
	}
	:global(.left){left:0px;}
	:global(.right){right:0px;}
	:global(.backdrop) {
		position:fixed;
		top:0px;
		width:100vw;
		height:100vh;
		z-index: 50;
		background-color: rgba(0,0,0,0.2);
	}
	:global(.center-h){
		display:flex;
        flex-direction: column;
        align-items: center;
	}
	:global(.center-v){
		display:flex;
		flex-direction: row;
		align-items: center;
	}
	:global(.calc-btn){
        width: 70px;
		height: 70px;
        background-color: var(--theme-light);
		color: var(--theme-dark);
	}
	:global(.calc-btn:hover) {background-color: var(--theme-highlight);}
	:global(.input-w-btn) {
        display: grid;
        grid-template-columns: 70% 30%;
	}
	:global(.split-in-two){
		display:grid;
		grid-template-columns: 50% 50%;
	}
	:global(.input-w-btn input) {margin: 5px 10px; min-width: 0px;}
    :global(.input-w-btn button) {margin: 5px 10px; background-color: var(--theme-main);}
	:global(.full-width){width: 100%;}
	:global(button){
        background-color: var(--theme-main);
        border-radius: 5px;
		border: none;
		color: black;
		box-shadow: var(--slight-shadow);
		margin: 5px;
	}
	:global(button:hover){background-color: var(--theme-highlight);}
	:global(.calculator-grid){
		display: grid;
        column-gap: 10px;
        row-gap: 10px;
	}
	:global(.disabled) {background-color: var(--theme-disabled);}
	:global(.disabled:hover){background-color: var(--theme-disabled);}
    :global(.active) {background-color: var(--theme-highlight);}
	:global(.calculator-grid .calc-btn){margin: 0px;}
	:global(.max-500-y){
        overflow-y: auto;
        max-height: 500px;
	}
	/* CREDITS: https://www.w3schools.com/Css/css_dropdowns.asp */
	:global(.dropdown) {
        position:relative;
        display:inline-block;
        min-width: 80px;
        margin: 10px;
		border: 0.5px solid var(--theme-dark);
		border-radius: 5px;
		padding: 5px 10px;
    }
	:global(.dropdown:after){
		content:'▼';
		float:right;
	}
    :global(.dropdown-content) {
        display:none;
		min-width: inherit;
        position: absolute;
        background-color: var(--theme-light);
        box-shadow: var(--slight-shadow);
		border: 0.5px solid var(--theme-dark);
		border-radius: 5px;
        z-index: 2;
    }
    :global(.dropdown-content div) {
        cursor:pointer;
        padding: 5px 10px;
    }
    :global(.dropdown-content div:hover) {
        background-color: var(--theme-highlight);
    }
	:global(.dropdown:hover:after){content: '◀'}
    :global(.dropdown:hover .dropdown-content) {
        display:block;
    }
	:global(input::-webkit-outer-spin-button,
    input::-webkit-inner-spin-button){
        -webkit-appearance: none;
        margin: 0;
    }
    /* Firefox */
    :global(input[type=number]) {
        -moz-appearance: textfield;
	}
	:global(.shorter) {max-width: 80px; font-size: 1.2em;}
	:global(.bigchar) {font-size: 1.4em;}
	:global(p.bigchar) {margin: 0px 15px;}
	:global(.result){
        border: 2px solid black;
        padding: 10px;
        font-size: 1.2em;
	}
	/* lazy fix for .result overflowing */
	:global(.full-width.result){width: 95%}
    @media screen and (max-width: 540px){
        :global(.shorter) {
            max-width: 60px;
            max-height: 40px;
            font-size: 1em;
        }
    }
    @media screen and (max-width: 360px){
        :global(.shorter) {
            max-width: 45px;
            max-height: 30px;
            font-size: 0.8em;
        }
    }
	@media screen and (max-width: 450px){
		:global(.input-w-btn input) {margin: 3px;}
    	:global(.input-w-btn button) {margin: 3px; font-size: 0.6em;}
		:global(.calc-btn){ width: 55px; height: 55px;}
        :global(.calculator-grid) {
            column-gap: 5px;
            row-gap: 5px;
        }
	}
	.opentab-button {
		background-color: var(--theme-main);
		position: fixed;
		bottom:10%;
		width:7vw;
		min-width: 70px;
		height:5vw;
		min-height: 50px;
		margin:0; padding: 0;
		text-align: center;
		transition: background-color 0.3s ease-out 0s, width 0.3s ease-out 0s;
		outline: none;
		z-index: 5;
		box-shadow: 10px 10px 5px #888888;
	}
	.opentab-button.left {clip-path: polygon(75% 0, 100% 50%, 75% 100%, 0 100%, 0 0);}
	.opentab-button.right {clip-path: polygon(25% 0, 100% 0, 100% 100%, 25% 100%, 0 50%);}
	.opentab-button img {width: 70%; height: 70%;}
	.opentab-button:hover {background-color: var(--theme-highlight); width:8vw;}
</style>