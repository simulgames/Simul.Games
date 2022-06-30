<script lang="ts">

    import UsernameInput from "./subcomponents/UsernameInput.svelte";
    import SelectGame from "./subcomponents/SelectGame.svelte";
    import Button from "./style/Button.svelte";
    export let Username = ""
    export let GameSelected = ""
    $: isButtonDisabled = (Username.length == 0 || GameSelected.length == 0)
</script>

<form>
    <div class="mb-4">
        <UsernameInput bind:Username={Username}/>
    </div>
    <div class="mb-4">
        <SelectGame bind:GameSelected={GameSelected}/>
    </div>
    <div class="flex items-center justify-center">
        <Button text="HOST" icon="emoji_people" disabled={isButtonDisabled}/>
    </div>
</form>