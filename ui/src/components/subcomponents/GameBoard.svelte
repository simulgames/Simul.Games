<script lang="ts">
    import Tile from "../style/Tile.svelte";
    export let Guesses : [number[string]] = []
    export let Results : [number[number]] = []
    export let CurrentWord : string
    let width = 5
    let height = 6

    $: getCharacter = (turn : string,character : string) => {
        let currentTurn = Guesses.length-1
        if(turn < currentTurn){
            return Guesses[turn][character]
        }
        if(turn == currentTurn){
            if(character < CurrentWord.length){
                return CurrentWord[character]
            }
        }
        return ""
    }
</script>

<style>
    .grid-column{
        grid-template-columns: repeat(5,1fr);
    }
</style>

<div class="flex mx-[30vw]">
    <div class="grid-column mx-auto grid flex-grow gap-[1vw]">
        {#each Array(height) as _,turn}
            {#each Array(width) as _,character}
                <Tile character={getCharacter(turn,character)}/>
            {/each}
        {/each}
    </div>
</div>