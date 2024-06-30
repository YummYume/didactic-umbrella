import { toJSONSchema } from '@gcornut/valibot-json-schema';
import { safeParse } from 'valibot';

import {
  CollectorSchema,
  type CollectorSchemaType,
  parseCollectorSchemaArgs,
} from '$server/schemas/collector';

import type { db as dbType } from '$server/db';
import type { OpenAi } from '$server/openai';

/**
 * The data for the collector to process.
 */
export type ContentCollectorData = {
  message: string;
  patientId: string;
  userId?: string;
};

/**
 * Processes the given message and returns the extracted data.
 *
 * @param openai - the OpenAI instance
 * @param db - the DB instance
 * @param content - the content to process
 * @returns the response from the OpenAI API
 */
export const collectorRunner = async (
  openai: OpenAi,
  db: typeof dbType,
  content: ContentCollectorData,
) => {
  // @ts-expect-error - Likely a bug in the type definition from the library
  const collectedDataSchema = toJSONSchema({ schema: CollectorSchema });

  /**
   * Gets the previous (last) message for the patient.
   */
  const getPreviousMessageWithResponses = async () => {
    const previousMessage = await db.query.messages.findFirst({
      where: (messages, { eq }) => eq(messages.patientId, content.patientId),
      orderBy: (messages, { desc }) => [desc(messages.createdAt)],
      with: {
        responses: true,
      },
    });

    if (!previousMessage) {
      return null;
    }

    return previousMessage;
  };

  /**
   * Validates the schema of the collector.
   */
  const validateJson = (args: CollectorSchemaType) => {
    return args;
  };

  const runner = openai.beta.chat.completions.runTools({
    model: 'gpt-4-turbo',
    response_format: {
      type: 'json_object',
    },
    messages: [
      {
        role: 'system',
        content: `
            Tu es un collecteur de données de santé, tu dois analyser les messages reçus et envoyés pour collecter le plus d'informations possible.
            Ton aide est précieuse pour les professionnels de santé qui pourront mieux comprendre la situation du patient.
            Tu dois uniquement stocker des informations en français et les traduire en termes médicaux si possible.

            Voici le schéma JSON que tu dois suivre et retourner : ${JSON.stringify(collectedDataSchema)}.
            Tu dois impérativement respecter ce schéma pour que les données soient correctement traitées.
            Tu ne dois laisser aucune propriété vide, utilise "null" si nécessaire.
            Tu peux utiliser la fonction "validateJson" pour vérifier si ton schéma est correct.

            La propriété "levelImportance" est un nombre entre 1 et 5, où 1 est le plus bas (moins important) et 5 est le plus haut (très important).

            La propriété "relatedMessageId" est l'identifiant du message lié. Si le message te semble appartenir à la conversation en cours, tu dois le renseigner. Sinon, laisse la propriété vide pour signifier un nouveau message.

            Le message a été envoyé par ${content.userId ? 'le personnel médical' : 'le patient'}.
          `,
      },
      {
        role: 'user',
        content: content.message,
      },
    ],
    tools: [
      {
        type: 'function',
        function: {
          name: 'getPreviousMessageWithResponses',
          description:
            'Retourne le dernier message en date pour ce patient, avec les réponses associées.',
          function: getPreviousMessageWithResponses,
        },
      },
      {
        type: 'function',
        function: {
          name: 'validateJson',
          description:
            'Valide le schéma de données qui doit être retourné. Cette fonction retournera le schéma final si tout est correct.',
          function: validateJson,
          parse: parseCollectorSchemaArgs,
          parameters: collectedDataSchema,
        },
      },
    ],
  });

  // Get the final content
  const finalContent = await runner.finalContent();

  if (!finalContent) {
    return null;
  }

  return safeParse(CollectorSchema, JSON.parse(finalContent));
};
