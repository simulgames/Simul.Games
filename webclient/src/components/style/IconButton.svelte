<script lang="ts">
    export let OnClick: (event: Event) => void = null
</script>

<button class="material-icons text-white" on:click={OnClick}>
    <slot />
</button>
