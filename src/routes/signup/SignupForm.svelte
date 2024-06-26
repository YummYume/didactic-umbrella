<script lang="ts">
    import { goto } from '$app/navigation';

    let email = '';
    let password = '';
    let confirmPassword = '';
    let name = '';
    let age: number | null = null;

    const navigateToLogin = () => {
        goto('/login');
    };
</script>

<div class="flex min-h-screen">
    <div class="form-container">
        <div class="w-full max-w-md space-y-8">
            <div>
                <h2 class="mt-6 text-center text-3xl font-extrabold text-foreground">
                    Sign up for an account
                </h2>
            </div>
            <form class="mt-8 space-y-8">
                <input type="hidden" name="remember" value="true" />
                <div class="space-y-2 rounded-md shadow-sm">
                    <div>
                        <label for="name" class="sr-only">Name</label>
                        <input
                            id="name"
                            name="name"
                            type="text"
                            required
                            bind:value="{name}"
                            class="relative block w-full appearance-none rounded-none rounded-t-md border border-border px-3 py-2 text-foreground placeholder-muted-foreground focus:z-10 focus:border-primary focus:outline-none focus:ring-primary sm:text-sm"
                            placeholder="Name"
                        />
                    </div>
                    <div>
                        <label for="age" class="sr-only">Age</label>
                        <input
                            id="age"
                            name="age"
                            type="number"
                            required
                            bind:value="{age}"
                            class="relative block w-full appearance-none rounded-none border border-border px-3 py-2 text-foreground placeholder-muted-foreground focus:z-10 focus:border-primary focus:outline-none focus:ring-primary sm:text-sm"
                            placeholder="Age"
                        />
                    </div>
                    <div>
                        <label for="email-address" class="sr-only">Email address</label>
                        <input
                            id="email-address"
                            name="email"
                            type="email"
                            autocomplete="email"
                            required
                            bind:value="{email}"
                            class="relative block w-full appearance-none rounded-none border border-border px-3 py-2 text-foreground placeholder-muted-foreground focus:z-10 focus:border-primary focus:outline-none focus:ring-primary sm:text-sm"
                            placeholder="Email address"
                        />
                    </div>
                    <div>
                        <label for="password" class="sr-only">Password</label>
                        <input
                            id="password"
                            name="password"
                            type="password"
                            autocomplete="new-password"
                            required
                            bind:value="{password}"
                            class="relative block w-full appearance-none rounded-none border border-border px-3 py-2 text-foreground placeholder-muted-foreground focus:z-10 focus:border-primary focus:outline-none focus:ring-primary sm:text-sm"
                            placeholder="Password"
                        />
                    </div>
                    <div>
                        <label for="confirm-password" class="sr-only">Confirm Password</label>
                        <input
                            id="confirm-password"
                            name="confirm-password"
                            type="password"
                            autocomplete="new-password"
                            required
                            bind:value="{confirmPassword}"
                            class="relative block w-full appearance-none rounded-none rounded-b-md border border-border px-3 py-2 text-foreground placeholder-muted-foreground focus:z-10 focus:border-primary focus:outline-none focus:ring-primary sm:text-sm"
                            placeholder="Confirm Password"
                        />
                    </div>
                </div>

                <div>
                    <button
                        type="submit"
                        class="group relative flex w-full justify-center rounded-md border border-transparent bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                    >
                        Sign up
                    </button>
                </div>

                <div class="text-center text-sm">
                    <p>
                        Already have an account?
                        <button
                            type="button"
                            on:click="{navigateToLogin}"
                            class="font-medium text-primary hover:text-primary-foreground"
                        >
                            Sign in
                        </button>
                    </p>
                </div>
            </form>
        </div>
    </div>
    <div class="placeholder">
        <img
            src="/medical-background.jpg"
            alt="Medical Background"
            class="h-full w-full object-cover"
        />
    </div>
</div>

<style>
    .form-container {
        flex: 1;
        display: flex;
        justify-content: center;
        align-items: center;
    }

    .placeholder {
        flex: 1;
        background-color: var(--muted);
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .space-y-8 > * + * {
        margin-top: 2rem;
    }
</style>
