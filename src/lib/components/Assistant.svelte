<script context="module" lang="ts">
    export type AssistantStatus = 'available' | 'analyzing' | 'typing';

    export type AssistantProps = {
        opened: boolean;
    };
</script>

<script lang="ts">
    import { Stream } from 'openai/streaming.mjs';
    import { toast } from 'svelte-sonner';
    import { safeParse } from 'valibot';

    import { AssistantMessageContentSchema } from '$lib/schemas/assistant';

    import Chat from './chat/Chat.svelte';

    import type { ChatCompletionChunk } from 'openai/resources/index.mjs';
    import type { Message } from './chat/Chat.svelte';

    let assistantStatus: AssistantStatus = 'available';
    let answer = $state<string | null>(null);
    let messages: Message[] = $state([]);
    let currentId = $derived(messages.at(-1)?.id ?? 0);
    let abortController = $state(new AbortController());

    const sendMessage = async (event: SubmitEvent) => {
        event.preventDefault();

        if (assistantStatus !== 'available') {
            toast.error(
                "L'assistant n'est pas disponible pour le moment. Veuillez réessayer plus tard.",
            );

            return;
        }

        abortController.abort();
        abortController = new AbortController();

        const validatedInput = safeParse(AssistantMessageContentSchema, answer);

        if (!validatedInput.success) {
            toast.error(validatedInput.issues.join('\n'));

            return;
        }

        messages.push({
            id: currentId,
            sender: 'self',
            content: validatedInput.output,
        });

        const response = await fetch('/api/intent', {
            body: JSON.stringify({ content: validatedInput.output, messages }),
            credentials: 'same-origin',
            signal: abortController.signal,
        });

        if (abortController.signal.aborted) {
            return;
        }

        if (!response.ok || !response.body) {
            toast.error("Une erreur est survenue lors de l'envoi du message. Veuillez réessayer.");

            return;
        }

        const stream = Stream.fromReadableStream<ChatCompletionChunk>(
            response.body,
            abortController,
        );

        messages.push({
            id: currentId,
            sender: 'other',
            content: '',
        });

        const message = messages.at(-1) as Message;

        for await (const chunk of stream) {
            if (chunk.choices[0].delta.content !== undefined) {
                const streamText = chunk.choices[0].delta.content;

                message.content += streamText;
            }
        }
    };
</script>

<div>
    <h2>Assistant</h2>
    <Chat {messages} onsubmit="{sendMessage}" bind:currentMessage="{answer}" />
</div>
