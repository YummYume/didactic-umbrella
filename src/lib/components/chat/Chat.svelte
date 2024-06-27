<script context="module" lang="ts">
    import type { Snippet } from 'svelte';
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
            [EventHandler<SubmitEvent, HTMLFormElement> | undefined, boolean | undefined]
        >;
    } & HTMLAttributes<HTMLDivElement>;
</script>

<script lang="ts">
    import Markdown from 'svelte-exmarkdown';

    let {
        messages,
        currentMessage = $bindable(null),
        busy = false,
        allowMarkdown = false,
        onsubmit,
        messageTemplate = defaultMessageTemplate,
        formTemplate = defaultFormTemplate,
        ...attributes
    }: ChatProps = $props();
</script>

{#snippet defaultMessageTemplate(message: Message, allowMarkdown: boolean = false)}
    <li class="{allowMarkdown ? 'prose lg:prose-xl' : ''}">
        {#if allowMarkdown}
            <Markdown md="{message.content}" />
        {:else}
            {message.content}
        {/if}
    </li>
{/snippet}

{#snippet defaultFormTemplate(
    onsubmit?: EventHandler<SubmitEvent, HTMLFormElement>,
    busy?: boolean,
)}
    <form method="post" {onsubmit}>
        <label>
            <span>Message:</span>
            <input name="chat-message" type="text" bind:value="{currentMessage}" />
            <button type="submit" disabled="{busy}">Send</button>
        </label>
    </form>
{/snippet}

<div {...attributes}>
    <ul>
        {#each messages as message}
            {@render messageTemplate(message, allowMarkdown)}
        {/each}
    </ul>

    {@render formTemplate(onsubmit, busy)}
</div>
