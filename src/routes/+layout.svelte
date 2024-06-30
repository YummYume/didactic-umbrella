<script lang="ts">
    import '../app.scss';

    import { mode, ModeWatcher } from 'mode-watcher';
    import { toast, Toaster } from 'svelte-sonner';
    import { getFlash } from 'sveltekit-flash-message';

    import { enhance } from '$app/forms';
    import { goto, invalidate, onNavigate } from '$app/navigation';
    import { page } from '$app/stores';
    import logo from '$lib/assets/logo.png';
    import * as Sheet from '$lib/components/ui/sheet';
    import * as Tooltip from '$lib/components/ui/tooltip';
    import { initAssistantState } from '$lib/states/assistant.svelte';
    import { PUBLIC_MERCURE_HUB_URL } from '$env/static/public';

    import Assistant from '$components/Assistant.svelte';
    import DarkModeSwitch from '$components/DarkModeSwitch.svelte';
    import HelpButton from '$components/HelpButton.svelte';
    import MercureSubscriber from '$components/mercure/MercureSubscriber.svelte';
    import Button from '$components/ui/button/button.svelte';
    import { driverjs, ROUTE_STEPS } from '$utils/driver';
    import { MercureTopic } from '$utils/mercure-topic';
    import { truncate } from '$utils/string';

    import IconAssistant from '~icons/lucide/bot-message-square';

    // Initialize context
    initAssistantState();

    const { children, data } = $props();

    const flash = getFlash(page);
    const defaultMeta = {
        description:
            "L'application de gestion de patients aidée par l'IA pour les professionnels de la santé.",
        robots: 'noindex, nofollow',
    };

    const drive = () => {
        const steps = ROUTE_STEPS[$page.url.pathname] ?? [];

        driverjs.setSteps(steps);
    };

    let assistantOpen = $state(false);
    let meta = $derived({
        ...defaultMeta,
        ...$page.data.seo?.meta,
    });

    $effect(() => {
        if ($flash) {
            toast[$flash.type]($flash.message);

            $flash = undefined;
        }
    });

    $effect(() => {
        drive();
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

    onNavigate((navigation) => {
        navigation.complete.then(() => {
            drive();
        });
    });

    onNavigate(() => {
        if (assistantOpen) {
            assistantOpen = false;
        }
    });
</script>

<svelte:head>
    {#key $page.data.seo}
        <title>{$page.data.seo?.title ?? 'Hackathon 2024'}</title>
    {/key}

    {#each Object.entries(meta) as [name, content] (name)}
        <meta {name} {content} />
    {/each}
</svelte:head>

<ModeWatcher />
<Toaster visibleToasts="{9}" duration="{8000}" theme="{$mode ?? 'system'}" position="bottom-left" />

{#if data.user}
    <MercureSubscriber
        hubUrl="{PUBLIC_MERCURE_HUB_URL}"
        topics="{[MercureTopic.NewMessage, MercureTopic.NewResponse]}"
        onmercuremessage="{(event) => {
            invalidate('app:patients');
            invalidate(`app:patients:${event.data.patientId}`);

            // The message is from a patient, display it in a toast with a link to the patient's page
            if (!event.data.userId) {
                const messageContent = truncate(event.data.content, 50);

                if (event.data.topic === MercureTopic.NewResponse) {
                    toast(`Nouvelle réponse du numéro ${event.data.phone} : "${messageContent}".`, {
                        duration: 20000,
                        action: {
                            label: 'Voir',
                            onClick: () => goto(`/admin/patients/${event.data.patientId}`),
                        },
                    });
                }

                if (event.data.topic === MercureTopic.NewMessage) {
                    toast(`Nouveau message du numéro ${event.data.phone} : "${messageContent}".`, {
                        duration: 20000,
                        action: {
                            label: 'Voir',
                            onClick: () => goto(`/admin/patients/${event.data.patientId}`),
                        },
                    });
                }
            }
        }}"
    />
{/if}

<header
    class="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60"
>
    <div class="container flex h-14 items-center justify-between gap-4">
        <Button href="{data.user ? '/admin' : '/'}" variant="ghost">
            <img alt="Logo Calmedica" class="h-6" src="{logo}" />
        </Button>

        <ul class="flex gap-0.5">
            <li class="flex items-center gap-[1em]">
                {#if data.user}
                    <p>{data.user.email}</p>
                    <form action="/?/logout" method="post" use:enhance>
                        <Button type="submit" variant="ghost">Déconnexion</Button>
                    </form>
                {:else}
                    <Button href="/login" variant="ghost">Connexion</Button>
                {/if}
            </li>

            {#if data.user}
                <li>
                    <Sheet.Root bind:open="{assistantOpen}">
                        <Sheet.Trigger>
                            <Tooltip.Root>
                                <Tooltip.Trigger asChild let:builder>
                                    <Button
                                        aria-label="Discuter avec l'assistant"
                                        builders="{[builder]}"
                                        size="icon"
                                        variant="ghost"
                                    >
                                        <IconAssistant class="size-6" />
                                    </Button>
                                </Tooltip.Trigger>
                                <Tooltip.Content>
                                    <p>Discuter avec l'assistant</p>
                                </Tooltip.Content>
                            </Tooltip.Root>
                        </Sheet.Trigger>
                        <Sheet.Content>
                            <Assistant />
                        </Sheet.Content>
                    </Sheet.Root>
                </li>
            {/if}

            <li>
                <HelpButton />
            </li>
            <li>
                <DarkModeSwitch />
            </li>
        </ul>
    </div>
</header>

<main class="grow">
    {@render children()}
</main>
