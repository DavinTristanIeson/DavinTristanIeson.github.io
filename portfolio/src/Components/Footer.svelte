<script>
    export let selectedPage;
    import { useMediaQuery } from "../Misc";
    let isSmallScreen = false;
    useMediaQuery("screen and (max-width:480px)").subscribe((data)=>{
        isSmallScreen = data;
    });
</script>

<footer>
    <div class="split-in-two">
        <div class:rounded-end={!isSmallScreen} class:selected = {selectedPage === "Projects"}></div>
        <div class:rounded-end={!isSmallScreen} class:selected = {selectedPage === "About"}></div>
    </div>
</footer>

<style>
    footer div.split-in-two {
        background-color: var(--theme-dark);
        width: 100vw;
        height: 200px;
        padding:0; margin:0;
    }
    .selected {background-color: var(--theme-background);}
    .rounded-end {
        border-radius: 0% 0% 50% 50%;
        height:40%;
        padding:0; margin:0;
    }
    footer { overflow:hidden;}
</style>