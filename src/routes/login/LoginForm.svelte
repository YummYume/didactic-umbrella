<script lang="ts">
    import { goto } from '$app/navigation';

    let email = '';
    let password = '';

    const navigateToSignup = () => {
        goto('/signup');
    };
</script>

<div class="bg-background-secondary flex min-h-screen">
    <div class="form-container flex flex-1 items-center justify-center">
        <div class="w-full max-w-md space-y-8">
            <div>
                <h2 class="mt-6 text-center text-3xl font-extrabold text-foreground">
                    Sign in to your account
                </h2>
            </div>
            <form class="mt-8 space-y-6">
                <input type="hidden" name="remember" value="true" />
                <div class="-space-y-px rounded-md shadow-sm">
                    <div>
                        <label for="email-address" class="sr-only">Email address</label>
                        <input
                            id="email-address"
                            name="email"
                            type="email"
                            autocomplete="email"
                            required
                            bind:value="{email}"
                            class="relative mb-2 block w-full appearance-none rounded-none rounded-t-md border border-border px-3 py-2 text-foreground placeholder-muted-foreground focus:z-10 focus:border-primary focus:outline-none focus:ring-primary sm:text-sm"
                            placeholder="Email address"
                        />
                    </div>
                    <div>
                        <label for="password" class="sr-only">Password</label>
                        <input
                            id="password"
                            name="password"
                            type="password"
                            autocomplete="current-password"
                            required
                            bind:value="{password}"
                            class="relative block w-full appearance-none rounded-none rounded-b-md border border-border px-3 py-2 text-foreground placeholder-muted-foreground focus:z-10 focus:border-primary focus:outline-none focus:ring-primary sm:text-sm"
                            placeholder="Password"
                        />
                    </div>
                </div>

                <div class="flex items-center justify-between">
                    <div class="flex items-center">
                        <input
                            id="remember_me"
                            name="remember_me"
                            type="checkbox"
                            class="h-4 w-4 rounded border-border text-primary focus:ring-primary"
                        />
                        <label for="remember_me" class="ml-2 block text-sm text-foreground">
                            Remember me
                        </label>
                    </div>

                    <div class="text-sm">
                        <a href="/forgot-password" class="link-primary"> Forgot your password? </a>
                    </div>
                </div>

                <div>
                    <button
                        type="submit"
                        class="btn-primary group relative flex w-full justify-center rounded-md border border-transparent px-4 py-2 text-sm font-medium"
                    >
                        Sign in
                    </button>
                </div>

                <div class="text-center text-sm">
                    <p>
                        Don't have an account?
                        <button type="button" on:click="{navigateToSignup}" class="link-primary">
                            Sign up
                        </button>
                    </p>
                </div>
            </form>
        </div>
    </div>
    <div class="half-width flex items-center justify-center bg-muted">
        <img
            src="/medical-background.jpg"
            alt="Medical Background"
            class="h-full w-full object-cover"
        />
    </div>
</div>

<style>
    .half-width {
        width: 50%;
    }
</style>
