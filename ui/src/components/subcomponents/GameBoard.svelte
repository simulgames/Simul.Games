<script>
    import Tile from "../style/Tile.svelte";

    let width = 5
    let height = 6
</script>

<style>
    .grid-column{
        grid-template-columns: repeat(5,1fr);
    }
</style>

<div class="flex mx-[30vw]">
    <div class="grid-column mx-auto grid flex-grow gap-[1vw]">
        {#each Array(width) as x}
            {#each Array(height) as y}
                <Tile/>
            {/each}
        {/each}
    </div>
</div>