<script lang="ts">
    import { mode, setMode } from 'mode-watcher';
    import { fade } from 'svelte/transition';

    import IconMoon from '~icons/tabler/moon-filled';
    import IconSun from '~icons/tabler/sun-filled';
</script>

<button
    aria-label="Switch to dark mode"
    aria-pressed="{$mode === 'dark'}"
    type="button"
    class="rounded-full bg-indigo-600 p-2 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
    onclick="{() => {
        setMode($mode === 'dark' ? 'light' : 'dark');
    }}"
>
    {#key $mode}
        <span aria-hidden="true" in:fade>
            {#if $mode === 'dark'}
                <IconMoon class="size-6" />
            {:else}
                <IconSun class="size-6" />
            {/if}
        </span>
    {/key}
</button>
