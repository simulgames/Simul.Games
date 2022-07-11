<script lang="ts">
    import Header from "../components/Header.svelte"
    import Footer from "../components/Footer.svelte"
    import WaitingLobby from "../components/WaitingLobby.svelte"
    import { SendMessage } from "../scripts/WebSocket"
    import { onMount } from "svelte"
    import { goto } from "$app/navigation"
    import { type LobbyData } from "../types/LobbyData"
    import GameLobby from "../components/GameLobby.svelte"
    import IconButton from "../components/style/IconButton.svelte"
    import { replaceStateWithQuery } from "../scripts/ReplaceStateWithQuery"
    function goToHomePage() {
        goto("/")
    }
    function addLobbyParam(id: string) {
        replaceStateWithQuery({ id: id })
    }
    function gameStarted() {
        lobbyData["has-started"] = true
    }
    function goToHomePageIfNotInLobby(e: Event) {
        let userLocation = (e as CustomEvent).detail
        if (userLocation["inLobby"] == "false") {
            goToHomePage()
        }
    }
    onMount(() => {
        SendMessage("UserLocation")
        SendMessage("GetLobbyDataInternal")
        document.addEventListener("LobbyLeft", goToHomePage)
        document.addEventListener("UserLocation", goToHomePageIfNotInLobby)
        document.addEventListener("GameStarting", gameStarted)
        document.addEventListener("LobbyData", OnGetLobbyData)
        document.addEventListener("MemberJoined", OnMemberJoined)
        document.addEventListener("MemberLeft", OnMemberLeft)
        return () => {
            document.removeEventListener("LobbyLeft", goToHomePage)
            document.removeEventListener("GameStarting", gameStarted)
            document.removeEventListener(
                "UserLocation",
                goToHomePageIfNotInLobby
            )
            document.removeEventListener("LobbyData", OnGetLobbyData)
            document.removeEventListener("MemberJoined", OnMemberJoined)
            document.removeEventListener("MemberLeft", OnMemberLeft)
        }
    })
    let lobbyData: LobbyData = {
        "client-id": "",
        "has-started": false,
        lobby: { id: "", "host-id": "", name: "" },
        members: [{ id: "", color: "", name: "" }],
    }
    let loadedData = false
    function OnGetLobbyData(e: Event) {
        lobbyData = (e as CustomEvent).detail
        addLobbyParam(lobbyData.lobby.id)
        loadedData = true
    }
    function OnMemberJoined() {
        SendMessage("GetLobbyDataInternal") // todo - this is lazy, but for feature parity, this is the best approach for now
    }
    function OnMemberLeft() {
        SendMessage("GetLobbyDataInternal") // todo - this is lazy, but for feature parity, this is the best approach for now
    }
    function Exit() {
        SendMessage("LeaveLobby")
    }
</script>

<Header>
    <IconButton OnClick={Exit}>exit_to_app</IconButton>
</Header>

{#if !lobbyData["has-started"]}
    <div class="mx-auto w-[50rem] min-w-fit max-w-[95%]">
        {#if loadedData}
            <WaitingLobby {lobbyData} />
        {/if}
    </div>
    <Footer />
{/if}

{#if lobbyData["has-started"]}
    <GameLobby {lobbyData} />
{/if}
