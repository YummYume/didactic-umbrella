<script lang="ts">
    import { page } from '$app/stores';

    import Button from '$components/ui/button/button.svelte';

    let errorTitle = $derived(
        {
            401: 'Accès non autorisé',
            404: 'Page introuvable',
            500: 'Erreur interne du serveur',
        }[$page.status] ?? "Quelque chose s'est mal passé",
    );
</script>

<svelte:head>
    <title>{errorTitle} - {$page.status}</title>
    <meta name="description" content="{$page.error?.message ?? "Quelque chose s'est mal passé."}" />
    <meta name="robots" content="noindex" />
    <meta name="googlebot" content="noindex" />
</svelte:head>

<div class="grid min-h-full place-content-center place-items-center px-6 text-center lg:px-8">
    <p class="text-base font-semibold text-primary">{$page.status}</p>
    <h1 class="mt-4 text-3xl font-bold tracking-tight sm:text-5xl">
        {errorTitle}
    </h1>
    <p class="mt-6 text-base leading-7">
        {$page.error?.message ?? "Quelque chose s'est mal passé."}
    </p>
    <Button class="mt-10" href="/">Retourner à l'accueil</Button>
</div>
