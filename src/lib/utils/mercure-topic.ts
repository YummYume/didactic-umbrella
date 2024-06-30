import { PUBLIC_MERCURE_BASE_TOPIC } from '$env/static/public';

export enum MercureTopic {
  NewMessage = '/messages/new/{id}',
  NewResponse = '/responses/new/{id}',
}

export type MercureTopicDataMapping = {
  [MercureTopic.NewMessage]: {
    patientId: string;
    phone: string;
    content: string;
    userId?: string;
  };
  [MercureTopic.NewResponse]: {
    patientId: string;
    messageId: string;
    phone: string;
    content: string;
    userId?: string;
  };
};

export type MercureTopicDataMappingWithTopic = {
  [key in MercureTopic]: MercureTopicDataMapping[key] & { topic: key };
};

/**
 * Get the Mercure topic URI for a given topic.
 */
export const getMercureTopicUri = (topic: MercureTopic) => `${PUBLIC_MERCURE_BASE_TOPIC}${topic}`;
