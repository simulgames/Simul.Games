<script lang="ts">
    import "../app.css";
    import Header from "../components/Header.svelte"
    import Footer from "../components/Footer.svelte"
    import JoinLobby from "../components/JoinLobby.svelte"
    import {onMount} from "svelte";
    import {BuildWebSocket,type SendMessage} from "../scripts/WebSocket"
    let sendMessage : SendMessage = null
    onMount(()=>{
        sendMessage = BuildWebSocket()
    })
</script>

<Header/>

<div class="min-w-fit max-w-[95%] w-[30rem] mx-auto">
    <JoinLobby sendMessage={sendMessage}/>
</div>
<Footer/>