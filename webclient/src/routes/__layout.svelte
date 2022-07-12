<script lang="ts">
    import { DarkMode } from "../scripts/DarkMode"
    import { onMount } from "svelte"
    import "../app.css"
    onMount(() => {
        function localStorageOverride(): boolean {
            return "override-browser-dark-mode" in localStorage
        }
        function BrowserPrefersDarkMode(): boolean {
            return window.matchMedia("(prefers-color-scheme: dark)").matches
        }
        let initialValue: boolean =
            BrowserPrefersDarkMode() !== localStorageOverride()
        DarkMode.set(initialValue)
        DarkMode.subscribe((value: boolean) => {
            if (value == BrowserPrefersDarkMode()) {
                localStorage.removeItem("override-browser-dark-mode")
            } else {
                localStorage.setItem("override-browser-dark-mode", "1")
            }
            if (value) {
                document.documentElement.classList.add("dark")
            } else {
                document.documentElement.classList.remove("dark")
            }
        })
    })
</script>

<svelte:head>
    <script>
        let override = "override-browser-dark-mode" in localStorage
        let defaultMode = window.matchMedia(
            "(prefers-color-scheme: dark)"
        ).matches
        if (override !== defaultMode) {
            document.documentElement.classList.add("dark")
        } else {
            document.documentElement.classList.remove("dark")
        }
    </script>
</svelte:head>

<slot />
