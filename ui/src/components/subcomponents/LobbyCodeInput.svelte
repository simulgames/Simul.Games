<script lang="ts">
    import {type SendMessage} from "../../scripts/WebSocket";
    import {onMount} from "svelte";
    export let sendMessage : SendMessage

    export let ValidLobbyCode : string
    let LobbyCode = ""

    let LobbyHelperText=""
    let LobbyInputClass=""
    let QueriedLobbyCode=""

    const lobbyCodeInput = e => {
        LobbyCode = NumbersOnly(e.target.value).substring(0,6)

        if(LobbyCode.length == 6 && LobbyCode != QueriedLobbyCode){
            sendMessage("GetLobbyDataExternal",{code:LobbyCode})
            QueriedLobbyCode = LobbyCode
        }
        if(LobbyCode.length < 6){
            resetLobbyFound()
        }
    }

    function NumbersOnly(value:string) : string{
        return value.replace(/\D/g, '');
    }

    function resetLobbyFound(){
        QueriedLobbyCode=""
        LobbyHelperText=""
        LobbyInputClass=""
        ValidLobbyCode=""
    }

    function onLobbyFound(e:Event){
        let msg = (e as CustomEvent).detail
        LobbyHelperText = msg["status"]
        LobbyInputClass="valid"
        ValidLobbyCode = LobbyCode
    }


    function onLobbyNotFound(){
        LobbyHelperText = "Lobby Not Found!"
        LobbyInputClass="invalid"
        ValidLobbyCode=""
    }


    onMount(()=>{
        document.addEventListener("LobbyFound",onLobbyFound)
        document.addEventListener("LobbyNotFound",onLobbyNotFound)
        return () => {
            document.removeEventListener("LobbyFound",onLobbyFound)
            document.removeEventListener("LobbyNotFound",onLobbyNotFound)
        }
    })
</script>


<style>
    .invalid{
        border-color: red;
        color: red;
    }
    .valid{
        border-color: green;
        color: green;
    }
</style>

<label class="block text-gray-700 text-sm font-bold mb-2" for="lobbycode">
    Lobby Code
</label>
<div class="shadow  border rounded w-full {LobbyInputClass}  leading-tight  focus:shadow-outline relative">
    <input
            required
            class="appearance-none focus:outline-none bg-transparent py-2 px-3 w-full h-full text-gray-700"
            id="lobbycode"
            placeholder="LOBBY CODE"
            type="tel"
            bind:value={LobbyCode}
            on:input={lobbyCodeInput}
    />
    <p class="text-xs italic text-right absolute bottom-0 right-1 select-none pointer-events-none">{LobbyHelperText}</p>
</div>