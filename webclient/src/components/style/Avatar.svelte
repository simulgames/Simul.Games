<script>
    import DefaultAvatar from "./icons/DefaultAvatar.svelte"
    export let fill = "grey"
</script>

<div class="relative w-full select-none">
    <DefaultAvatar {fill} />
    <span class="absolute bottom-1.5 right-1.5 w-[25%]">
        <slot />
    </span>
</div>
