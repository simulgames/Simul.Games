<script lang="ts">
    import {type LobbyData} from "../types/LobbyData";
    import {onMount} from "svelte";

    export let lobbyData : LobbyData = null
    import {type SendMessage} from "../scripts/WebSocket";
    export let sendMessage : SendMessage = null
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


    let maxLength = 5
    let currentGuess = ""
    $: guessIsRightLength = currentGuess.length == maxLength
    let awaitingReply = false

    function keyUp(e){
        if(awaitingReply){
            return;
        }
        let key = (e as KeyboardEvent).key
        if(key == "Backspace"){
            currentGuess = currentGuess.substring(0,currentGuess.length-1)
            return;
        }

        if(key == "Enter"){
            if(guessIsRightLength){
                sendMessage("SubmitWord",{guess:currentGuess})
                awaitingReply = true
            }
            return;
        }

        if(guessIsRightLength){
            return
        }

        currentGuess = currentGuess + key.toUpperCase()
    }


    function CompareResultClient(e:Event){
        let msg = (e as CustomEvent).detail
        if(msg["status"] == "error"){
            console.log("not a word!")
        }
        awaitingReply = false
    }

    onMount(()=>{
        sendMessage("GameInfo")
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
{#if gameInfo != null}
    <ul>
        {#each lobbyData.members as member}
        <li>
            {member.name}
        </li>
        {/each}
    </ul>

    <GameBoard Guesses= {gameInfo.Guesses[lobbyData["client-id"]]}
               Results= {gameInfo.Results[lobbyData["client-id"]]}
               bind:CurrentWord={currentGuess}
    />
    <Keyboard isEnterDisabled={!guessIsRightLength}/>
{/if}