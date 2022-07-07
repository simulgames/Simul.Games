<script lang="ts">
    import {SendMessage} from "../../scripts/WebSocket";
    import {onMount} from "svelte";
    import Input from "../style/Input.svelte";

    export let ValidLobbyCode : string
    let LobbyCode = ""

    let LobbyHelperText=""
    let LobbyInputClass=""
    let QueriedLobbyCode=""

    function lobbyCodeInput(e) {
        LobbyCode = NumbersOnly(e.target.value).substring(0,6)
        if(LobbyCode.length == 6 && LobbyCode != QueriedLobbyCode){
            SendMessage("GetLobbyDataExternal",{code:LobbyCode})
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
        let lobbyCode = msg["lobby"]
        if(lobbyCode == QueriedLobbyCode){
            LobbyHelperText = msg["status"]
            LobbyInputClass="valid"
            ValidLobbyCode = QueriedLobbyCode
        }
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

<Input Label="Lobby Code" ID="lobbycode" bind:Value={LobbyCode} OnInput={lobbyCodeInput} HelperText={LobbyHelperText} bind:Style={LobbyInputClass}/>