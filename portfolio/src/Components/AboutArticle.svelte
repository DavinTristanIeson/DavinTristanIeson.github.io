<script>
    export let articleTitle, articleContents, activityList = [], isCollapsed = false;
    import ActivityListItem from "./ActivityListItem.svelte";
    import {slide} from "svelte/transition";
</script>

<article on:click={()=>{isCollapsed = !isCollapsed}}>
    <h2>
        {articleTitle}
        {#if isCollapsed}
            <span>►</span>
        {:else}
            <span>▼</span>
        {/if}
    </h2>
    {#if !isCollapsed}
    <div transition:slide|local={{duration:100}}>
        <p class="detail-text">{articleContents}</p>
        <div>
            <ul>
                {#each activityList as info}
                    <ActivityListItem
                    title= {info.title}
                    dateInfo= {info.date}
                    description= {info.description}
                    listInfo= {info.list}
                    />
                {/each}
            </ul>
        </div>
    </div>
    {/if}
</article>
<hr>

<style>
    h2 {
        padding: 0px 0px;
        color: var(--theme-dark);
        font-size: 2em;
    }
    h2:hover {color: var(--theme-highlight);}
    h2:active {color: var(--theme-highlight);}
    .detail-text {font-weight:300; font-size:1.2em;}
    article {padding: 10px 20px; cursor: pointer;}
    hr {
        background-color: var(--theme-highlight-grey); border:none; outline:none;
        height: 2px;
        margin: 0px 20px 5px;
    }
    ul {
        list-style-type: none;
        padding: 0px 10px;
        margin: 0px;
    }
</style>