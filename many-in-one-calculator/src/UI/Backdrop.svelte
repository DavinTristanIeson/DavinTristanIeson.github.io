<script type="ts">
    import { fade } from "svelte/transition";
    import { Direction,SwipeManager } from "../Utils";
    export let onCloseModal:()=>void;
    export let direction:Direction;
    const swiper = new SwipeManager({x:200,y:Infinity},onCloseModal,direction);
</script>

<div class="backdrop"
transition:fade
on:click={onCloseModal}
on:touchstart={(e)=>{swiper.onSwipeStart(e)}}
on:touchend={(e)=>{swiper.onSwipeEnd(e)}}>
    <slot></slot>
</div>

<style>
</style>