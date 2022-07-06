<script lang="ts">
    import KeyButton from "../style/KeyButton.svelte";
    export let isEnterDisabled = false
    export let KeyBoardClasses = {}

    let firstRow : string[] = ["Q","W","E","R","T","Y","U","I","O","P"]
    let secondRow : string[] = ["A","S","D","F","G","H","J","K","L"]
    let thirdRow : string[] = ["Z","X","C","V","B","N","M"]

</script>
<div class="select-none">
    <div class="mt-4 flex">
        {#each firstRow as key}
        <KeyButton key={key} Class={KeyBoardClasses[key]}/>
        {/each}
    </div>

    <div class="mt-1 flex">
        {#each secondRow as key}
            <KeyButton key={key} Class={KeyBoardClasses[key]}/>
        {/each}
        <KeyButton icon="backspace" key="Backspace"/>
    </div>

    <div class="mt-1 flex">
        <div class="flex-grow-[0.75]"></div>
        {#each thirdRow as key}
            <KeyButton key={key} Class={KeyBoardClasses[key]}/>
        {/each}
        <KeyButton icon="keyboard_return" key="Enter" disabled={isEnterDisabled} Class="flex-grow-[1.50] {isEnterDisabled ? 'enabled:text-white' : 'bg-blue-600 dark:enabled:bg-blue-700 enabled:hover:bg-blue-700 dark:enabled:hover:bg-blue-600 enabled:text-white'} "/>
        <div class="flex-grow-[0.75]"></div>
    </div>
</div>