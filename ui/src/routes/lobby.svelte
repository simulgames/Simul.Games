<script lang="ts">
    import "../app.css";
    import Header from "../components/Header.svelte"
    import Footer from "../components/Footer.svelte"
    import WaitingLobby from "../components/WaitingLobby.svelte";
    let inGame = false
    import {BuildWebSocket,type SendMessage} from "../scripts/WebSocket"
    let sendMessage : SendMessage = null
    import {onMount} from "svelte";
    onMount(()=>{
        sendMessage = BuildWebSocket()
        sendMessage("GetLobbyDataInternal")
    })

</script>

<Header/>

{#if !inGame}
    <div class="min-w-fit max-w-[95%] w-[50rem] mx-auto">
        <WaitingLobby sendMessage={sendMessage}/>
    </div>
    <Footer/>
{/if}