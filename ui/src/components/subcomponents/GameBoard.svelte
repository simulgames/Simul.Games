<script lang="ts">
    import Tile from "../style/Tile.svelte";
    export let TileBoard : [[{letter:string,style:string}]]
</script>

<style>
    .grid-column{
        grid-template-columns: repeat(5,1fr);
    }
</style>

<div class="grid-column mx-auto grid flex-grow gap-[1vw]">
    {#each TileBoard as turn}
        {#each turn as tile}
            <Tile character={tile.letter} style={tile.style}/>
        {/each}
    {/each}
</div>