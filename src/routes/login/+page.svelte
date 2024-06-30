<script lang="ts">
    import { superForm } from 'sveltekit-superforms';
    import { valibotClient } from 'sveltekit-superforms/adapters';

    import logo from '$lib/assets/logo.png';
    import * as Form from '$lib/components/ui/form';
    import { Input } from '$lib/components/ui/input';
    import { loginSchema } from '$lib/schemas/login';

    const { data } = $props();

    const form = superForm(data.form, {
        validators: valibotClient(loginSchema),
    });

    const { form: formData, enhance, message } = form;
</script>

<div class="flex min-h-full flex-col justify-center px-6 py-12 lg:px-8">
    <div class="sm:mx-auto sm:w-full sm:max-w-sm">
        <img class="mx-auto h-10 w-auto" src="{logo}" alt="Calmedica" />
        <h1
            class="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900 dark:text-gray-100"
        >
            Connexion à votre compte
        </h1>
    </div>
    <div class="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
        <form class="space-y-6" method="POST" use:enhance>
            <Form.Field {form} name="email">
                <Form.Control let:attrs>
                    <Form.Label>Adresse mail</Form.Label>
                    <Input {...attrs} type="email" bind:value="{$formData.email}" />
                </Form.Control>
                <Form.Description />
                <Form.FieldErrors />
            </Form.Field>
            <Form.Field {form} name="password">
                <Form.Control let:attrs>
                    <Form.Label>Mot de passe</Form.Label>
                    <Input {...attrs} type="password" bind:value="{$formData.password}" />
                </Form.Control>
                <Form.FieldErrors />
            </Form.Field>

            {#if $message}
                <p role="status" aria-live="polite">{$message}</p>
            {/if}

            <Form.Button class="w-full">Connexion</Form.Button>
        </form>
    </div>
</div>
