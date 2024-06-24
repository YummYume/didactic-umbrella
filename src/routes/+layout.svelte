<script>
    import '../app.scss';

    import { mode, ModeWatcher } from 'mode-watcher';
    import { toast, Toaster } from 'svelte-sonner';
    import { getFlash } from 'sveltekit-flash-message';

    import { onNavigate } from '$app/navigation';
    import { page } from '$app/stores';

    import DarkModeSwitch from '$components/DarkModeSwitch.svelte';

    const flash = getFlash(page);
    const { children } = $props();

    $effect(() => {
        if ($flash) {
            toast[$flash.type]($flash.message);

            $flash = undefined;
        }
    });

    onNavigate((navigation) => {
        if (!document.startViewTransition) {
            return Promise.resolve();
        }

        return new Promise((resolve) => {
            document.startViewTransition(async () => {
                resolve();

                await navigation.complete;
            });
        });
    });
</script>

<svelte:head>
    {#key $page.data.seo}
        {#if $page.data.seo?.title}
            <title>{$page.data.seo.title}</title>
        {/if}
    {/key}
    {#if $page.data.seo?.meta}
        {#each Object.entries($page.data.seo.meta) as [name, content] (name)}
            <meta {name} {content} />
        {/each}
    {/if}
</svelte:head>

<ModeWatcher />
<Toaster visibleToasts="{9}" duration="{8000}" theme="{$mode ?? 'system'}" />

<DarkModeSwitch />

{@render children()}
