<script lang="ts">
    import DarkModeIcon from "./subcomponents/DarkModeIcon.svelte";
</script>

<div class="py-2 mb-2 font-mono font-bold italic text-xl px-10 shadow-lg bg-primary-800 flex justify-between">
    <h5 class="text-primary-50">simul.games</h5>
    <slot/>
    <DarkModeIcon/>
</div>