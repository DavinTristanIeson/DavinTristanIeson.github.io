<script>
    export let title, abilityList;
    import {fly} from "svelte/transition";
</script>

<h4>{title}</h4>
<ul>
    {#each abilityList as ability,i}
    <li in:fly={{x:-100,y:0,duration:100,delay:50*i}}>
        {#if ability?.url}
            <a href={ability.url}>{ability.text}</a>
        {:else}
            {ability}
        {/if}
    </li>
    {/each}
</ul>

<style>
    h4 {font-size:1.5em; padding:0; margin:20px 0px;}
    ul {
        list-style-type: none;
        padding: 0px 10px;
        margin: 0px;
    }
    ul li {font-weight:300; font-size:1.2em;}
    ul li:hover a {
        text-decoration: underline;
        color: var(--theme-light);
    }
    a {color: var(--theme-highlight); text-decoration: none;}
</style>