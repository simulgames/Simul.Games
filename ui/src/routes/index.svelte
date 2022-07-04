<script lang="ts">
    import Header from "../components/Header.svelte"
    import Footer from "../components/Footer.svelte"
    import JoinLobby from "../components/JoinLobby.svelte"
    import {onMount} from "svelte";
    import { goto } from "$app/navigation"
    import CreateLobby from "../components/CreateLobby.svelte";
    import Card from "../components/style/Card.svelte";

    function goToLobbyPage(){
        goto("/lobby")
    }

    onMount(()=>{
        document.addEventListener("LobbyJoined",goToLobbyPage)
        return ()=>{
            document.removeEventListener("LobbyJoined",goToLobbyPage)
        }
    })
    let Username = ""
</script>

<Header/>

<div class="min-w-fit max-w-[95%] w-[30rem] mx-auto">
    <Card>
        <JoinLobby bind:Username={Username}/>
    </Card>
    <Card>
        <CreateLobby bind:Username={Username}/>
    </Card>
</div>

<Footer/>