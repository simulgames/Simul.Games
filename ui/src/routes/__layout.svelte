<svelte:head>
    <script>
        let override = ('override-browser-dark-mode' in localStorage)
        let defaultMode = (window.matchMedia('(prefers-color-scheme: dark)').matches)
        if(override ^ defaultMode){
            document.documentElement.classList.add('dark')
        }
        else {
            document.documentElement.classList.remove('dark')
        }
    </script>
</svelte:head>

<div>
    <div class="absolute h-full w-full -z-10 top-0 bg-primary-100 dark:bg-zinc-900"></div>
    <slot/>
</div>