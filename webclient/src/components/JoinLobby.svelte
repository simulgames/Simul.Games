<script lang="ts">
    import { SendMessage } from "$lib/WebSocket"

    import LobbyCodeInput from "./subcomponents/LobbyCodeInput.svelte"
    import UsernameInput from "./subcomponents/UsernameInput.svelte"
    import Button from "./style/Button.svelte"

    export let Username = ""
    let LobbyCode = ""
    $: isButtonDisabled = Username === "" || LobbyCode === ""

    function sendJoinRequest() {
        if (!isButtonDisabled) {
            SendMessage("JoinLobby", { code: LobbyCode, Name: Username })
        }
    }
</script>

<form>
    <div class="mb-4">
        <UsernameInput bind:Username />
    </div>
    <div class="mb-4">
        <LobbyCodeInput bind:ValidLobbyCode={LobbyCode} />
    </div>
    <div class="flex items-center justify-center">
        <Button
            disabled={isButtonDisabled}
            icon="connect_without_contact"
            text="JOIN"
            OnClick={sendJoinRequest} />
    </div>
</form>
