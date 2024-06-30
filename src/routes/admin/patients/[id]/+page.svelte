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

<div class="container flex h-full flex-col space-y-2 py-12">
    <h1>Numéro : {data.patient.phone}</h1>
    <div class="grid grow gap-8 lg:grid-cols-12">
        <Summary patient="{data.patient}" />
        <Chat
            allowMarkdown
            baseId="sms-user"
            class="flex w-full flex-col lg:col-span-4"
            messages="{data.messages}"
        >
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
    </div>
</div>
