<script lang="ts">
    import {onMount} from "svelte";
    import {type LobbyData} from "../types/LobbyData"
    import {SendMessage} from "../scripts/WebSocket";
    export let lobbyData : LobbyData


    import Card from "./style/Card.svelte";
    import Button from "./style/Button.svelte";
    import Avatar from "./style/Avatar.svelte";
    import LobbyHost from "./style/icons/LobbyHost.svelte";

    let showKey = true
    let gameName = "Word Duel"

    $: keyIcon = showKey ? "key" : "key_off"
    $: formattedLobbyCode = showKey && lobbyData ? `${lobbyData.lobby.id.substring(0,3)}-${lobbyData.lobby.id.substring(3)}` : "•••-•••"


    function leaveLobby(){
        SendMessage("LeaveLobby")
    }
    function startGame(){
        SendMessage("StartGame")
    }


    function OnGameStarted(){

    }


    function OnMemberJoined(){
        SendMessage("GetLobbyDataInternal") // todo - this is lazy, but for feature parity, this is the best approach for now
    }


    function OnMemberLeft(){
        SendMessage("GetLobbyDataInternal") // todo - this is lazy, but for feature parity, this is the best approach for now
    }

    onMount(()=>{
        document.addEventListener("GameStarting",OnGameStarted)
        document.addEventListener("MemberJoined",OnMemberJoined)
        document.addEventListener("MemberLeft",OnMemberLeft)
        return ()=>{
            document.removeEventListener("GameStarting",OnGameStarted)
            document.removeEventListener("MemberJoined",OnMemberJoined)
            document.removeEventListener("MemberLeft",OnMemberLeft)
        }
    })

</script>

<style>
    .grid-columns{
        grid-template-columns: repeat(auto-fill,10rem);
    }
</style>

<div class="select-none">
    <Card>
        <h1 class="text-xl text-primary-700 font-bold font-serif">{lobbyData.lobby.name}</h1>
        <div class="flex justify-between">
            <button on:click={()=>{showKey=!showKey}}>
                <span class="material-icons text-sm text-primary-700">{keyIcon}</span>
                <span class="font-mono text-sm">{formattedLobbyCode}</span>
            </button>
            <span class="text-primary-700 font-serif text-lg">
                Playing <i>{gameName}</i>
            </span>
        </div>
        <hr class="mb-5">
        <ul class="inline-grid justify-between w-full grid-columns list-none">
                {#each lobbyData.members as member}
                    <li class="text-center">
                    <Avatar fill={member.color}>
                        {#if member.id === lobbyData.lobby["host-id"]}
                            <LobbyHost fill="#3B82F6"/>
                        {/if}
                    </Avatar>
                    <span class="text-lg font-mono text-primary-700 {member.id === lobbyData['client-id'] ? 'font-bold' : ''}">{member.name}</span>
                    </li>
                {/each}
        </ul>
        <hr class="mt-5">
        <div class="flex justify-between p-3">
            <div class="flex-[0.25] w-full">
                <Button text="LEAVE" icon="logout" OnClick={leaveLobby}/>
            </div>
            <div class="flex-[0.25] w-full">
                <!-- todo - change to a "READY" button for non hosts -->
                <Button text="START" icon="play_arrow" disabled={lobbyData['client-id']!==lobbyData.lobby["host-id"]} OnClick={startGame}/>
            </div>
        </div>
    </Card>
</div>