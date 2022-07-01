<script lang="ts">
    import {type SendMessage} from "../scripts/WebSocket";

    export let sendMessage : SendMessage
    import LobbyCodeInput from "./subcomponents/LobbyCodeInput.svelte";
    import UsernameInput from "./subcomponents/UsernameInput.svelte";
    import Button from "./style/Button.svelte";

    export let Username = ""
    let LobbyCode = ""
    $: isButtonDisabled = (Username === "" || LobbyCode === "")
</script>

<form>
    <div class="mb-4">
        <UsernameInput bind:Username={Username}/>
    </div>
    <div class="mb-4">
        <LobbyCodeInput ValidLobbyCode={LobbyCode} sendMessage={sendMessage}/>
    </div>
    <div class="flex items-center justify-center">
        <Button disabled={isButtonDisabled} icon="connect_without_contact" text="JOIN"/>
    </div>
</form>