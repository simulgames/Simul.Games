<script lang="ts">
    import { scale } from "svelte/transition"
    import Button from "../style/Button.svelte"
    import { SendMessage } from "$lib/WebSocket"
    export let isHost = false
</script>

<div
    transition:scale
    class="absolute bottom-0 flex w-full bg-blue-600 text-center text-2xl font-bold text-white shadow-lg">
    {#if isHost}
        <Button
            icon="forward"
            text="New Game"
            OnClick={() => {
                SendMessage("NewGame")
            }} />
    {:else}
        <span class="w-full">Waiting for Host to Start New Game</span>
    {/if}
</div>
