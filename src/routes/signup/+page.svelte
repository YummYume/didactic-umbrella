<script lang="ts">
    import SignupForm from './SignupForm.svelte';

    const gererInscription = (
        event: CustomEvent<{ email: string; motDePasse: string; confirmerMotDePasse: string }>,
    ) => {
        const { email, motDePasse, confirmerMotDePasse } = event.detail;
        console.log('Détails d\'inscription :', email, motDePasse, confirmerMotDePasse);
    };
</script>

<SignupForm on:signup="{gererInscription}" />
