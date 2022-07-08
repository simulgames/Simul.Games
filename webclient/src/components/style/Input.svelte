<script lang="ts">
    export let ID: string = ""
    export let Label: string = ""
    export let Value: string = ""
    export let OnInput: (event: InputEvent) => void | null = null
    export let HelperText: string | null = null
    export let List: string | null = null
    export let Style: string | null = null
</script>

<label
    class="mb-2 block text-sm font-bold text-gray-700 dark:text-white"
    for={ID}>
    {Label}
</label>

<div
    class="focus:shadow-outline relative w-full rounded  border  leading-tight shadow dark:border-zinc-400 {Style}">
    <input
        class="h-full w-full appearance-none bg-transparent py-2 px-3 text-gray-700 focus:outline-none dark:text-white"
        placeholder={Label.toUpperCase()}
        bind:value={Value}
        on:input={OnInput}
        id={ID}
        list={List} />
    {#if List != null}
        <datalist id={List}>
            <slot />
        </datalist>
    {/if}
    {#if HelperText != null}
        <p
            class="pointer-events-none absolute bottom-0 right-1 select-none text-right text-xs italic"
            title="helper text">
            {HelperText}
        </p>
    {/if}
</div>

<style>
    .invalid {
        border-color: red;
        color: red;
    }
    .valid {
        border-color: green;
        color: green;
    }
</style>
