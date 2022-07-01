<script lang="ts">
    import Input from "../style/Input.svelte";

    export let Username : string

    const usernameInput = e => {
        console.log("hello")
        Username = e.target.value.substring(0,10).toUpperCase()
    }
</script>

<Input Label="Your Name" ID="username" bind:Value={Username} OnInput={usernameInput}/>