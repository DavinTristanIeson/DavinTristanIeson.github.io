<script>
    export let project;
    import {createEventDispatcher} from "svelte";
    let dispatch = createEventDispatcher();
    function openProject(){
        dispatch("openProject",project);
    }
</script>

<article class="project-item align-column" on:click={openProject}>
    <h2>{project.title}</h2>
    {#if project.image}<img src={project.image.url} alt={project.image.text}>
    {:else}<div class="skeleton-image"></div>{/if}
    <a href={project.link.url}>{project.link.text}</a>
</article>
<hr>

<style>
    article {
        width: 100%;
        padding: 20px;
        cursor:pointer;
    }
    hr {
        background-color: var(--theme-highlight-grey); border:none; outline:none;
        height: 2px;
        width:70%;
        margin: 0px 20px 5px;
        opacity:0.5;
    }
    h2 {padding:0; margin:10px 0px 5px; font-size:2em;}
    img, .skeleton-image {
        width:18vw;
        height:12vw;
        object-fit: cover;
        min-width:300px;
        min-height:225px;
    }
    .skeleton-image {background-color: var(--theme-disabled); padding:20px;}
    @media screen and (max-width:480px){
		a {font-size:1em;}
	}
    a {
        color: var(--theme-highlight-toned-down);
        text-decoration: none;
        font-weight: 300;
        word-break: break-all;
        font-size:1.4em;
    }
    a:hover {
        text-decoration: underline;
        color: var(--theme-dark);
    }
    .project-item:hover {
        background-color: var(--theme-highlight-grey);
    }
</style>