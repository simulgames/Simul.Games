<script lang="ts">
    import DarkModeIcon from "./subcomponents/DarkModeIcon.svelte"
</script>

<div
    class="mb-2 flex select-none justify-between bg-primary-800 py-2 px-[5%] font-mono text-xl font-bold italic shadow-lg lg:px-10">
    <a href="/"><h5 class="text-primary-50">simul.games</h5></a>
    <div>
        <DarkModeIcon />
        <slot />
    </div>
</div>
