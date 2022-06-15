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
<button class="opentab-button left" on:click={()=>{switchTabs("Notes")}} title="Notes">
	<svg viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg">
		<line x1="40.3769" y1="6.32857" x2="6.37689" y2="45.3286" stroke="black"/>
		<path d="M51.0744 14.7046L17.5887 52.325" stroke="black"/>
		<path d="M40 6.51347C43.8355 5.34865 51.4018 5.41521 50.9833 15" stroke="black"/>
		<path d="M6.5 45L6 56L18 52" stroke="black"/>
		<path d="M6 55.5L14 45.5" stroke="black" stroke-width="0.8" stroke-linecap="square"/>
		<circle cx="15" cy="44" r="1.6" stroke="black" stroke-width="0.8"/>
		<path d="M13 37.5C16.5 36.3333 23.5 36.3 23.5 45.5" stroke="black" stroke-width="0.8" stroke-linecap="square"/>
		<path d="M48.5 13.5L31 32.5" stroke="black" stroke-width="0.8" stroke-linecap="round"/>
		<path d="M29 34.5L26.5 37" stroke="black" stroke-width="0.8" stroke-linecap="round"/>
		<path d="M6.5 57C12.6667 57.1667 25.8 55.8 29 49C33 40.5 42 53 48 53.5C54 54 55 49 57 49" stroke="black" stroke-width="0.8" stroke-linecap="round"/>
	</svg>
</button>
<button class="opentab-button right" on:click={()=>{switchTabs("Options")}} title="Options">
	<svg viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg">
		<path d="M54 28.5V44C54 49.5228 49.5228 54 44 54H16C10.4772 54 6 49.5228 6 44V17C6 11.4772 10.4772 7 16 7H42" stroke="black" stroke-linecap="round"/>
		<line x1="11.9899" y1="28.23" x2="28.0294" y2="44.2695" stroke="black" stroke-width="1.4" stroke-linecap="round"/>
		<line x1="28.2552" y1="44.5289" x2="58.7842" y2="14" stroke="black" stroke-width="1.4" stroke-linecap="round"/>
	</svg>		
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
		--theme-link: rgb(0,100,200);
	}
	@media (prefers-color-scheme:dark){
		:global(:root){
			--theme-highlight: #4ca882;
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
			--theme-link: rgb(26, 132, 238);
		}
		:global(hr){background-color: var(--theme-dark);}
	}
	:global(html,body){
		position: relative;
		width: 100%;
		height: 100%;
	}
	:global(body){
		padding:0;
		color: var(--theme-dark);
		background-color: var(--theme-light);
		margin: 0;
		box-sizing: border-box;
		font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen-Sans, Ubuntu, Cantarell, "Helvetica Neue", sans-serif;
	}
	:global(a){
		color: var(--theme-link);
		text-decoration: none;
	}
	:global(a:hover){
		text-decoration: underline;
	}
	:global(input, button, select, textarea){
		font-family: inherit;
		font-size: inherit;
		-webkit-padding: 0.4em 0;
		padding: 0.4em;
		margin: 0 0 0.5em 0;
		box-sizing: border-box;
		border: 1px solid #ccc;
		border-radius: 2px;
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
	:global(textarea:disabled,input:disabled){background-color: var(--theme-disabled); color: var(--theme-dark)}
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
	:global(.calc-btn){
		height: 70px;
        background-color: var(--theme-light);
		color: var(--theme-dark);
	}
	:global(.calc-btn:hover) {background-color: var(--theme-highlight);}
	:global(.calculator-grid .calc-btn){margin: 0px;}
	:global(.max-500-y){
        overflow-y: auto;
        max-height: 500px;
	}
	:global(.left-align) {
        text-align: left;
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
		-webkit-appearance: textfield;
		appearance: textfield;
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
	:global(textarea) {
        width: 100%;
        max-height: 500px;
		background-color: var(--theme-input);
		box-shadow: var(--slight-shadow);
		border: none;
		border-radius: 10px;
    }
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
		:global(.calc-btn){ height: 55px;}
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
	svg {width: 70%; height: 70%;}
	.opentab-button:hover {background-color: var(--theme-highlight); width:8vw;}
</style>