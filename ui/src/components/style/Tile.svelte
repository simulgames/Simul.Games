<script>
    import { onMount} from "svelte";

    export let character = ""
    export let style = ""
    let show = false
    onMount(() => {
        show = true
    })
</script>

<div class="select-none w-full bg-white text-primary-600 shadow-md rounded mx-auto min-w-[2rem] max-w-[10vh] aspect-square flex-grow {style} relative">
    <span class="absolute bottom-0 right-0 top-0 left-0 font-bold font-serif text-center text-3xl m-auto h-[min-content]">
        {character}
    </span>
</div>