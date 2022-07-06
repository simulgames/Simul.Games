<script lang="ts">
    import Tile from "../style/Tile.svelte";
    export let Class : string = ""
    export let TileBoard : [{row:[{letter:string,style:string}],rowStyle?: { class:string,delay:number }}]
    export let TileClass : string = ""
</script>

<style>
    .grid-column{
        grid-template-columns: repeat(5,1fr);
    }
</style>

<div class="grid-column grid {Class}">
    {#each TileBoard as turn}
        {#each turn.row as tile, i}
            {#if turn.rowStyle !== null}
                <div class={turn.rowStyle.class} style={`animation-delay: ${turn.rowStyle.delay*i}ms`}>
                    <Tile character={tile.letter} Class={tile.style + " " + TileClass}/>
                </div>
            {:else}
                <Tile character={tile.letter} Class={tile.style + " " + TileClass}/>
            {/if}
        {/each}
    {/each}
</div>