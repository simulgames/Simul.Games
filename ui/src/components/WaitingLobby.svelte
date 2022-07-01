<script lang="ts">

    import Card from "./style/Card.svelte";
    import Button from "./style/Button.svelte";
    import Avatar from "./style/Avatar.svelte";
    import LobbyHost from "./style/icons/LobbyHost.svelte";

    let hostName = "James'"
    let gameName = "Word Duel"
    let lobbyCode = "123456"

</script>

<style>
    .grid-columns{
        grid-template-columns: repeat(auto-fill,10rem);
    }
</style>

<div class="select-none">
    <Card>
        <h1 class="text-xl text-primary-700 font-bold font-serif">{hostName} Lobby</h1>
        <div class="flex justify-between">
            <div>
                <span class="material-icons text-sm text-primary-700">
                    key
                </span>
                <span class="font-mono text-sm">{lobbyCode}</span>
            </div>
            <span class="text-primary-700 font-serif text-lg">
                Playing <i>{gameName}</i>
            </span>
        </div>
        <hr class="mb-5">
        <ul class="inline-grid justify-between w-full grid-columns">
            <li>
                <Avatar>
                    <LobbyHost fill="#3B82F6"/>
                </Avatar>
            </li>
        </ul>
        <hr class="mt-5">
        <div class="flex justify-between p-3">
            <div class="flex-[0.25] w-full">
                <Button text="LEAVE" icon="logout"/>
            </div>
            <div class="flex-[0.25] w-full">
                <Button text="START" icon="play_arrow"/>
            </div>
        </div>
    </Card>
</div>