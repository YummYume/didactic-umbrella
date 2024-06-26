<script lang="ts">
    import LoginForm from './LoginForm.svelte';

    const handleLogin = (event: CustomEvent<{ email: string; password: string }>) => {
        const { email, password } = event.detail;
        console.log('Login details:', email, password);
    };
</script>

<LoginForm on:login="{handleLogin}" />
