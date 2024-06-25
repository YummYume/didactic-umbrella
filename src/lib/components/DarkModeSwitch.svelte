<script lang="ts">
    import { mode, setMode } from 'mode-watcher';
    import { fade } from 'svelte/transition';

    import IconMoon from '~icons/lucide/moon';
    import IconSun from '~icons/lucide/sun';

    import Button from './ui/button/button.svelte';
</script>

<Button
    aria-label="Switch to dark mode"
    aria-pressed="{$mode === 'dark'}"
    onclick="{() => {
        setMode($mode === 'dark' ? 'light' : 'dark');
    }}"
    size="icon"
    variant="link"
>
    {#key $mode}
        <span aria-hidden="true" in:fade>
            {#if $mode === 'dark'}
                <IconMoon class="size-4" />
            {:else}
                <IconSun class="size-4" />
            {/if}
        </span>
    {/key}
</Button>
