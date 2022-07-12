<script lang="ts">
    import UsernameInput from "./subcomponents/UsernameInput.svelte"
    import SelectGame from "./subcomponents/SelectGame.svelte"
    import Button from "./style/Button.svelte"
    import { SendMessage } from "$lib/WebSocket"
    export let Username = ""
    export let GameSelected = ""

    function hostGame() {
        if (!isButtonDisabled) {
            let capitalizedHostName =
                Username[0].toUpperCase() + Username.substring(1).toLowerCase()
            let isLastLetterS =
                capitalizedHostName.charAt(Username.length - 1) === "s"
            let lobbyName = `${capitalizedHostName}'${
                isLastLetterS ? "" : "s"
            } Lobby`
            SendMessage("MakeLobby", {
                Lobby: { name: lobbyName, Game: GameSelected },
                Host: { Name: Username },
            })
        }
    }

    $: isButtonDisabled = Username.length == 0 || GameSelected.length == 0
</script>

<form>
    <div class="mb-4">
        <UsernameInput bind:Username />
    </div>
    <div class="mb-4">
        <SelectGame bind:GameSelected />
    </div>
    <div class="flex items-center justify-center">
        <Button
            text="HOST"
            icon="emoji_people"
            disabled={isButtonDisabled}
            OnClick={hostGame} />
    </div>
</form>
