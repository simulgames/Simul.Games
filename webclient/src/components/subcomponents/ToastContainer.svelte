<script lang="ts">
    import Toast from "../style/Toast.svelte"
    import { toasts } from "$lib/Toast"

    export let maxToasts = 10
</script>

<div class="absolute top-20 left-0 right-0 mx-auto w-fit select-none">
    {#each Object.values($toasts).slice(-maxToasts) as toast}
        <Toast text={toast} />
    {/each}
</div>
