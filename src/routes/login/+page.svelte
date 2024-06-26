<script lang="ts">
    import LoginForm from './LoginForm.svelte';

    const gererConnexion = (event: CustomEvent<{ email: string; motDePasse: string }>) => {
        const { email, motDePasse } = event.detail;
        console.log('Détails de connexion :', email, motDePasse);
    };
</script>

<LoginForm on:login="{gererConnexion}" />
