<script>
    import ProjectItem from "./Components/ProjectItem.svelte";
    import ProjectView from "./Components/ProjectView.svelte";
    import { useMediaQuery } from "./Misc";
    import {scale} from "svelte/transition";
    let isSmallScreen = false;
    let topOfProjectsPage;
    useMediaQuery("screen and (max-width:480px)").subscribe((data)=>{
        isSmallScreen = data;
    });
    export let Me;
    let currentProject = null;
    function openProject(e){
        currentProject = e.detail;
        if (isSmallScreen){
            topOfProjectsPage.scrollIntoView();
        }
    }
</script>

<div class="split-in-two" bind:this={topOfProjectsPage}>
    <div id="left-side" class="align-column">
        {#each Me.projects as project}
            <ProjectItem project={project} on:openProject={openProject}/>
        {/each}
    </div>
    <div id="right-side">
        {#if currentProject}
            {#key currentProject}
            <!-- Need a container because you cannot use transition directly on components. -->
            <div in:scale>
                <ProjectView project={currentProject} isSmallScreen={isSmallScreen} on:openProject={openProject}/>
            </div>
            {/key}
        {/if}
    </div>
</div>

<style>
    #right-side {
        padding: 20px;
        background-color: var(--theme-dark);
        color: var(--theme-light);
        min-height:400px;
    }
    @media screen and (max-width:480px){
        #right-side {
            position:absolute;
            margin: 0 auto;
            padding: 0;
        }
        #left-side {
            margin: 0;
            padding: 0;
        }
    }
</style>