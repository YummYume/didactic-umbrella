import { toJSONSchema } from '@gcornut/valibot-json-schema';
import { parse } from 'postcss';
import {
  enum_,
  type InferOutput,
  integer,
  maxValue,
  minValue,
  nullable,
  number,
  object,
  pipe,
  string,
} from 'valibot';

import { type Message } from '$server/db/schema/messages';
import { type OpenAi } from '$server/openai';

/**
 * The type of the message send
 */
export enum MessageType {
  Response = 'response',
  Message = 'message',
}

/**
 * The category of the message
 */
export enum MessageCategory {
  Inappropriate = 'inappropriate',
  Normal = 'normal',
  Important = 'important',
}

type ContentCollectorData = {
  message: string;
  patientId: string;
  userId?: string;
};

export const TypeMessageSchema = enum_(MessageType);
export const CategoryMessageSchema = enum_(MessageCategory);

/**
 * The schema for a message sent by the collector.
 */
export const CollectorSchema = object({
  type: TypeMessageSchema,
  category: CategoryMessageSchema,
  levelImportance: pipe(number(), integer(), minValue(1), maxValue(5)),
  subject: string(),
  intent: string(),
  information: object({
    symptom: nullable(string()),
    onset: nullable(string()),
    details: nullable(string()),
    extraInformation: nullable(string()),
  }),
  relatedMessageId: nullable(string()),
});

export type CollectorSchemaType = InferOutput<typeof CollectorSchema>;

/**
 * The schema for the query arguments of the collector.
 */
export const CollectorQueryArgsSchema = object({
  patientId: string(),
  userId: nullable(string()),
});

/**
 * Parse the query arguments of the collector.
 * @param args
 * @returns
 */
export const parseCollectorQueryArgs = (args: string) => {
  const jsonData = JSON.parse(args);

  return parse(CollectorQueryArgsSchema, jsonData);
};

/**
 * Process a message and return data extracted from it
 *
 * @param openai - the openai instance
 * @param content - the message to process
 * @param getMessage - a function to get the messages
 * @returns the response from the openai api
 */
export function collectorRunner(
  openai: OpenAi,
  content: ContentCollectorData,
  getMessage: (args: { userId?: string; patientId: string }) => Promise<Message[]>,
) {
  return openai.beta.chat.completions.runTools({
    model: 'gpt-4-turbo',
    response_format: {
      type: 'json_object',
    },
    messages: [
      {
        role: 'system',
        content: `Tu es un collecteur, ton objectif est d'analyser le message,
        tu devras collecter l'ensemble des informations qui le compose,
        fait attention au sarcasse, aux informations inutiles et aux informations manquantes,
        tu utilises uniquement le français,
        prends en compte uniquement les messages à caractères médicaux,
        si le message est une réponse à caractères humoristique, ou blague, tu dois renvoyer un message d'erreur: { "error": "Votre message est inapproprié." },
        et le trier en fonction de son contenu sous le format JSON avec les clés suivantes :
        {
          "type": "(${Object.values(MessageType).join(' ou ')})",
          "category": "la catégorie du message (${Object.values(MessageCategory).join(', ')})",
          "levelImportance": "l'importance du message, est un nombre (1 à 5)",
          "subject": "le sujet du message",
          "intent": "l'intention du message",
          "information": {
            "symptom": "le symptôme, la maladie ou le problème de santé mentionné (traduit en terme médical si possible)",
            "onset": "la date de début des symptômes ou de la maladie",
            "details": "Informations supplémentaires",
            "extraInformation": "Informations complémentaires"
          },
          "relatedMessageId": "l'identifiant du message lié"
        }.
        Tu dois respecter le format de la réponse,
        `,
      },
      {
        role: 'system',
        content: `Tu auras accès à l'identifiant du patient et celui de l'utilisateur si il y en a un`,
      },
      {
        role: 'system',
        content: `Si le message te semble être une réponse à un message précédent, tu dois utiliser la fonction getMessage pour récupérer les messages précédents.`,
      },
      {
        role: 'user',
        content: JSON.stringify(content),
      },
    ],
    tools: [
      {
        type: 'function',
        function: {
          name: 'getMessage',
          description: `Fonction permettant de récupérer les messages.
          les messages auront le format suivant: { id, userId, patientId, data, content }.
          `,
          function: getMessage,
          parse: parseCollectorQueryArgs,
          // @ts-expect-error - Likely a bug in the type definition from the library
          parameters: toJSONSchema({ schema: CollectorQueryArgsSchema }),
        },
      },
    ],
  });
}
