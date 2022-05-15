<script>
    export let project, isSmallScreen = false;
    import {createEventDispatcher} from "svelte";
    let dispatch = createEventDispatcher();
    function closeProject(){
        dispatch("openProject",null);
    }
</script>

<article class="align-column">
    {#if isSmallScreen}
        <div class="close-modal" on:click={closeProject}>x</div>
    {/if}
    <h2>{project.title}</h2>
    <a href={project.link.url}>{project.link.text}</a>
    {#if project.image}<img id="main-img" src={project.image.url} alt={project.image.text}>
    {:else}<div class="skeleton-image"></div>{/if}
    <p>
        {#each project.description.split('\n') as line}
        {line}<br><br>
        {/each}
    </p>
    <slot></slot>
    <div class="tags">
        {#each project.tags as skill}
            <div>{skill}</div>
        {/each}
    </div>
    <div class="gallery">
        {#each project.gallery as image}
            <img src={image.url} alt={image.text} title={image.text}>
        {/each}
    </div>
</article>

<style>
    #main-img, .skeleton-image {width:70%; height:70%; object-fit: cover; margin: 20px}
    .skeleton-image {background-color: var(--theme-disabled); padding:20px;}
    h2 {padding:0; margin:0; font-size:2em;}
    a {
        color: var(--theme-highlight); text-decoration: none;
        font-weight: 300;
        word-break: break-all;
    }
    a:hover {
        text-decoration: underline;
        color: var(--theme-light);
    }
    p {
        margin: 0px 20px;
        font-weight: 300;
        font-size:1.2em;
    }
    .tags {
        margin: 10px 45px;
        display: flex;
        flex-direction: row;
        flex-wrap: wrap;
        justify-content: center;
    }
    .tags div {
        display:inline-block;
        border-radius:20px;
        background-color: var(--theme-disabled);
        padding:3px 6px;
        margin-left: 6px;
        margin-top: 6px;
        color: var(--theme-dark);
        text-overflow: ellipsis;
    }
    .gallery {
        display: flex;
        overflow-x: scroll;
        flex-direction: row;
        align-items: center;
        max-width: 75%;
        scroll-behavior: smooth;
        padding: 0; margin: 0;
        background-color: var(--theme-dark);
        box-shadow: 0px 7px 7px 7px rgba(0,0,0,0.2);
    }
    .gallery img {
        width:50%; height: 50%;
        object-fit: cover;
        margin: 10px;
    }
    .close-modal {
        font-size: 50px;
    }
</style>