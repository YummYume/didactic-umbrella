<script lang="ts">
    import banner from '$lib/assets/banner.jpg';

    import Button from '$components/ui/button/button.svelte';

    import IconLogin from '~icons/lucide/log-in';

    const { data } = $props();
</script>

<h1
    class="my-8 scroll-m-20 text-center text-4xl font-extrabold tracking-tight text-primary lg:text-5xl"
>
    {data.title}
</h1>
<img alt="Bannière" height="935" src="{banner}" width="3607" />
<main class="container mt-8 text-center">
    <Button href="/admin" size="lg" variant="secondary"
        ><IconLogin class="mr-2 size-4" />Accès administration</Button
    >
</main>
