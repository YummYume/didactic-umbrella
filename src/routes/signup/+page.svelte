<script lang="ts">
    import SignupForm from './SignupForm.svelte';

    const handleSignup = (
        event: CustomEvent<{ email: string; password: string; confirmPassword: string }>,
    ) => {
        const { email, password, confirmPassword } = event.detail;
        console.log('Signup details:', email, password, confirmPassword);
    };
</script>

<SignupForm on:signup="{handleSignup}" />
