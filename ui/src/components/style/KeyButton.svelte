<script lang="ts">
    export let key = ''
    export let icon: string = ''
    function pressKey(){
        let keyboardEvent = new KeyboardEvent('keydown',{
            key: key
        })
        document.dispatchEvent(keyboardEvent)
    }
    export let Class = ""
    export let disabled = false
</script>

<button class="h-[3rem] border-2 bg-white rounded flex-grow
        relative
        dark:border-zinc-800
        dark:text-white
        {disabled ? 'dark:bg-zinc-800 dark:text-zinc-400 bg-gray-400 text-white' : 'bg-zinc-700 dark:hover:bg-zinc-600 border-slate-300 shadow-md hover:bg-slate-100 hover:border-slate-500'}
        {Class}"
        on:click={pressKey}
    >
    <span class="{icon !== '' ? 'material-icons' : 'font-bold'}
    absolute bottom-0 right-0 left-0 top-0 m-auto text-center h-[min-content]
    text-xl
    sm:text-2xl
    lg:text-3xl">
        {icon !== '' ? icon : key.toUpperCase()}
    </span>
</button>