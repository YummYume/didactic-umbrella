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
    import { page } from '$app/stores';
    import * as Avatar from '$lib/components/ui/avatar/index.js';
    import { AssistantMessageContentSchema } from '$lib/schemas/message';
    import { getAssistantState } from '$lib/states/assistant.svelte';

    import { AssistantError } from '$utils/error';

    import Chat from './chat/Chat.svelte';

    import type { ChatCompletionChunk } from 'openai/resources/index.mjs';

    const ASSISTANT_STATUS_TEXT: Record<AssistantStatus, string> = {
        available: 'Disponible',
        analyzing: 'Réflexion en cours...',
        searching: 'Recherche en cours...',
        typing: 'Écrit...',
    };
    const ASSISTANT_STATUS_COLOR = {
        analyzing: 'bg-yellow-500',
        available: 'bg-teal-500',
        searching: 'bg-blue-500',
        typing: 'bg-neutral-500',
    };

    // See https://github.com/huntabyte/bits-ui/issues/315
    // See https://www.youtube.com/watch?v=e1vlC31Sh34
    const assistantState = getAssistantState();

    let currentAssistantStatusText = $derived(ASSISTANT_STATUS_TEXT[assistantState.status]);

    /**
     * Sends a new message to the assistant.
     */
    const sendMessage = async (event: SubmitEvent) => {
        try {
            event.preventDefault();

            // If somehow the assistant is not available, we should not send the message
            if (assistantState.status !== 'available') {
                // Do not throw an AssistantError here, as it would also reset the assistant status
                toast.error(
                    "L'assistant n'est pas disponible pour le moment. Veuillez réessayer plus tard.",
                );

                return;
            }

            assistantState.abortController.abort();
            assistantState.abortController = new AbortController();

            // Validate the user input
            const validatedInput = safeParse(AssistantMessageContentSchema, assistantState.answer);

            if (!validatedInput.success) {
                throw new AssistantError(validatedInput.issues.map((i) => i.message).join('\n'));
            }

            // Clear the input and set the assistant status to analyzing
            assistantState.answer = '';
            assistantState.status = 'analyzing';

            // Add the user's message, as well as a temporary message indicating that the assistant is analyzing the message
            assistantState.addMessage({
                id: assistantState.messages.length,
                sender: 'self',
                content: validatedInput.output,
            });
            assistantState.addMessage({
                id: assistantState.messages.length,
                sender: 'other',
                content: 'Analyse du message en cours...',
            });

            // Send the message to the assistant
            const response = await fetch('/api/assistant', {
                body: JSON.stringify({
                    content: validatedInput.output,
                    context: $page.data.assistantContext ?? $page.error?.assistantContext,
                    messages: [...assistantState.messages]
                        .filter(
                            (currentMessage) =>
                                currentMessage.id !== assistantState.messages.at(-1)?.id &&
                                currentMessage.id !== assistantState.messages.at(-2)?.id,
                        )
                        .map((currentMessage) => ({
                            content: currentMessage.content,
                            role: currentMessage.sender === 'other' ? 'assistant' : 'user',
                        })),
                }),
                method: 'POST',
                credentials: 'same-origin',
                signal: assistantState.abortController.signal,
            });

            // If the request was aborted, we should not continue
            if (assistantState.abortController.signal.aborted) {
                return;
            }

            // If the response didn't succeed or the body is not readable, we should throw an error
            if (!response.ok || !response.body) {
                throw new AssistantError(
                    "Une erreur est survenue lors de l'envoi du message. Veuillez réessayer.",
                );
            }

            // Read the stream !
            const stream = Stream.fromReadableStream<ChatCompletionChunk>(
                response.body,
                assistantState.abortController,
            );

            // Clear the temporary message and indicate that the assistant is typing
            assistantState.updateLastMessageContent('');

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
                        assistantState.lastMessage?.content === '' &&
                        assistantState.status === 'analyzing'
                    ) {
                        assistantState.status = 'searching';

                        assistantState.updateLastMessageContent(
                            'Recherche approfondie en cours...',
                        );
                    }

                    // If there's content
                    if (firstChoice.delta.content) {
                        if (assistantState.status !== 'typing') {
                            assistantState.updateLastMessageContent('');
                            assistantState.status = 'typing';
                        }

                        // Add the content to the message
                        const streamText = firstChoice.delta.content;

                        assistantState.updateLastMessageContent(streamText, false);
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
                );
            }
        } catch (e) {
            const lastMessage = assistantState.messages.at(-1);

            if (lastMessage && lastMessage.sender === 'other') {
                lastMessage.content =
                    "Je n'ai pas pu vous répondre à cause d'une erreur inattendue. Vous pouvez réessayer à tout moment.";
            }

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

            // We know the message is safe to display
            toast.error(e.message);
        } finally {
            // Set the assistant status back to available
            assistantState.status = 'available';
        }
    };
</script>

<div class="flex items-center gap-2 pb-6">
    <Avatar.Root>
        <Avatar.Image src="/doc.webp" alt="Avatar Le Doc" />
        <Avatar.Fallback>LD</Avatar.Fallback>
    </Avatar.Root>
    <p>Le Doc</p>
    <p class="flex items-center gap-2">
        <span class="size-1.5 rounded-full {ASSISTANT_STATUS_COLOR[assistantState.status]}"></span>
        {currentAssistantStatusText}
    </p>
</div>

<Chat
    allowMarkdown
    class="flex h-full flex-col"
    busy="{assistantState.status !== 'available'}"
    bind:currentMessage="{assistantState.answer}"
    disabled="{assistantState.answer?.trim() === ''}"
    onsubmit="{sendMessage}"
    baseId="assistant-chat-"
    messages="{assistantState.messages}"
/>
