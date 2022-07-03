<script>
    export let character = ""
    export let style = ""
</script>

<div class="select-none w-full text-primary-600 mx-auto max-w-[10vh] aspect-square flex-grow {style} relative">
    <span class="absolute bottom-0 right-0 top-0 left-0 text-center m-auto h-[min-content]">
        {character}
    </span>
</div>