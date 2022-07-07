<script lang="ts">
    export let ID : string = ""
    export let Label : string = ""
    export let Value : string = ""
    export let OnInput : (event : InputEvent) => void | null = null
    export let HelperText : string | null = null
    export let List : string | null = null
    export let Style : string | null = null
</script>

<label class="block text-gray-700 text-sm font-bold mb-2 dark:text-white" for={ID}>
    {Label}
</label>

<style>
    .invalid{
        border-color: red;
        color: red;
    }
    .valid{
        border-color: green;
        color: green;
    }
</style>

<div class="shadow border rounded w-full  leading-tight  focus:shadow-outline relative dark:border-zinc-400 {Style}">
    <input
            class="appearance-none focus:outline-none bg-transparent py-2 px-3 w-full h-full text-gray-700 dark:text-white"
            placeholder={Label.toUpperCase()}
            bind:value={Value}
            on:input={OnInput}
            id={ID}
            list={List}
    />
    {#if List != null}
    <datalist id={List}>
        <slot/>
    </datalist>
    {/if}
    {#if HelperText != null}
    <p class="text-xs italic text-right absolute bottom-0 right-1 select-none pointer-events-none" title="helper text">{HelperText}</p>
    {/if}
</div>