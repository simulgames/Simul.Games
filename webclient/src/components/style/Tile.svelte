<script>
    export let character = ""
    export let Class = ""
</script>

<div
    class="mx-auto aspect-square w-full max-w-[10vh] flex-grow select-none text-primary-600 {Class} relative">
    <span
        class="absolute bottom-0 right-0 top-0 left-0 m-auto h-[min-content] text-center">
        {character}
    </span>
</div>
