<script lang="ts">
    import Toast from "../style/Toast.svelte";
    import {toasts} from "../../scripts/Toast"
    export let maxToasts = 10
</script>

<div class="absolute top-20 mx-auto left-0 right-0 w-fit select-none">
    {#each Object.values($toasts).slice(-maxToasts) as toast}
        <Toast text={toast}/>
    {/each}
</div>