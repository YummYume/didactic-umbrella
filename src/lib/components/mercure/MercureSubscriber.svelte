<script context="module" lang="ts">
    import {
        getMercureTopicUri,
        type MercureTopic,
        type MercureTopicDataMappingWithTopic,
    } from '$utils/mercure-topic';

    import type { Snippet } from 'svelte';

    export type MercureSubscriberProps<Topics extends MercureTopic[] = MercureTopic[]> = {
        /**
         * The URL of the Mercure hub.
         */
        hubUrl: string;
        /**
         * The topics to subscribe to.
         */
        topics: Topics;
        /**
         * The callback to execute when a message is received.
         */
        onmercuremessage?: (
            event: MessageEvent<MercureTopicDataMappingWithTopic[Topics[number]]>,
        ) => void | Promise<void>;
        /**
         * The callback to execute when the connection is opened.
         */
        onmercureopen?: (event: Event) => void | Promise<void>;
        /**
         * The callback to execute when the hub encounters an error.
         */
        onmercureerror?: (event: Event) => void | Promise<void>;
        children?: Snippet;
    };
</script>

<script lang="ts">
    const {
        hubUrl,
        topics,
        onmercuremessage,
        onmercureopen,
        onmercureerror,
        children,
    }: MercureSubscriberProps = $props();

    const subscribedTopics = $derived(topics.map((topic) => getMercureTopicUri(topic)));

    $effect(() => {
        const sourceUrl = new URL(hubUrl);

        subscribedTopics.forEach((topic) => {
            sourceUrl.searchParams.append('topic', topic);
        });

        const eventSource = new EventSource(sourceUrl);
        const onMessageEvent = onmercuremessage
            ? (event: MessageEvent) => {
                  const data = JSON.parse(event.data);

                  onmercuremessage({ ...event, data });
              }
            : undefined;
        const onOpenEvent = onmercureopen;
        const onErrorEvent = onmercureerror;

        if (onMessageEvent) {
            eventSource.addEventListener('message', onMessageEvent);
        }

        if (onOpenEvent) {
            eventSource.addEventListener('open', onOpenEvent);
        }

        if (onErrorEvent) {
            eventSource.addEventListener('error', onErrorEvent);
        }

        return () => {
            if (onMessageEvent) {
                eventSource.removeEventListener('message', onMessageEvent);
            }

            if (onOpenEvent) {
                eventSource.removeEventListener('open', onOpenEvent);
            }

            if (onErrorEvent) {
                eventSource.removeEventListener('error', onErrorEvent);
            }

            eventSource.close();
        };
    });
</script>

{#if children}
    {@render children()}
{/if}
