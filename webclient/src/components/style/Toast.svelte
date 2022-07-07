<script lang="ts">
    import {fade,scale} from "svelte/transition";
    import Paper from "./Paper.svelte";
    export let text = ''
</script>

<div class="m-2 shadow-xl w-fit mx-auto" in:scale out:fade>
    <Paper>
        <span class="p-3 text-2xl">{text}</span>
    </Paper>
</div>