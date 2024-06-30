import queryString from 'node:querystring';

import { MERCURE_JWT_TOKEN, MERCURE_PUBLISH_URL } from '$env/static/private';

import { getMercureTopicUri, type MercureTopic } from '$utils/mercure-topic';

export type MercureTopicPayload = {
  topic: MercureTopic | MercureTopic[];
  data?:
    | string
    | number
    | boolean
    | readonly string[]
    | readonly number[]
    | readonly boolean[]
    | null;
  private?: boolean;
  id?: string;
  type?: string;
  retry?: number;
};

/**
 * Publish a message to the Mercure hub.
 */
export const publishMercureTopic = (
  fetcher: typeof fetch,
  payload: MercureTopicPayload,
  throwOnError = false,
) => {
  try {
    const url = new URL(MERCURE_PUBLISH_URL);

    return fetcher(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': `Bearer ${MERCURE_JWT_TOKEN}`,
      },
      body: queryString.stringify({
        ...payload,
        topic: Array.isArray(payload.topic)
          ? payload.topic.map((topic) => getMercureTopicUri(topic))
          : getMercureTopicUri(payload.topic),
      }),
    });
  } catch (error) {
    console.error('An error occurred while publishing a message to the Mercure hub.');
    console.error(error);

    if (throwOnError) {
      throw error;
    }
  }
};
