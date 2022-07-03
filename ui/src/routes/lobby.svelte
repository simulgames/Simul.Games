<script lang="ts">
    import "../app.css";
    import Header from "../components/Header.svelte"
    import Footer from "../components/Footer.svelte"
    import WaitingLobby from "../components/WaitingLobby.svelte";
    let inGame = false
    import {SendMessage} from "../scripts/WebSocket"
    import {onMount} from "svelte";
    import { goto } from "$app/navigation"

    function goToHomePage(){
        goto("/")
    }

    onMount(()=>{
        SendMessage("UserLocation")
        SendMessage("GetLobbyDataInternal")
        document.addEventListener("LobbyLeft",goToHomePage)
        return ()=>{
            document.removeEventListener("LobbyLeft",goToHomePage)
        }
    })

</script>

<Header/>

{#if !inGame}
    <div class="min-w-fit max-w-[95%] w-[50rem] mx-auto">
        <WaitingLobby/>
    </div>
    <Footer/>
{/if}