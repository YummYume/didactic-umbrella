<script context="module" lang="ts">
    import type { HTMLAttributes } from 'svelte/elements';
    import type { Message } from '$server/db/schema/messages';
    import type { Patient } from '$server/db/schema/patients';
    import type { Response } from '$server/db/schema/responses';

    export type SummaryStatus = 'idle' | 'generating' | 'writing';

    export type SummaryProps = {
        /**
         * The patient to generate the summary for.
         */
        patient: Patient & { messages: (Message & { responses: Response[] })[] };
    } & HTMLAttributes<HTMLElement>;
</script>

<script lang="ts">
    import { toPng } from 'html-to-image';
    import { Stream } from 'openai/streaming.mjs';
    import { fade } from 'svelte/transition';
    import Markdown from 'svelte-exmarkdown';
    import { toast } from 'svelte-sonner';

    import { dev } from '$app/environment';
    import * as Tooltip from '$lib/components/ui/tooltip';

    import Button from '$components/ui/button/button.svelte';

    import IconImageDownload from '~icons/lucide/image-down';
    import IconLoaderCircle from '~icons/lucide/loader-circle';
    import IconNotebookPen from '~icons/lucide/notebook-pen';

    import type { ChatCompletionChunk } from 'openai/resources/index.mjs';

    const { patient, ...attributes }: SummaryProps = $props();

    let summary = $state<string | null>(null);
    let status = $state<SummaryStatus>('idle');
    let generateButtonDisabled = $derived(patient.messages.length === 0 || status === 'generating');
    let downloadButtonDisabled = $derived(summary === null || status !== 'idle');
    let summaryId = $derived(`${patient.id}-summary`);
    let abortController = $state(new AbortController());
    let summaryContainer = $state<HTMLElement | null>(null);

    /**
     * Generates a summary for the patient based on their messages.
     */
    const generateSummary = async () => {
        try {
            // If somehow the button is disabled, we should not generate the summary
            if (generateButtonDisabled) {
                toast.error(
                    'Impossible de générer un résumé pour ce patient. Veuillez réessayer plus tard.',
                );

                return;
            }

            abortController.abort();
            abortController = new AbortController();
            status = 'generating';
            summary = null;

            // Send the message to the assistant
            const response = await fetch(`/api/summary/${patient.id}`, {
                method: 'GET',
                credentials: 'same-origin',
                signal: abortController.signal,
            });

            // If the request was aborted, we should not continue
            if (abortController.signal.aborted) {
                status = 'idle';

                return;
            }

            // If the response didn't succeed or the body is not readable, we should throw an error
            if (!response.ok || !response.body) {
                toast.error(
                    'Une erreur est survenue lors de la génération du résumé. Veuillez réessayer.',
                );

                status = 'idle';

                return;
            }

            // Read the stream !
            const stream = Stream.fromReadableStream<ChatCompletionChunk>(
                response.body,
                abortController,
            );

            // Set the summary to an empty string
            summary = '';
            status = 'writing';

            // For every chunk sent to the stream...
            for await (const chunk of stream) {
                const firstChoice = chunk.choices.at(0);

                if (!firstChoice) {
                    continue;
                }

                // If there's content
                if (firstChoice.delta.content) {
                    // Add the content to the message
                    const streamText = firstChoice.delta.content;

                    summary += streamText;
                }
            }

            status = 'idle';
        } catch (e) {
            if (dev) {
                console.error(
                    `Unexpected error while generating the summary for the patient ${patient.id}:`,
                    e,
                );
            }

            status = 'idle';

            toast.error(
                'Une erreur est survenue lors de la génération du résumé. Veuillez réessayer.',
            );
        }
    };

    /**
     * Downloads the summary as an image (PNG).
     */
    const downloadSummary = async () => {
        if (downloadButtonDisabled || !summaryContainer) {
            toast.error(
                'Impossible de télécharger le résumé pour ce patient. Veuillez réessayer plus tard.',
            );

            return;
        }

        const dataUrl = await toPng(summaryContainer);
        const a = document.createElement('a');

        // Create a fake download link and click it, then revoke the URL and remove the link
        a.style.display = 'none';
        a.href = dataUrl;
        a.download = `${patient.id}-resume.png`;
        a.click();

        URL.revokeObjectURL(dataUrl);
        a.remove();
    };

    $effect(() => {
        return () => {
            // Abort the current request when the component is destroyed
            abortController.abort();
        };
    });
</script>

<section
    class="relative h-full w-full overflow-auto rounded-md border-2 border-primary shadow"
    {...attributes}
>
    <h2 class="sr-only">Fiche résumée du patient</h2>

    <div class="absolute right-2 top-2 flex items-center justify-center gap-2">
        <Tooltip.Root>
            <Tooltip.Trigger asChild let:builder>
                <Button
                    variant="outline"
                    size="icon"
                    builders="{[builder]}"
                    disabled="{downloadButtonDisabled}"
                    aria-label="Télécharger le résumé"
                    onclick="{downloadSummary}"
                >
                    <IconImageDownload class="size-6" />
                </Button>
            </Tooltip.Trigger>
            <Tooltip.Content>
                <p>Télécharger le résumé généré pour ce patient</p>
            </Tooltip.Content>
        </Tooltip.Root>

        <Tooltip.Root>
            <Tooltip.Trigger asChild let:builder>
                <Button
                    variant="outline"
                    size="icon"
                    builders="{[builder]}"
                    disabled="{generateButtonDisabled}"
                    aria-label="Générer un résumé"
                    aria-controls="{summaryId}"
                    onclick="{generateSummary}"
                >
                    <IconNotebookPen class="size-6" />
                </Button>
            </Tooltip.Trigger>
            <Tooltip.Content>
                <p>
                    {summary
                        ? 'Générer un autre résumé pour ce patient basé sur son historique de messages'
                        : 'Générer un résumé pour ce patient basé sur son historique de messages'}
                </p>
            </Tooltip.Content>
        </Tooltip.Root>
    </div>

    <div
        id="{summaryId}"
        class="p-2"
        aria-live="polite"
        aria-atomic="true"
        aria-busy="{status !== 'idle'}"
        bind:this="{summaryContainer}"
    >
        {#if status === 'generating'}
            <div class="flex items-center justify-center">
                <IconLoaderCircle class="size-8 animate-spin text-primary" />
            </div>
        {:else if summary}
            <div class="prose lg:prose-xl" in:fade>
                <Markdown md="{summary}" />
            </div>
        {/if}
    </div>
</section>
