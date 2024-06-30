<script lang="ts">
    import { superForm } from 'sveltekit-superforms';
    import { valibotClient } from 'sveltekit-superforms/adapters';

    import * as Form from '$lib/components/ui/form';
    import { Input } from '$lib/components/ui/input';
    import { MessageSchema } from '$lib/schemas/sms';

    import Chat from '$components/chat/Chat.svelte';
    import Summary from '$components/patient/Summary.svelte';

    const { data } = $props();

    const form = superForm(data.form, {
        validators: valibotClient(MessageSchema),
    });

    const { form: formData, enhance, message } = form;
</script>

<h1>{data.patient.phone}</h1>

<Summary patient="{data.patient}" />
<Chat messages="{data.messages}" allowMarkdown baseId="sms-user">
    {#snippet formTemplate()}
        <form action="?/send" method="post" use:enhance>
            <Form.Field {form} name="message">
                <Form.Control let:attrs>
                    <Form.Label class="sr-only">Message</Form.Label>
                    <Input
                        {...attrs}
                        bind:value="{$formData.message}"
                        placeholder="Votre message"
                    />
                </Form.Control>
                <Form.Description />
                <Form.FieldErrors />
            </Form.Field>

            {#if $message}
                <p role="status" aria-live="polite">{$message}</p>
            {/if}

            <Form.Button>envoyer</Form.Button>
        </form>
    {/snippet}
</Chat>
