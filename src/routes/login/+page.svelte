<script lang="ts">
    import { superForm } from 'sveltekit-superforms';
    import { valibotClient } from 'sveltekit-superforms/adapters';

    import * as Form from '$lib/components/ui/form';
    import { Input } from '$lib/components/ui/input';
    import { loginSchema } from '$lib/schemas/login';

    const { data } = $props();

    const form = superForm(data.form, {
        validators: valibotClient(loginSchema),
    });

    const { form: formData, enhance, message } = form;
</script>

<form method="POST" use:enhance>
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
        <Form.Description />
        <Form.FieldErrors />
    </Form.Field>

    {#if $message}
        <p role="status" aria-live="polite">{$message}</p>
    {/if}

    <Form.Button>Submit</Form.Button>
</form>
