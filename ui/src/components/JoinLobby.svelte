<script lang="ts">
    import {type SendMessage} from "../scripts/WebSocket";

    export let sendMessage : SendMessage
    import LobbyCodeInput from "./subcomponents/LobbyCodeInput.svelte";
    import UsernameInput from "./subcomponents/UsernameInput.svelte";

    let Username = ""
    let LobbyCode = ""
    $: disabled = (Username === "" || LobbyCode === "")
</script>

<div class="w-full bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
    <form>
        <div class="mb-4">
            <LobbyCodeInput ValidLobbyCode={LobbyCode} sendMessage={sendMessage}/>
        </div>
        <div class="mb-4">
            <UsernameInput Username={Username}/>
        </div>
        <div class="flex items-center justify-between">
            <button
                    class="disabled:bg-gray-400 enabled:bg-blue-500 enabled:hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline min-w-[25%]"
                    type="button"
                    {disabled}
                    >
                JOIN
                <span class="material-icons text-sm">
                    connect_without_contact
                </span>
            </button>
            <span class="text-xs">
                By pressing JOIN you agree to our
                <a class="inline-block align-baseline  text-blue-500 hover:text-blue-800" href="tos">
                    Terms of Service
                </a>
            </span>
        </div>
    </form>
</div>