<script lang="ts">
    import Tile from "../style/Tile.svelte";
    export let Guesses : [number[string]] = []
    export let Results : [number[number]] = []
    export let CurrentWord : string
    let width = 5
    let height = 6

    $: getCharacter = (turn : string,character : string) => {
        let currentTurn = Guesses.length
        if(turn != height && turn == currentTurn){
            if(character < CurrentWord.length){
                return CurrentWord[character]
            }
            return ""
        }
        if(Guesses[turn] != null){
            return Guesses[turn][character]
        }
        return ""
    }

    $: getStyle = (turn : string,character : string) => {
        if(Results[turn] != null){
            let result = Results[turn][character]
            if(Results[turn][character] != null){
                switch (result){
                    case 0:{
                        return "tile-with-result no-letter"
                    }
                    case 1:{
                        return "tile-with-result has-letter"
                    }
                    case 2:{
                        return "tile-with-result has-letter-at-space"
                    }
                }
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
                <Tile character={getCharacter(turn,character)} style={getStyle(turn,character)}/>
            {/each}
        {/each}
    </div>
</div>