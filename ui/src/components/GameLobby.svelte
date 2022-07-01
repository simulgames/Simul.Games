<script lang="ts">
    import {type LobbyData} from "../types/LobbyData";
    import {onMount} from "svelte";

    export let lobbyData : LobbyData = null
    import {type SendMessage} from "../scripts/WebSocket";
    export let sendMessage : SendMessage = null
    import Keyboard from "./subcomponents/Keyboard.svelte";
    import GameBoard from "./subcomponents/GameBoard.svelte";


    type result = any
    type GameInfo = { Guesses : {id:[number[string]]},
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

    function keyUp(e){
        console.log(e)
    }

    onMount(()=>{
        sendMessage("GameInfo")
        document.addEventListener("GameInfo",setGameInfo)
        document.addEventListener("keydown",keyUp)
        return ()=>{
            document.removeEventListener("GameInfo",setGameInfo)
            document.removeEventListener("keydown",keyUp)
        }
    })
</script>

<ul>
    {#each lobbyData.members as member}
    <li>
        {member.name}
    </li>
    {/each}
</ul>

<GameBoard/>
<Keyboard/>