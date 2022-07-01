<script lang="ts">
    import {onMount} from "svelte";

    export let sendMessage = null

    import Card from "./style/Card.svelte";
    import Button from "./style/Button.svelte";
    import Avatar from "./style/Avatar.svelte";
    import LobbyHost from "./style/icons/LobbyHost.svelte";

    let lobbyName = "Example's Lobby"
    let gameName = "Word Duel"
    let lobbyCode = "123456"
    let ClientID = ""
    let HostID = ""
    let showKey = true
    type member = {name:string,color:string,id:string}
    let members : [member] = []

    $: keyIcon = showKey ? "key" : "key_off"
    $: formattedLobbyCode = showKey ? `${lobbyCode.substring(0,3)}-${lobbyCode.substring(3)}` : "•••-•••"


    function leaveLobby(){
        sendMessage("LeaveLobby")
    }

    function OnGetLobbyData(e:Event){
        let msg = (e as CustomEvent).detail
        let lobby = msg["lobby"]
        lobbyName = lobby["name"]
        lobbyCode = lobby["id"]
        HostID = lobby["host-id"]
        ClientID = lobby["client-id"]
        document.title = `Simul.Games • ${lobby["name"]}`
        members = msg["members"]
    }


    function OnGameStarted(){

    }


    function OnMemberJoined(){

    }


    function OnMemberLeft(){

    }

    onMount(()=>{
        document.addEventListener("LobbyData",OnGetLobbyData)
        document.addEventListener("GameStarting",OnGameStarted)
        document.addEventListener("MemberJoined",OnMemberJoined)
        document.addEventListener("MemberLeft",OnMemberLeft)
        return ()=>{
            document.removeEventListener("LobbyData",OnGetLobbyData)
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
        <h1 class="text-xl text-primary-700 font-bold font-serif">{lobbyName}</h1>
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
                {#each members as member}
                    <li class="text-center">
                    <Avatar fill={member.color}>
                        {#if member.id === HostID}
                            <LobbyHost fill="#3B82F6"/>
                        {/if}
                    </Avatar>
                    <span class="text-lg font-mono text-primary-700">{member.name}</span>
                    </li>
                {/each}
        </ul>
        <hr class="mt-5">
        <div class="flex justify-between p-3">
            <div class="flex-[0.25] w-full">
                <Button text="LEAVE" icon="logout" OnClick={leaveLobby}/>
            </div>
            <div class="flex-[0.25] w-full">
                <Button text="START" icon="play_arrow"/>
            </div>
        </div>
    </Card>
</div>