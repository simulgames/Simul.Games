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
        enabled:hover:bg-slate-100 enabled:hover:border-slate-500 relative
        enabled:shadow-md
        enabled:border-slate-300
        disabled:bg-gray-400
        disabled:text-white
        {Class}"
        on:click={pressKey}
        {disabled}
    >
    <span class="{icon !== '' ? 'material-icons' : 'font-bold'}
    absolute bottom-0 right-0 left-0 top-0 m-auto text-center h-[min-content]
    text-xl
    sm:text-2xl
    lg:text-3xl">
        {icon !== '' ? icon : key.toUpperCase()}
    </span>
</button>