<script>
    import AboutArticle from "./Components/AboutArticle.svelte";
    import AbilityListItem from "./Components/AbilityListItem.svelte";
    export let Me;
</script>

<div class="split-in-two">
    <div id="left-info">
        {#each Me.about.lists as segment}
            <AbilityListItem
                title = {segment.title}
                abilityList = {segment.contents}
            />
        {/each}
    </div>
    <div>
        <section>
            {#each Me.about.articles as article}
                <AboutArticle
                    articleTitle = {article.title}
                    articleContents = {article.contents}
                    activityList = {article.list}
                    isCollapsed = {article.isCollapsed}
                />
            {/each}
        </section>
    </div>
</div>

<style>
    #left-info {
        padding: 20px;
        background-color: var(--theme-dark);
        color: var(--theme-light);
    }
</style>