<script lang="ts">
    export let key = ''
    export let icon: string = ''
    export let width : string = 'w-12'
    function pressKey(){
        let keyboardEvent = new KeyboardEvent('keydown',{
            key: key
        })
        document.dispatchEvent(keyboardEvent)
    }
</script>

<button class=" border-slate-300 border-2 h-12 {width} bg-white shadow-md rounded mx-auto flex-grow text-3xl align-text-bottom
        hover:bg-slate-100 hover:border-slate-500
        {icon !== '' ? 'material-icons' : ''}"
        on:click={pressKey}
    >
    {icon !== '' ? icon : key.toUpperCase()}
</button>