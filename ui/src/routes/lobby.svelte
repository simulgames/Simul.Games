<script lang="ts">
    import "../app.css";
    import Header from "../components/Header.svelte"
    import Footer from "../components/Footer.svelte"
    import WaitingLobby from "../components/WaitingLobby.svelte";
    import {BuildWebSocket,type SendMessage} from "../scripts/WebSocket"
    let sendMessage : SendMessage = null
    import {onMount} from "svelte";
    import { goto } from "$app/navigation"
    import {type LobbyData} from "../types/LobbyData"
    import GameLobby from "../components/GameLobby.svelte";
    import IconButton from "../components/style/IconButton.svelte";

    function goToHomePage(){
        goto("/")
    }

    function gameStarted(){
        lobbyData["has-started"] = true
    }

    onMount(()=>{
        sendMessage = BuildWebSocket()
        sendMessage("UserLocation")
        sendMessage("GetLobbyDataInternal")
        document.addEventListener("LobbyLeft",goToHomePage)
        document.addEventListener("GameStarting",gameStarted)
        document.addEventListener("LobbyData",OnGetLobbyData)
        return ()=>{
            document.removeEventListener("LobbyLeft",goToHomePage)
            document.removeEventListener("GameStarting",gameStarted)
            document.removeEventListener("LobbyData",OnGetLobbyData)
        }
    })


    let lobbyData : LobbyData = {"client-id": "", "has-started": false,
        lobby: {id:"","host-id":"",name:""},
        members: [{id:"",color:"",name:""}]}
    let loadedData : boolean = false

    function OnGetLobbyData(e:Event){
        lobbyData = (e as CustomEvent).detail
        loadedData = true
    }
    function Exit(){
        sendMessage("LeaveLobby")
    }

</script>

<Header>
    <IconButton icon="exit_to_app" OnClick={Exit}/>
</Header>

{#if !lobbyData["has-started"]}
    <div class="min-w-fit max-w-[95%] w-[50rem] mx-auto">
        {#if loadedData}
            <WaitingLobby sendMessage={sendMessage} lobbyData={lobbyData}/>
        {/if}
    </div>
    <Footer/>
{/if}

{#if lobbyData["has-started"]}
    <GameLobby sendMessage={sendMessage} lobbyData={lobbyData}/>
{/if}