<script lang="ts">
    $: darkMode = () : string => {

        return 'dark'
    }
</script>

<div class="{darkMode()}">
    <div class="absolute h-full w-full -z-10 top-0 bg-primary-100 dark:bg-zinc-900"></div>
    <slot/>
</div>