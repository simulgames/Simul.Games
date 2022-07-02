<script lang="ts">
    import KeyButton from "../style/KeyButton.svelte";
    export let isEnterDisabled = false
</script>
<div class="select-none">
    <div class="mt-4 flex">
        <KeyButton key="q"/>
        <KeyButton key="w"/>
        <KeyButton key="e"/>
        <KeyButton key="r"/>
        <KeyButton key="t"/>
        <KeyButton key="y"/>
        <KeyButton key="u"/>
        <KeyButton key="i"/>
        <KeyButton key="o"/>
        <KeyButton key="p"/>
    </div>

    <div class="mt-1 flex">
        <KeyButton key="a"/>
        <KeyButton key="s"/>
        <KeyButton key="d"/>
        <KeyButton key="f"/>
        <KeyButton key="g"/>
        <KeyButton key="h"/>
        <KeyButton key="j"/>
        <KeyButton key="k"/>
        <KeyButton key="l"/>
        <KeyButton icon="backspace" key="Backspace"/>
    </div>

    <div class="mt-1 flex">
        <div class="flex-grow-[0.75]"></div>
        <div class="flex-grow">
            <KeyButton key="z"/>
        </div>
        <div class="flex-grow">
            <KeyButton key="x"/>
        </div>
        <div class="flex-grow">
            <KeyButton key="c"/>
        </div>
        <div class="flex-grow">
            <KeyButton key="v"/>
        </div>
        <div class="flex-grow">
            <KeyButton key="b"/>
        </div>
        <div class="flex-grow">
            <KeyButton key="n"/>
        </div>
        <div class="flex-grow">
            <KeyButton key="m"/>
        </div>
        <div class="flex-grow-[1.50]">
            <KeyButton icon="keyboard_return" key="Enter" disabled={isEnterDisabled}/>
        </div>
        <div class="flex-grow-[0.75]"></div>
    </div>
</div>