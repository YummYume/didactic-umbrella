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

    const { form: formData, enhance, message, submitting } = form;
</script>

<div class="container flex h-full flex-col space-y-2 py-12">
    <h1 class="text-2xl font-bold leading-9 tracking-tight text-gray-900 dark:text-gray-100">
        Numéro : {data.patient.phone}
    </h1>
    <div class="grid grow gap-8 lg:grid-cols-12">
        <Summary class="lg:h-[calc(100svh-12.5rem)]" patient="{data.patient}" />

        <Chat
            allowMarkdown
            baseId="sms-user"
            class="flex w-full flex-col rounded-3xl border-2 border-primary p-4 [--padding:6rem] lg:col-span-4 lg:h-[calc(100svh-12.5rem)]"
            messages="{data.messages}"
        >
            {#snippet formTemplate()}
                <form class="flex flex-col" action="?/send" method="post" use:enhance>
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

                    <Form.Button class="ml-auto" disabled="{$submitting}">Envoyer</Form.Button>
                </form>
            {/snippet}
        </Chat>
    </div>
</div>
