<svelte:head>
    <script>
        let override = ('override-browser-dark-mode' in localStorage)
        let defaultMode = (window.matchMedia('(prefers-color-scheme: dark)').matches)
        if(override !== defaultMode){
            document.documentElement.classList.add('dark')
        }
        else {
            document.documentElement.classList.remove('dark')
        }
    </script>
</svelte:head>

<script lang="ts">
    import {DarkMode} from "../scripts/DarkMode";
    import {onMount} from "svelte";
    onMount(()=>{

        function localStorageOverride() : boolean{
            return ('override-browser-dark-mode' in localStorage)
        }
        function BrowserPrefersDarkMode() : boolean{
            return window.matchMedia('(prefers-color-scheme: dark)').matches
        }
        let initialValue : boolean = BrowserPrefersDarkMode() !== localStorageOverride()
        DarkMode.set(initialValue)
        DarkMode.subscribe( (value:boolean)=>{
            console.log("changing dark mode!")
            if(value == BrowserPrefersDarkMode()){
                localStorage.removeItem('override-browser-dark-mode')
            } else {
                localStorage.setItem('override-browser-dark-mode','1')
            }

            if(value){
                console.log("updating dark to on")
                document.documentElement.classList.add('dark')
            } else {
                console.log("updating dark to off")
                document.documentElement.classList.remove('dark')
            }
        })
    })
</script>

<div>
    <div class="absolute h-full w-full -z-10 top-0 bg-primary-100 dark:bg-zinc-900"></div>
    <slot/>
</div>