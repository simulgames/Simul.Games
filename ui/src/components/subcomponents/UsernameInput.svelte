<script lang="ts">
    export let Username : string

    const usernameInput = e => {
        Username = e.target.value.substring(0,10).toUpperCase()
    }
</script>

<label class="block text-gray-700 text-sm font-bold mb-2" for="username">
    Your Name
</label>
<input
        required
        class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
        id="username"
        placeholder="YOUR NAME"
        bind:value={Username}
        on:input={usernameInput}
/>