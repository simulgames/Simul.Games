<script lang="ts">
    import IconButton from "../style/IconButton.svelte"
    import { DarkMode } from "$lib/DarkMode"

    function ToggleDarkMode() {
        DarkMode.set(!$DarkMode)
    }
</script>

<IconButton OnClick={ToggleDarkMode}>
    <span class="inline dark:hidden"> light_mode </span>
    <span class="hidden dark:inline"> dark_mode </span>
</IconButton>
