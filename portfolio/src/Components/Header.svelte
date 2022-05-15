<script>
    import {createEventDispatcher} from 'svelte';
    import { useMediaQuery } from "../Misc";
    import {scale} from "svelte/transition";
    import {bounceOut} from "svelte/easing";

    export let Me;
    let dispatch = createEventDispatcher();
    export let selectedPage = "About";
    function toggleOpenedPage(pageName){
        if (pageName !== selectedPage){
            selectedPage = pageName;
            dispatch("pageChange",pageName);
        }
    }
    let isSmallScreen = false;
    useMediaQuery("screen and (max-width:480px)").subscribe((data)=>{
        isSmallScreen = data;
    });
</script>

<header>
    <div id="profile">
        <img src={Me.about.selfie} alt="Selfie" class="icon" transition:scale={{duration:2000,easing:bounceOut}}>
        <p>{Me.about.name}</p>
    </div>
    <nav>
        {#if !isSmallScreen}
            <div class="split-in-two dark-background">
                <div class="curve-select" class:selected={selectedPage==="Projects"}
                on:click={()=>{toggleOpenedPage("Projects");}}>
                    <p class="light-text">Projects</p>
                </div>
                <div class="curve-select" class:selected={selectedPage==="About"}
                on:click={()=>{toggleOpenedPage("About");}}>
                    <p class="light-text">About</p>
                </div>
            </div>
        {:else}
            <div class="dark-background align-column" id="stack-selector">
                <p class:selected={selectedPage==="Projects"} on:click={()=>{toggleOpenedPage("Projects");}}>Projects</p>
                <p class:selected={selectedPage==="About"} on:click={()=>{toggleOpenedPage("About");}}>About</p>
            </div>
        {/if}
    </nav>
</header>

<style>
    header {overflow-x:hidden}
    header div#profile {
        display:flex;
        flex-direction: column;
        align-items: center;
        background-color: var(--theme-dark);
        padding:30px 0px;
        width: 100vw;
    }
    img.icon {
        object-position: 0px -3px;
        width: 14vw;
        height: 14vw;
    }
    @media screen and (max-width: 480px){
        img.icon {width:24vw; height:24vw;}
    }
    p {
        text-align:center;
        padding: 0;
        margin: 0;
        font-size:3em;
    }
    @keyframes shifting-colors {
        0% {
            color: var(--theme-dark);
            font-size:36px;
        }
        25% {
            transform:rotate(7deg);
        }
        33% {
            color: var(--theme-highlight-toned-down);
        }
        50% {
            transform:rotate(0deg);
        }
        66% {
            color: var(--theme-highlight);
        }
        75% {
            transform:rotate(-7deg);
        }
        100% {
            color: var(--theme-light);
            font-size:38px;
            transform:rotate(0deg);
        }
    }
    #profile>p {
        font-size: 48px;
        animation:shifting-colors 5s linear infinite alternate;
    }
    .dark-background {background: var(--theme-dark);}

    @media screen and (max-width:480px){
        #stack-selector {color: var(--theme-disabled);}
        #stack-selector .selected {color: var(--theme-light);}
    }
    .curve-select {
        background-color: var(--theme-dark);
        padding: 50px 100px;
        display: flex;
        justify-content: center;
        border-radius: 50% 50% 0% 0%;
        cursor:pointer;
    }
    .curve-select.selected p {color: var(--theme-dark);}
    .curve-select>p {font-size: 36px;color: var(--theme-disabled);  font-size:3.3em;}
    .curve-select:not(.selected):hover {background-color: var(--theme-highlight-toned-down);}
    .curve-select:not(.selected):hover p {color: var(--theme-light);}
    .curve-select.selected {background-color:var(--theme-background);}
</style>