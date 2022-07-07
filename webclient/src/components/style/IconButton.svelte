<script lang="ts">
    export let OnClick : (event : Event) => void = null
</script>

<button class="text-white material-icons" on:click={OnClick}>
    <slot/>
</button>