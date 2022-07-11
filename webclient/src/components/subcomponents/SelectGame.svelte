<script lang="ts">
    import Input from "../style/Input.svelte"

    export let GameSelected = ""
</script>

<Input
    ID="select-game"
    Label="Select Game"
    List="games"
    bind:Value={GameSelected}>
    <option value="Word Duel" />
</Input>
