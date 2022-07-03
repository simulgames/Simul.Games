<script lang="ts">
    export let disabled : Boolean = false
    export let text : string = ""
    export let icon : string | null = null
    export let OnClick : (event : InputEvent) => void | null = null
</script>


<button
        class="w-full disabled:bg-gray-400 enabled:bg-blue-500 enabled:hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline min-w-[50%]
                dark:disabled:bg-zinc-600 dark:enabled:bg-blue-700 dark:enabled:hover:bg-blue-800"
        type="button"
        {disabled}
        on:click={OnClick}
>
    {text}
    {#if icon != null}
        <span class="material-icons text-sm">
            {icon}
        </span>
    {/if}
</button>