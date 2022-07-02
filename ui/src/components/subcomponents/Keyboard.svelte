<script lang="ts">
    import KeyButton from "../style/KeyButton.svelte";
    export let isEnterDisabled = false
</script>
<div class="select-none text-center">

    <div class="mt-4">
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
    <div class="mt-1">
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
    <div class="mt-1">
        <div class="w-4"></div>
        <KeyButton key="z"/>
        <KeyButton key="x"/>
        <KeyButton key="c"/>
        <KeyButton key="v"/>
        <KeyButton key="b"/>
        <KeyButton key="n"/>
        <KeyButton key="m"/>
        <KeyButton icon="keyboard_return" key="Enter" width="w-20" disabled={isEnterDisabled}/>
    </div>
</div>