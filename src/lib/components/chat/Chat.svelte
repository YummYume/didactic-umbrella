<script context="module" lang="ts">
    import { type Snippet } from 'svelte';

    import type { EventHandler, HTMLAttributes } from 'svelte/elements';

    export type Message = {
        /**
         * A unique identifier for the message.
         */
        id: number;
        /**
         * The sender of the message. Either 'self' for the current user or 'other' for anyone else.
         */
        sender: 'self' | 'other';
        /**
         * The content of the message.
         */
        content: string;
    };

    export type ChatProps = {
        /**
         * The base identifier to use for IDs in the chat's elements.
         */
        baseId: string;
        /**
         * The messages to display in the chat.
         */
        messages: Message[];
        /**
         * The current (bindable) message to send.
         */
        currentMessage?: string | null;
        /**
         * Whether the chat is busy or not. This will disable the form submission button.
         */
        busy?: boolean;
        /**
         * Whether the button is disabled or not. This will disable the form submission button.
         */
        disabled?: boolean;
        /**
         * Whether to allow Markdown in the messages.
         */
        allowMarkdown?: boolean;
        /**
         * The event handler for the form submission.
         */
        onsubmit?: EventHandler<SubmitEvent, HTMLFormElement>;
        /**
         * The template (`Snippet`) for rendering a message.
         */
        messageTemplate?: Snippet<[Message, boolean | undefined]>;
        /**
         * The template (`Snippet`) for rendering the form.
         * You do not need to provide the `currentMessage` prop if you use a custom form template.
         */
        formTemplate?: Snippet<
            [
                EventHandler<SubmitEvent, HTMLFormElement> | undefined,
                boolean | undefined,
                boolean | undefined,
            ]
        >;
    } & HTMLAttributes<HTMLDivElement>;
</script>

<script lang="ts">
    import { scale } from 'svelte/transition';
    import Markdown from 'svelte-exmarkdown';

    import Button from '$components/ui/button/button.svelte';
    import Textarea from '$components/ui/textarea/textarea.svelte';

    import IconLoader from '~icons/lucide/loader-circle';
    import IconSend from '~icons/lucide/send-horizontal';

    const messagesClass = {
        self: 'ml-auto bg-blue-500 text-white',
        other: 'bg-neutral-500/25',
    };

    let {
        baseId,
        messages,
        currentMessage = $bindable(null),
        busy = false,
        disabled = false,
        allowMarkdown = false,
        onsubmit,
        messageTemplate = defaultMessageTemplate,
        formTemplate = defaultFormTemplate,
        ...attributes
    }: ChatProps = $props();

    let chatContainer = $state<HTMLUListElement | null>(null);
    let chatContainerId = $derived(`${baseId}-chat`);
    let lastMessage = $derived(messages.at(-1) || null);

    $effect(() => {
        if (lastMessage?.content.trim() !== '') {
            window.requestAnimationFrame(() => {
                if (!chatContainer) {
                    return;
                }

                chatContainer.scrollIntoView(false);
            });
        }
    });
</script>

{#snippet defaultMessageTemplate(message: Message, allowMarkdown: boolean = false)}
    <li
        class="w-max max-w-[75%] rounded-3xl px-[1em] py-[0.5em] {messagesClass[
            message.sender
        ]} {allowMarkdown ? 'prose dark:prose-invert lg:prose-xl' : ''}"
        transition:scale
    >
        {#if allowMarkdown}
            <Markdown md="{message.content}" />
        {:else}
            <p>
                <span class="sr-only"
                    >{message.sender === 'self' ? 'Mon message' : 'Message reçu'} :
                </span>
                {message.content}
            </p>
        {/if}
    </li>
{/snippet}

{#snippet defaultFormTemplate(
    onsubmit?: EventHandler<SubmitEvent, HTMLFormElement>,
    busy?: boolean,
    disabled?: boolean,
)}
    <form
        aria-busy="{busy}"
        class="pt-3"
        method="post"
        aria-controls="{chatContainerId}"
        {onsubmit}
    >
        <label class="grid gap-2">
            <p>Votre message</p>
            <Textarea
                class="resize-none"
                name="chat-message"
                required
                bind:value="{currentMessage}"
                onkeydown="{(event) => {
                    if (
                        event.key === 'Enter' &&
                        !event.ctrlKey &&
                        !event.shiftKey &&
                        !event.metaKey
                    ) {
                        event.preventDefault();
                        event.currentTarget.form?.requestSubmit();
                    }
                }}"
            />
            <Button
                aria-label="Envoyer le message"
                class="ml-auto"
                disabled="{busy || disabled}"
                type="submit"
            >
                {#if busy}
                    <IconLoader class="mr-2 size-4 animate-spin" />
                {:else}
                    <IconSend class="mr-2 size-4" />
                {/if}
                Envoyer
            </Button>
        </label>
    </form>
{/snippet}

<div {...attributes}>
    <div class="flex max-h-[calc(100%-14.75rem)] grow">
        <div class="w-full overflow-auto">
            <ul
                id="{chatContainerId}"
                class=" space-y-4 px-1"
                aria-live="polite"
                bind:this="{chatContainer}"
            >
                {#each messages as message (message.id)}
                    {@render messageTemplate(message, allowMarkdown)}
                {/each}
            </ul>
        </div>
    </div>

    {@render formTemplate(onsubmit, busy, disabled)}
</div>
