<script lang="ts">
    import { goto } from '$app/navigation';

    let email = '';
    let motDePasse = '';
    let confirmerMotDePasse = '';
    let nom = '';
    let age: number | null = null;

    const naviguerVersConnexion = () => {
        goto('/login');
    };
</script>

<div class="flex min-h-screen">
    <div class="form-container flex flex-1 items-center justify-center w-1/2">
        <div class="w-full max-w-md space-y-8">
            <div>
                <h2 class="mt-6 text-center text-3xl font-extrabold text-foreground">
                    Inscrivez-vous pour un compte
                </h2>
            </div>
            <form class="mt-8 space-y-8">
                <input type="hidden" name="remember" value="true" />
                <div class="space-y-2 rounded-md shadow-sm">
                    <div>
                        <label for="nom" class="sr-only">Nom</label>
                        <input
                            id="nom"
                            name="nom"
                            type="text"
                            required
                            bind:value="{nom}"
                            class="relative block w-full appearance-none rounded-none rounded-t-md border border-border px-3 py-2 text-foreground placeholder-muted-foreground focus:z-10 focus:border-primary focus:outline-none focus:ring-primary sm:text-sm"
                            placeholder="Nom"
                        />
                    </div>
                    <div>
                        <label for="age" class="sr-only">Âge</label>
                        <input
                            id="age"
                            name="age"
                            type="number"
                            required
                            bind:value="{age}"
                            class="relative block w-full appearance-none rounded-none border border-border px-3 py-2 text-foreground placeholder-muted-foreground focus:z-10 focus:border-primary focus:outline-none focus:ring-primary sm:text-sm"
                            placeholder="Âge"
                        />
                    </div>
                    <div>
                        <label for="email-address" class="sr-only">Adresse e-mail</label>
                        <input
                            id="email-address"
                            name="email"
                            type="email"
                            autocomplete="email"
                            required
                            bind:value="{email}"
                            class="relative block w-full appearance-none rounded-none border border-border px-3 py-2 text-foreground placeholder-muted-foreground focus:z-10 focus:border-primary focus:outline-none focus:ring-primary sm:text-sm"
                            placeholder="Adresse e-mail"
                        />
                    </div>
                    <div>
                        <label for="password" class="sr-only">Mot de passe</label>
                        <input
                            id="password"
                            name="password"
                            type="password"
                            autocomplete="new-password"
                            required
                            bind:value="{motDePasse}"
                            class="relative block w-full appearance-none rounded-none border border-border px-3 py-2 text-foreground placeholder-muted-foreground focus:z-10 focus:border-primary focus:outline-none focus:ring-primary sm:text-sm"
                            placeholder="Mot de passe"
                        />
                    </div>
                    <div>
                        <label for="confirm-password" class="sr-only">Confirmer le mot de passe</label>
                        <input
                            id="confirm-password"
                            name="confirm-password"
                            type="password"
                            autocomplete="new-password"
                            required
                            bind:value="{confirmerMotDePasse}"
                            class="relative block w-full appearance-none rounded-none rounded-b-md border border-border px-3 py-2 text-foreground placeholder-muted-foreground focus:z-10 focus:border-primary focus:outline-none focus:ring-primary sm:text-sm"
                            placeholder="Confirmer le mot de passe"
                        />
                    </div>
                </div>

                <div>
                    <button
                        type="submit"
                        class="group relative flex w-full justify-center rounded-md border border-transparent bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                    >
                        S'inscrire
                    </button>
                </div>

                <div class="text-center text-sm">
                    <p>
                        Vous avez déjà un compte ?
                        <button
                            type="button"
                            on:click="{naviguerVersConnexion}"
                            class="font-medium text-primary hover:text-primary-foreground"
                        >
                            Connectez-vous
                        </button>
                    </p>
                </div>
            </form>
        </div>
    </div>
    <div class="flex items-center justify-center bg-muted w-1/2">
        <img
            src="/medical-background.jpg"
            alt="Fond médical"
            class="h-full w-full object-cover"
        />
    </div>
</div>
