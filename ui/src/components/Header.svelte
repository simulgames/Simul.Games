<script lang="ts">
    import IconButton from "./style/IconButton.svelte";
    import {DarkMode} from "../scripts/DarkMode";

    function ToggleDarkMode(){
        DarkMode.set(!$DarkMode)
    }

    $: icon = () => {
        if ($DarkMode == undefined){
            return ''
        }
        return $DarkMode ? 'dark_mode' : 'light_mode'
    }
</script>

<div class="py-2 mb-2 font-mono font-bold italic text-xl px-10 shadow-lg bg-primary-800 flex justify-between">
    <h5 class="text-primary-50">simul.games</h5>
    <slot/>
    <IconButton icon={icon()} OnClick={ToggleDarkMode}></IconButton>
</div>