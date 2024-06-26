<script lang="ts">
    import { goto } from '$app/navigation';

    let email = '';
    let motDePasse = '';

    const naviguerVersInscription = () => {
        goto('/signup');
    };

    const gererConnexion = (event: Event) => {
        event.preventDefault();
        console.log('Détails de connexion :', email, motDePasse);
    };
</script>

<div class="bg-background-secondary flex min-h-screen">
    <div class="form-container flex w-1/2 flex-1 items-center justify-center">
        <div class="w-full max-w-md space-y-8">
            <div>
                <h2 class="mt-6 text-center text-3xl font-extrabold text-foreground">
                    Connectez-vous à votre compte
                </h2>
            </div>
            <form class="mt-8 space-y-6" on:submit="{gererConnexion}">
                <input type="hidden" name="remember" value="true" />
                <div class="-space-y-px rounded-md shadow-sm">
                    <div>
                        <label for="email-address" class="sr-only">Adresse e-mail</label>
                        <input
                            id="email-address"
                            name="email"
                            type="email"
                            autocomplete="email"
                            required
                            bind:value="{email}"
                            class="relative mb-2 block w-full appearance-none rounded-none rounded-t-md border border-border px-3 py-2 text-foreground placeholder-muted-foreground focus:z-10 focus:border-primary focus:outline-none focus:ring-primary sm:text-sm"
                            placeholder="Adresse e-mail"
                        />
                    </div>
                    <div>
                        <label for="password" class="sr-only">Mot de passe</label>
                        <input
                            id="password"
                            name="password"
                            type="password"
                            autocomplete="current-password"
                            required
                            bind:value="{motDePasse}"
                            class="relative block w-full appearance-none rounded-none rounded-b-md border border-border px-3 py-2 text-foreground placeholder-muted-foreground focus:z-10 focus:border-primary focus:outline-none focus:ring-primary sm:text-sm"
                            placeholder="Mot de passe"
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
                            Se souvenir de moi
                        </label>
                    </div>

                    <div class="text-sm">
                        <a href="/forgot-password" class="link-primary"> Mot de passe oublié? </a>
                    </div>
                </div>

                <div>
                    <button
                        type="submit"
                        class="btn-primary group relative flex w-full justify-center rounded-md border border-transparent px-4 py-2 text-sm font-medium"
                    >
                        Se connecter
                    </button>
                </div>

                <div class="text-center text-sm">
                    <p>
                        Vous n'avez pas de compte ?
                        <button
                            type="button"
                            on:click="{naviguerVersInscription}"
                            class="link-primary"
                        >
                            Inscrivez-vous
                        </button>
                    </p>
                </div>
            </form>
        </div>
    </div>
    <div class="flex w-1/2 items-center justify-center bg-muted">
        <img src="/medical-background.jpg" alt="Fond médical" class="h-full w-full object-cover" />
    </div>
</div>
