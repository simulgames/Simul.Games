<script lang="ts">
    export let key = ""
    export let icon = ""
    function pressKey() {
        let keyboardEvent = new KeyboardEvent("keydown", {
            key: key,
        })
        document.dispatchEvent(keyboardEvent)
    }
    export let Class = ""
    export let disabled = false
</script>

<button
    class="relative h-[3rem] flex-grow rounded border-2 bg-white text-primary-700
        dark:border-zinc-800
        dark:bg-zinc-700
        dark:text-white
        {disabled
        ? 'bg-gray-400 text-white dark:text-zinc-400 dark:enabled:border-zinc-900 dark:enabled:bg-zinc-800'
        : ' border-slate-300 shadow-md hover:border-slate-500 hover:bg-slate-100 dark:hover:bg-zinc-600'}
        {Class}"
    on:click={pressKey}>
    <span
        class="{icon !== '' ? 'material-icons' : 'font-bold'}
    absolute bottom-0 right-0 left-0 top-0 m-auto h-[min-content] text-center
    text-xl
    sm:text-2xl
    lg:text-3xl">
        {icon !== "" ? icon : key.toUpperCase()}
    </span>
</button>
