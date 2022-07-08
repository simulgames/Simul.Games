<script lang="ts">
    export let disabled: Boolean = false
    export let text: string = ""
    export let icon: string | null = null
    export let OnClick: (event: InputEvent) => void | null = null
</script>

<button
    class="focus:shadow-outline w-full min-w-[50%] rounded py-2 px-4 font-bold text-white focus:outline-none enabled:bg-blue-500 enabled:shadow-lg enabled:hover:bg-blue-700 disabled:bg-gray-400
                dark:enabled:bg-blue-700 dark:enabled:hover:bg-blue-800 dark:disabled:bg-zinc-600"
    type="button"
    {disabled}
    on:click={OnClick}>
    {text}
    {#if icon != null}
        <span class="material-icons text-sm">
            {icon}
        </span>
    {/if}
</button>
