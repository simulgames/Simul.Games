<script lang="ts">
    import { type LobbyData } from "../types/LobbyData"
    import { SendMessage } from "../scripts/WebSocket"
    export let lobbyData: LobbyData

    import Card from "./style/Card.svelte"
    import Button from "./style/Button.svelte"
    import Avatar from "./style/Avatar.svelte"
    import LobbyHost from "./style/icons/LobbyHost.svelte"

    let showKey = true
    let gameName = "Word Duel"

    $: keyIcon = showKey ? "key" : "key_off"
    $: formattedLobbyCode =
        showKey && lobbyData
            ? `${lobbyData.lobby.id.substring(
                  0,
                  3
              )}-${lobbyData.lobby.id.substring(3)}`
            : "•••-•••"

    function leaveLobby() {
        SendMessage("LeaveLobby")
    }
    function startGame() {
        SendMessage("StartGame")
    }
</script>

<div class="select-none">
    <Card>
        <h1 class="font-serif text-xl font-bold">{lobbyData.lobby.name}</h1>
        <div class="flex justify-between">
            <button
                on:click={() => {
                    showKey = !showKey
                }}>
                <span class="material-icons text-sm ">{keyIcon}</span>
                <span class="font-mono text-sm">{formattedLobbyCode}</span>
            </button>
            <span class="font-serif text-lg">
                Playing <i>{gameName}</i>
            </span>
        </div>
        <hr class="mb-5" />
        <ul class="grid-columns inline-grid w-full list-none justify-between">
            {#each lobbyData.members as member}
                <li class="text-center">
                    <Avatar fill={member.color}>
                        {#if member.id === lobbyData.lobby["host-id"]}
                            <LobbyHost fill="#3B82F6" />
                        {/if}
                    </Avatar>
                    <span
                        class="font-mono text-lg {member.id ===
                        lobbyData['client-id']
                            ? 'font-bold'
                            : ''}">{member.name}</span>
                </li>
            {/each}
        </ul>
        <hr class="mt-5" />
        <div class="flex justify-between p-3">
            <div class="w-full flex-[0.25]">
                <Button text="LEAVE" icon="logout" OnClick={leaveLobby} />
            </div>
            <div class="w-full flex-[0.25]">
                <!-- todo - change to a "READY" button for non hosts -->
                <Button
                    text="START"
                    icon="play_arrow"
                    disabled={lobbyData["client-id"] !==
                        lobbyData.lobby["host-id"]}
                    OnClick={startGame} />
            </div>
        </div>
    </Card>
</div>

<style>
    .grid-columns {
        grid-template-columns: repeat(auto-fill, 10rem);
    }
</style>
