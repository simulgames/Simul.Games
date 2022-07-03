<script lang="ts">
    import Tile from "../style/Tile.svelte";
    export let Class : string = ""
    export let TileBoard : [[{letter:string,style:string}]]
    export let TileClass : string = ""
</script>

<style>
    .grid-column{
        grid-template-columns: repeat(5,1fr);
    }
</style>

<div class="grid-column grid {Class}">
    {#each TileBoard as turn}
        {#each turn as tile}
            <Tile character={tile.letter} style={tile.style + " " + TileClass}/>
        {/each}
    {/each}
</div>