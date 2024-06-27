<script context="module" lang="ts">
    export type AssistantStatus = 'available' | 'analyzing' | 'searching' | 'typing';

    export type AssistantProps = {
        opened?: boolean;
    };
</script>

<script lang="ts">
    import { Stream } from 'openai/streaming.mjs';
    import { toast } from 'svelte-sonner';
    import { safeParse } from 'valibot';

    import { dev } from '$app/environment';
    import { AssistantMessageContentSchema } from '$lib/schemas/message';

    import { AssistantError } from '$utils/error';

    import Chat, { type Message } from './chat/Chat.svelte';

    import type { ChatCompletionChunk } from 'openai/resources/index.mjs';

    const { opened = false }: AssistantProps = $props();

    const assistantStatusText: Record<AssistantStatus, string> = {
        available: 'Disponible',
        analyzing: 'Réflexion en cours...',
        searching: 'Recherche en cours...',
        typing: 'Écrit...',
    };

    let assistantStatus: AssistantStatus = $state('available');
    let answer = $state<string | null>(null);
    let messages: Message[] = $state([]);
    let currentId = $derived(messages.at(-1)?.id ?? 0);
    let abortController = $state(new AbortController());
    let currentAssistantStatusText = $derived(assistantStatusText[assistantStatus]);

    /**
     * Sends a new message to the assistant.
     */
    const sendMessage = async (event: SubmitEvent) => {
        try {
            event.preventDefault();

            // If somehow the assistant is not available, we should not send the message
            if (assistantStatus !== 'available') {
                // Do not throw an AssistantError here, as it would also reset the assistant status
                toast.error(
                    "L'assistant n'est pas disponible pour le moment. Veuillez réessayer plus tard.",
                );

                return;
            }

            abortController.abort();
            abortController = new AbortController();

            // Validate the user input
            const validatedInput = safeParse(AssistantMessageContentSchema, answer);

            if (!validatedInput.success) {
                throw new AssistantError(
                    validatedInput.issues.map((i) => i.message).join('\n'),
                    true,
                );
            }

            // Clear the input and set the assistant status to analyzing
            answer = '';
            assistantStatus = 'analyzing';

            // Add the user's message, as well as a temporary message indicating that the assistant is analyzing the message
            messages.push({
                id: currentId,
                sender: 'self',
                content: validatedInput.output,
            });
            messages.push({
                id: currentId,
                sender: 'other',
                content: 'Analyse du message en cours...',
            });

            // Send the message to the assistant
            const response = await fetch('/api/assistant', {
                body: JSON.stringify({
                    content: validatedInput.output,
                    messages: [...messages]
                        .filter((currentMessage) => currentMessage.id !== currentId)
                        .map((currentMessage) => ({
                            content: currentMessage.content,
                            role: currentMessage.sender === 'other' ? 'assistant' : 'user',
                        })),
                }),
                method: 'POST',
                credentials: 'same-origin',
                signal: abortController.signal,
            });

            // If the request was aborted, we should not continue
            if (abortController.signal.aborted) {
                return;
            }

            // If the response didn't succeed or the body is not readable, we should throw an error
            if (!response.ok || !response.body) {
                throw new AssistantError(
                    "Une erreur est survenue lors de l'envoi du message. Veuillez réessayer.",
                    true,
                );
            }

            // Read the stream !
            const stream = Stream.fromReadableStream<ChatCompletionChunk>(
                response.body,
                abortController,
            );
            const message = messages.at(-1) as Message;

            // Clear the temporary message and indicate that the assistant is typing
            message.content = '';

            try {
                // For every chunk sent to the stream...
                for await (const chunk of stream) {
                    const firstChoice = chunk.choices.at(0);

                    if (!firstChoice) {
                        continue;
                    }

                    // If the assistant is calling a function and there's no content, we should add a temporary message
                    if (
                        firstChoice.delta.tool_calls !== undefined &&
                        message.content === '' &&
                        assistantStatus === 'analyzing'
                    ) {
                        assistantStatus = 'searching';

                        message.content = 'Recherche approfondie en cours...';
                    }

                    // If there's content
                    if (firstChoice.delta.content) {
                        if (assistantStatus !== 'typing') {
                            message.content = '';
                            assistantStatus = 'typing';
                        }

                        // Add the content to the message
                        const streamText = firstChoice.delta.content;

                        message.content += streamText;
                    }
                }
            } catch (e) {
                if (dev) {
                    console.error(
                        'Unexpected error while reading the stream from the assistant:',
                        e,
                    );
                }

                throw new AssistantError(
                    "Une erreur est survenue lors de la lecture de la réponse de l'assistant. Veuillez réessayer.",
                    true,
                );
            }
        } catch (e) {
            // Handle errors (assistant errors are handled differently)
            if (!(e instanceof AssistantError)) {
                if (dev) {
                    console.error('Unexpected error while sending message to assistant:', e);
                }

                toast.error(
                    "Une erreur est survenue lors de l'envoi du message. Veuillez réessayer.",
                );

                return;
            }

            if (e.replaceLastMessage) {
                const lastMessage = messages.at(-1);

                if (lastMessage && lastMessage.sender === 'other') {
                    lastMessage.content =
                        "Je n'ai pas pu vous répondre à cause d'une erreur inattendue. Vous pouvez réessayer à tout moment.";
                }
            }

            // We know the message is safe to display
            toast.error(e.message);
        } finally {
            // Set the assistant status back to available
            assistantStatus = 'available';
        }
    };
</script>

{#if opened}
    <div>
        <h2>Assistant</h2>
        <p>{currentAssistantStatusText}</p>
        <Chat
            {messages}
            bind:currentMessage="{answer}"
            onsubmit="{sendMessage}"
            busy="{assistantStatus !== 'available'}"
            allowMarkdown
        />
    </div>
{/if}
