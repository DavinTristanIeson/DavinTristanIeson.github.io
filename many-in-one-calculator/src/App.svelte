<script lang="ts">
	import Header from "./Components/Header.svelte";
	import Notes from "./Notes.svelte";
	import Options from "./Options.svelte";
	import Main from "./Main.svelte";
	import Backdrop from "./Components/Backdrop.svelte";
	import { SwipeDirection } from "./Utils";

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
direction = {SwipeDirection.LEFT}>
	<Notes/>
</Backdrop>
{:else if currentTab == "Options"}
<Backdrop
onCloseModal = {()=>{switchTabs("Options");}}
direction = {SwipeDirection.RIGHT}>
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
		--slight-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2);
		--theme-disabled: #aaaaaa;
		--theme-error: rgb(221, 42, 42);
		--theme-snackbar: #444;
	}
	@media (prefers-color-scheme:dark){
		:global(:root){
			--theme-highlight: #4da84c;
			--theme-main: #1d771b;
			--theme-dim: #0c3309;
			--theme-dark: #a8b4a8;
			--theme-light: #3d423d;
			--theme-input: #3d523d;
			--slight-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.4);
			--theme-disabled: #888;
			--theme-error: rgb(221, 42, 42);
			--theme-snackbar: rgb(145, 158, 147);
		}
	}
	:global(body){
		padding:0;
		color: var(--theme-dark);
		background-color: var(--theme-light);
	}
	:global(table){border-collapse: collapse;}
	:global(table td, table th){
		border: 2px solid black;
		text-align: center;
	}
	:global(table th){background-color: var(--theme-main);}
	:global(hr) {
		background-color: var(--theme-disabled);
		border:none; outline:none;
		width: 100%;
        height: 2px;
	}
	:global(input:not([type=submit],[type=button],[type=radio],[type=checkbox])){
        padding: 10px;
        font-size: 1.2em;
		/* https://stackoverflow.com/questions/42421361/input-button-elements-not-shrinking-in-a-flex-container */
		min-width: 0px;
		border: 1px solid var(--theme-dim);
		background-color: var(--theme-input);
		color: var(--theme-dark);
	}
	:global(select){
		background-color: var(--theme-input);
		color: var(--theme-dark);
		border: none;
	}
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
	:global(.input-w-btn input) {margin: 5px 10px;}
    :global(.input-w-btn button) {margin: 5px 10px; background-color: var(--theme-main);}
	:global(.full-width){width: 100%;}
	:global(button){
        background-color: var(--theme-main);
        border-radius: 5px;
		border: none;
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