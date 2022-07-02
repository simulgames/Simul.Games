<script>
    import { onMount} from "svelte";

    export let character = ""
    export let style = ""
    let show = false
    onMount(() => {
        show = true
    })
</script>

<style>

    @keyframes flip {
        from {
            transform: rotateX(180deg);
        }
    }
    @keyframes result-color {
        to{
            color: var(--color-to-transition-to);
            background-color: var(--bg-color-to-transition-to);
        }
    }

    .tile-with-result{
        animation: result-color 0.4s forwards steps(1), flip 0.45s;
        --color-to-transition-to: white;
    }

    .no-letter{
        --bg-color-to-transition-to: #787c7e;
    }

    .has-letter {
        --bg-color-to-transition-to: #c9b458;
    }

    .has-letter-at-space {
        --bg-color-to-transition-to: #6aaa64;
    }

</style>

<div class="select-none w-full bg-white text-primary-600 shadow-md rounded mx-auto min-w-[2rem] max-w-[10vh] aspect-square flex-grow {style} relative">
    <span class="absolute bottom-0 right-0 top-0 left-0 font-bold font-serif text-center text-3xl m-auto h-[min-content]">
        {character}
    </span>
</div>