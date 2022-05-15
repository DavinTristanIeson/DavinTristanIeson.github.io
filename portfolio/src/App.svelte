<script>
	import Header from "./Components/Header.svelte";
	import About from "./About.svelte";
	import Projects from "./Projects.svelte";
	import Footer from "./Components/Footer.svelte";
	const SOURCE_FILE = "./MyInfo.json";
	let Me;
	async function fetchData(){
		const rawJson = await fetch(SOURCE_FILE);
		Me = await rawJson.json();
	}
	fetchData();
	
	let selectedPage = "About";
	const availablePages = ["Projects","About"]
	function changeSelectedPage(e){
		// shield just in case I mess up the code somewhere and tries to go to an invalid page
		selectedPage = (availablePages.indexOf(e.detail) >= 0 ? e.detail : "About");
	}
</script>

{#if Me}
<base target="_blank">
<Header on:pageChange={changeSelectedPage}
selectedPage = {selectedPage}
Me={Me}/>
<main>
	{#if selectedPage === "Projects"}
		<Projects Me={Me}/>
	{:else}
		<About Me={Me}/>
	{/if}
</main>
<Footer selectedPage = {selectedPage}/>
{/if}

<style>
	:global(body){
		font-family: 'Josefin Sans', sans-serif;
		padding: 0px;
		margin: 0px;
		background-color: var(--theme-background);
	}
	/* Global css */
	:global(img.icon){
        border-radius: 100%;
        width: 5vw;
        height: 5vw;
        object-fit: cover;
        box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2);
    }
	:global(:root) {
		--theme-background: #fff;
		--theme-light: #fff;
		--theme-dark: #082A4D;
		--theme-highlight: #88AAFF;
		--theme-highlight-toned-down: #444499;
		--theme-highlight-grey: #DDD;
		--theme-disabled: #AAA;
	}
	:global(.light-text){color: var(--theme-light);}
	:global(.dark-text){color: var(--theme-dark);}
	:global(.align-row){display:flex; flex-direction: row; align-items: center;}
	:global(.split-in-two){
		display: grid;
        grid-template-columns: 50vw 50vw;
		overflow: hidden;
	}
	:global(.align-column){display:flex; flex-direction: column; align-items: center;}

	@media screen and (max-width:480px){
		:global(.split-in-two){
			display:flex;
			flex-direction: column;
		}
	}

	@media (prefers-color-scheme:dark){
		:global(:root) {
			--theme-background: #7f7d8f;
			--theme-light: #dde;
			--theme-dark: #0b151f;
			--theme-highlight: #8866BB;
			--theme-highlight-toned-down: #332255;
			--theme-highlight-grey: #9f9dAf;
			--theme-disabled: #777;
		}
	}
</style>