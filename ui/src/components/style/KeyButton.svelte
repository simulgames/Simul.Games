<script lang="ts">
    export let key = ''
    export let icon: string = ''
    function pressKey(){
        let keyboardEvent = new KeyboardEvent('keydown',{
            key: key
        })
        document.dispatchEvent(keyboardEvent)
    }
    export let disabled = false
</script>

<button class=" border-slate-300 border-2 bg-white shadow-md rounded w-full flex-grow
        hover:bg-slate-100 hover:border-slate-500 relative h-16"
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