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


    $: results = gameInfo ? gameInfo.Results[lobbyData["client-id"]] : [[]]
    $: guesses = gameInfo ? gameInfo.Guesses[lobbyData["client-id"]] : [[]]

    let gameInfo : GameInfo = null
    function setGameInfo(e:Event){
        gameInfo = (e as CustomEvent).detail
        console.log(gameInfo)
    }

    $ : KeyBoardClasses = () => {
        let keyboardResults : {id:number} = {}
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
            let style = "key-with-result "
            switch (keyboardResults[key]){
                case 0:{
                    style += "no-letter"
                    break
                }
                case 1:{
                    style += "has-letter"
                    break
                }
                case 2:{
                    style += "has-letter-at-space"
                    break
                }
            }
            keyboardClasses[key] = style
        }
        console.log(keyboardClasses)
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


    function isCharacterALatinLetter(char:string) {
        if(char.length > 1){
            return false
        }
        return (/[A-Z]/).test(char)
    }

    function CompareResultClient(e:Event){
        let msg = (e as CustomEvent).detail
        awaitingReply = false
        if(msg["status"] == "error"){
            console.log("not a word!")
            return
        }
        if(msg["status"] == "finished"){
            gameInfo["HasClientFinished"] = true
        }

        let turn : number = msg["turn"]
        let updatedGuesses : [[string]] = [...gameInfo.Guesses[lobbyData["client-id"]]]
        if(updatedGuesses.length != turn){
            return;
        }
        updatedGuesses.push(msg["guess"])
        gameInfo.Guesses[lobbyData["client-id"]] = updatedGuesses

        let result : [string] = msg["result"].slice(1,-1).split(" ")
        let updatedResults : [[number]] = [...gameInfo.Results[lobbyData["client-id"]]]
        updatedResults.push([])
        gameInfo.Results[lobbyData["client-id"]] = updatedResults
        for(let i=0;i<result.length;i++){
            setTimeout(()=>{
                let updatedResults : [[number]] = [...gameInfo.Results[lobbyData["client-id"]]]
                updatedResults[turn].push(Number(result[i]))
                gameInfo.Results[lobbyData["client-id"]] = [...updatedResults]
            },i*500)
        }

        currentGuess = ""
    }

    onMount(()=>{
        SendMessage("GameInfo")
        document.addEventListener("GameInfo",setGameInfo)
        document.addEventListener("CompareResultClient",CompareResultClient)
        document.addEventListener("keydown",keyUp)
        return ()=>{
            document.removeEventListener("GameInfo",setGameInfo)
            document.removeEventListener("CompareResultClient",CompareResultClient)
            document.removeEventListener("keydown",keyUp)
        }
    })
</script>


<link rel="stylesheet" href="src/components/style/word-duel.css" />

{#if gameInfo != null}
    <ul>
        {#each lobbyData.members as member}
        <li>
            {member.name}
        </li>
        {/each}
    </ul>

    <GameBoard Guesses= {guesses}
               Results= {results}
               bind:CurrentWord={currentGuess}
    />
    <div class="mx-[3vw]">
        <div class="justify-center max-w-[40rem] mx-auto">
            <Keyboard isEnterDisabled={!guessIsRightLength} KeyBoardClasses={KeyBoardClasses()}/>
        </div>
    </div>
{/if}