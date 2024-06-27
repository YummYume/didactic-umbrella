<script lang="ts">
    import { mode, setMode } from 'mode-watcher';
    import { fade } from 'svelte/transition';

    import * as Tooltip from '$lib/components/ui/tooltip';

    import IconMoon from '~icons/lucide/moon';
    import IconSun from '~icons/lucide/sun';

    import Button from './ui/button/button.svelte';

    const switchLabels = {
        dark: 'Basculer en thème clair',
        light: 'Basculer en thème sombre',
    };
</script>

<Tooltip.Root>
    <Tooltip.Trigger asChild let:builder
        ><Button
            aria-label="{$mode ? switchLabels[$mode] : "Basculer le thème de l'application"}"
            aria-pressed="{$mode === 'dark'}"
            builders="{[builder]}"
            onclick="{() => {
                setMode($mode === 'dark' ? 'light' : 'dark');
            }}"
            size="icon"
            variant="ghost"
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
        </Button></Tooltip.Trigger
    >
    <Tooltip.Content>
        <p>{$mode ? switchLabels[$mode] : "Basculer le thème de l'application"}</p>
    </Tooltip.Content>
</Tooltip.Root>
