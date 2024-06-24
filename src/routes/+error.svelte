<script lang="ts">
    import { page } from '$app/stores';

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

<div class="text-center">
    <p class="text-base font-semibold text-indigo-600">{$page.status}</p>
    <h1 class="mt-4 text-3xl font-bold tracking-tight sm:text-5xl">{errorTitle}</h1>
    <p class="mt-6 text-base leading-7 text-gray-600">
        {$page.error?.message ?? "Quelque chose s'est mal passé."}
    </p>
    <div class="mt-10 flex items-center justify-center gap-x-6">
        <a
            href="/"
            class="rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >Retourner à l'accueil</a
        >
    </div>
</div>
