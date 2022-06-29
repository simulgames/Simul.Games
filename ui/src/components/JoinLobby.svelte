<script lang="ts">
    let LobbyCodeClass=""
    let LobbyHelperText="Lobby Not Found!"
    let LobbyCode = ""
    let Username = ""
    let disabled = true

    const lobbyCodeInput = e => {
        LobbyCode = MaxLength(NumbersOnly(e.target.value),6)
    }

    const usernameInput = e => {
        Username = MaxLength(e.target.value,10).toUpperCase()
    }

    function NumbersOnly(value:string) : string{
        return value.replace(/\D/g, '');
    }

    function MaxLength(value:string,length:number) : string{
        return value.substring(0,length)
    }

</script>

<style>
    .lobbyFound{

    }
    .lobbyNotFound{

    }
</style>

<div class="w-full bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
    <form>
        <div class="mb-4">
            <label class="block text-gray-700 text-sm font-bold mb-2" for="lobbycode">
                Lobby Code
            </label>
            <div class="shadow  border rounded w-full {LobbyCodeClass}  text-gray-700 leading-tight  focus:shadow-outline relative">
                <input
                        class="appearance-none focus:outline-none bg-transparent py-2 px-3 w-full h-full"
                        id="lobbycode"
                        placeholder="LOBBY CODE"
                        type="tel"
                        bind:value={LobbyCode}
                        on:input={lobbyCodeInput}
                />
                <p class="text-red-500 text-xs italic text-right absolute bottom-0 right-1 select-none pointer-events-none">{LobbyHelperText}</p>
            </div>
        </div>
        <div class="mb-4">
            <label class="block text-gray-700 text-sm font-bold mb-2" for="username">
                Your Name
            </label>
            <input
                    class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
                    id="username"
                    placeholder="YOUR NAME"
                    bind:value={Username}
                    on:input={usernameInput}
            />
        </div>
        <div class="flex items-center justify-between">
            <button
                    class="disabled:bg-gray-400 enabled:bg-blue-500 enabled:hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline min-w-[25%]"
                    type="button"
                    {disabled}>
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