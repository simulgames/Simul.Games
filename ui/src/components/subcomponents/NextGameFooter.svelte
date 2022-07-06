<script lang="ts">
    import {scale} from 'svelte/transition'
    import Button from "../style/Button.svelte";
    import {SendMessage} from "../../scripts/WebSocket.js";
    export let isHost : boolean = false
</script>

<div transition:scale class="absolute bottom-0 bg-blue-600 flex shadow-lg w-full text-white font-bold text-2xl text-center">
    {#if isHost}
        <Button icon="forward" text="New Game" OnClick={()=>{SendMessage('NewGame')}}/>
    {:else}
        <span class="w-full">Waiting for Host to Start New Game</span>
    {/if}
</div>