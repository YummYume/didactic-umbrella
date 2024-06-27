<script>
    import '../app.scss';

    import { mode, ModeWatcher } from 'mode-watcher';
    import { toast, Toaster } from 'svelte-sonner';
    import { getFlash } from 'sveltekit-flash-message';

    import { onNavigate } from '$app/navigation';
    import { page } from '$app/stores';
    import logo from '$lib/assets/logo.png';

    import DarkModeSwitch from '$components/DarkModeSwitch.svelte';
    import Button from '$components/ui/button/button.svelte';

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

<header
    class="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60"
>
    <div class="container flex h-14 max-w-screen-2xl items-center justify-between">
        <div class="mr-4 flex">
            <Button class="mr-6" href="/" variant="ghost">
                <img alt="Calmedica" class="h-6" src="{logo}" />
            </Button>
        </div>
        <DarkModeSwitch />
    </div>
</header>

<main class="grow">
    {@render children()}
</main>
