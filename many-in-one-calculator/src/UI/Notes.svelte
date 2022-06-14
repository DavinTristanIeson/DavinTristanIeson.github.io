<script type="ts">
    import { onDestroy, onMount } from 'svelte';
    import { fly } from 'svelte/transition';
    let typeArea:HTMLTextAreaElement;
    onMount(()=>{
        typeArea.value = localStorage.getItem("notes");
    })
    onDestroy(()=>{
        localStorage.setItem("notes",typeArea.value);
    });
</script>

<div transition:fly={{x:-500}} class="modal" on:click|stopPropagation>
    <textarea bind:this={typeArea}></textarea>
</div>

<style>
    .modal {
        width:40vw;
        height:inherit;
    }
    @media screen and (max-width: 720px){
        .modal {
            width: 70vw;
        }
    }
    div {
        padding:30px;
        background-color: var(--theme-light);
	}
    textarea {
        background-color: #fff;
        width:inherit;
        height:inherit;
        font-size: 2em;
        box-sizing: border-box;
        padding: 0.4em;
        max-height: 90vh;
        resize: none;
    }
</style>