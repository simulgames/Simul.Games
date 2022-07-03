<script lang="ts">
    import {type LobbyData} from "../types/LobbyData";
    import {onMount} from "svelte";
    export let lobbyData : LobbyData = null
    import { SendMessage} from "../scripts/WebSocket";
    import Keyboard from "./subcomponents/Keyboard.svelte";
    import GameBoard from "./subcomponents/GameBoard.svelte";

    type result = any
    export type GameInfo = { Guesses : {id:[number[string]]},
                    Results : {id:[number[number]]},
                    Successful: boolean,
                    HasClientFinished: boolean,
                    HasFinished: boolean,
                    Word : string
    }

    let gameInfo : GameInfo = null
    function setGameInfo(e:Event){
        gameInfo = (e as CustomEvent).detail
        console.log(gameInfo)
    }

    $ : KeyBoardClasses = () => {
        let keyboardResults : {id:number} = {}
        let guesses : [string] = gameInfo ? gameInfo.Guesses[lobbyData["client-id"]] : []
        let results : [[number]] = gameInfo ? gameInfo.Results[lobbyData["client-id"]] : [[]]
        for(let turn = 0; turn< results.length;turn++){
            let guess : string = guesses[turn]
            let result : [number] = results[turn]
            for(let i = 0;i<result.length;i++){
                let letter : string = guess[i]
                if(keyboardResults[letter] && result[i] < keyboardResults[i]) {
                    continue
                }
                keyboardResults[letter] = result[i]
            }
        }
        let keyboardClasses : {id:string} = {}
        for (let key in keyboardResults) {
            keyboardClasses[key] = getStyle("key-with-result",keyboardResults[key])
        }
        return keyboardClasses
    }

    let maxLength = 5
    let currentGuess = ""
    $: guessIsRightLength = currentGuess.length == maxLength
    let awaitingReply = false

    function keyUp(e){
        if(awaitingReply || gameInfo["HasClientFinished"]){
            return;
        }
        let key = (e as KeyboardEvent).key
        if(key == "Backspace"){
            currentGuess = currentGuess.substring(0,currentGuess.length-1)
            return;
        }

        if(key == "Enter"){
            if(guessIsRightLength){
                SendMessage("SubmitWord",{guess:currentGuess})
                awaitingReply = true
            }
            return;
        }

        if(guessIsRightLength){
            return
        }

        if(isCharacterALatinLetter(key.toUpperCase())){
            currentGuess = currentGuess + key.toUpperCase()
        }
    }

    const styles = {0:'no-letter',1:'has-letter',2:'has-letter-at-space'}

    const getStyle = (base: string, result:number) => {
        if(result != null){
            return base + " " + styles[result]
        }
        return ""
    }

    function isCharacterALatinLetter(char:string) {
        if(char.length > 1){
            return false
        }
        return (/[A-Z]/).test(char)
    }


    function CompareResult(id:string,result:string,turn:number){
        let parsedResult : [string] = result.slice(1,-1).split(" ")
        let currentResults : [[number]] = gameInfo.Results[id] ? gameInfo.Results[id] : [[]]
        let updatedResults : [[number]] = [...currentResults]
        updatedResults.push([])
        gameInfo.Results[id] = updatedResults
        for(let i=0;i<parsedResult.length;i++){
            setTimeout(()=>{
                let updatedResults : [[number]] = [...gameInfo.Results[id]]
                updatedResults[turn].push(Number(parsedResult[i]))
                gameInfo.Results[id] = [...updatedResults]
            },i*500)
        }
    }

    function UpdateGuess(id:string,guess:string,turn:number){
        let currentGuesses : [string] = gameInfo.Guesses[id] ? gameInfo.Guesses[id] : []
        let updatedGuesses : [string] = [...currentGuesses]
        if(updatedGuesses.length != turn){
            return;
        }
        updatedGuesses.push(guess)
        gameInfo.Guesses[id] = updatedGuesses
    }

    function CompareResultClient(e:Event){
        let msg = (e as CustomEvent).detail
        awaitingReply = false
        if(msg["status"] == "error"){
            console.log("not a word!")
            return
        }
        if(msg["status"] == "finished"){
            SendMessage("GameInfo")
        }

        let turn : number = msg["turn"]
        let clientID = lobbyData["client-id"]
        UpdateGuess(clientID,msg["guess"],turn)
        CompareResult(clientID,msg["result"],turn)

        currentGuess = ""
    }

    function CompareResultOther(e:Event){
        let msg = (e as CustomEvent).detail
        let id = msg["id"]
        let turn = msg["turn"]
        CompareResult(id,msg["result"],turn)

        let guess = msg["guess"]
        if(guess != undefined){
            UpdateGuess(id,msg["guess"],turn)
        }
    }

    onMount(()=>{
        SendMessage("GameInfo")
        document.addEventListener("GameInfo",setGameInfo)
        document.addEventListener("CompareResultClient",CompareResultClient)
        document.addEventListener("CompareResultOther",CompareResultOther)
        document.addEventListener("keydown",keyUp)
        return ()=>{
            document.removeEventListener("GameInfo",setGameInfo)
            document.removeEventListener("CompareResultClient",CompareResultClient)
            document.removeEventListener("CompareResultOther",CompareResultOther)
            document.removeEventListener("keydown",keyUp)
        }
    })

    let width = 5
    let height = 6

    $: getLetter = (turn : number, character : number,id: string) => {
        let guesses = gameInfo.Guesses[id]
        if(guesses == null){
            return ""
        }
        let currentTurn = guesses.length
        if(id == lobbyData["client-id"] && turn != height && turn == currentTurn){
            if(character < currentGuess.length){
                return currentGuess[character]
            }
            return ""
        }
        if(guesses[turn] != null){
            return guesses[turn][character]
        }
        return ""
    }

    $: tileBoard = (id:string) : [[{letter:string,style:string}]] => {
        if(id == null){
            return [[{letter:'err',style:'err'}]]
        }
        let results = gameInfo.Results[id] ? gameInfo.Results[id] : []
        let tileBoard : [[{letter:string,style:string}]] = []
        for(let turn = 0; turn<height; turn++){
            tileBoard.push([])
            for(let i = 0; i<width; i++){
                let letter = getLetter(turn,i,id)
                let result = results[turn] ? results[turn][i] : null
                let style = getStyle("tile-with-result",result)
                let tile = {letter,style}
                tileBoard[turn].push(tile)
            }
        }
        return tileBoard
    }
</script>


<link rel="stylesheet" href="src/components/style/word-duel.css" />

{#if gameInfo != null && lobbyData.members != null}
    <ul class="flex mx-auto overflow-auto pb-3 whitespace-nowrap justify-center list-none">
        {#each lobbyData.members as member}
        <li class="w-[7rem] text-xs font-mono font-bold m-1">
            <div class="w-full bg-white shadow-md rounded text-center p-2">
                <span class="text-sm font-medium text-primary-500">{member.name}</span>
                <GameBoard TileBoard={tileBoard(member.id)} Class="gap-0.5" TileClass="small-tile"></GameBoard>
            </div>
        </li>
        {/each}
    </ul>

    <div class="flex mx-[30vw] text-2xl md:text-3xl font-bold font-serif">
        <GameBoard TileBoard={tileBoard(lobbyData["client-id"])} Class="flex-grow gap-[1vw]" TileClass="bg-white rounded shadow-md"/>
    </div>
    <div class="mx-[3vw]">
        <div class="justify-center max-w-[40rem] mx-auto">
            <Keyboard isEnterDisabled={!guessIsRightLength} KeyBoardClasses={KeyBoardClasses()}/>
        </div>
    </div>
{/if}