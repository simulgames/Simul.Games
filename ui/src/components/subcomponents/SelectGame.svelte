<script lang="ts">
    import Input from "../style/Input.svelte";
    export let GameSelected: string = ""
</script>

<Input ID="selectgame" Label="Select Game" List="games" bind:Value={GameSelected}>
    <option value="Word Duel"></option>
</Input>