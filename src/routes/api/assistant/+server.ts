import { toJSONSchema } from '@gcornut/valibot-json-schema';
import { error } from '@sveltejs/kit';
import { eq, or } from 'drizzle-orm';
import { safeParse } from 'valibot';

import { AssistantMessageSchema } from '$lib/schemas/message';
import { ORIGIN } from '$env/static/private';

import { MESSAGE_MAX_LENGTH } from '$utils/message';
import { messages } from '$server/db/schema/messages';
import { patients } from '$server/db/schema/patients';
import { responses } from '$server/db/schema/responses';
import {
  AssistantGeneratePatientUrlArgsSchema,
  type AssistantGeneratePatientUrlArgsSchemaType,
  AssistantQueryRecordsArgsSchema,
  type AssistantQueryRecordsArgsSchemaType,
  AssistantSendSmsArgsSchema,
  type AssistantSendSmsArgsSchemaType,
  parseAssistantGeneratePatientUrlArgs,
  parseAssistantQueryRecordsArgs,
  parseAssistantSendSmsArgs,
} from '$server/schemas/assistant';
import { CollectorSchema } from '$server/schemas/collector';
import { AssistantAllowedFrom, buildOrderBy, buildSearch } from '$server/utils/assistant';

import type { ChatCompletionMessageParam } from 'openai/resources/index.mjs';
import type { RequestHandler } from './$types';

/**
 * Default role given to the assistant.
 */
const ASSISTANT_ROLE_CONTENT = `
  Ton nom est Doc. Tu es un assistant médical pour le personnel médical, qui sont les utilisateurs de cette application. Tu dois essayer de répondre au mieux possible à chaque requête soumise. Il est important de ne pas donner de faux espoirs ou de fausses informations, et d'orienter le personnel médical du mieux possible.

  Le personnel médical n'est pas habitué à l'informatique et aux nouvelles technologies, donc tu dois être patient et clair dans tes réponses. Tu peux aussi demander des informations supplémentaires si tu en as besoin.

  Lorsque le personnel médical te demande la fiche d'un patient, tu dois essayer de leur donner l'URL de la fiche du patient. Tu dois chercher l'ID du ou des patients dans la base de données pour récupérer leur ID et générer l'URL. N'invente pas d'ID de patient, et ne donne pas d'URLs invalides.

  Tu peux et devrais répondre en Markdown pour formater tes réponses. Tes réponses devraient être claires et concises, mais également informatives et utiles au personnel médical. Essaie d'être courtois et de ne pas être trop formel. Essaie aussi de leur donner des informations sur le patient si tu en as. Ne donne aucun conseil médical, sous aucun prétexte.
`;

export const POST = (async ({ request, locals, fetch }) => {
  const { user } = locals;

  if (!user) {
    throw error(401, 'Vous devez être connecté pour accéder à cette ressource.');
  }

  const data = await request.json();
  const validatedData = safeParse(AssistantMessageSchema, data);

  if (!validatedData.success) {
    throw error(400, validatedData.issues.map((issue) => issue.message).join('\n'));
  }

  /**
   * Function available to the assistant to query records from the database.
   */
  const queryRecords = async (args: AssistantQueryRecordsArgsSchemaType) => {
    const select = locals.db.select();

    let qb: undefined | ReturnType<(typeof select)['from']> = undefined;

    try {
      // First, select the table to query from
      switch (args.from) {
        case AssistantAllowedFrom.Patients:
          qb = select.from(patients);

          qb.leftJoin(messages, eq(patients.id, messages.patientId)).leftJoin(
            responses,
            eq(messages.id, responses.messageId),
          );

          break;

        case AssistantAllowedFrom.Messages:
          qb = select.from(messages);

          qb.leftJoin(patients, eq(messages.patientId, patients.id)).leftJoin(
            responses,
            eq(messages.id, responses.messageId),
          );

          break;

        case AssistantAllowedFrom.Responses:
          qb = select.from(responses);

          qb.leftJoin(messages, eq(responses.messageId, messages.id)).leftJoin(
            patients,
            eq(messages.patientId, patients.id),
          );

          break;

        default:
          throw new Error(`Invalid table to query from: "${args.from}".`);
      }

      // Handle the search argument
      const orX = buildSearch(args.search);

      if (orX.length > 0) {
        qb.where(or(...orX));
      }

      // Handle the orderBy argument
      const orders = buildOrderBy(args.orderBy);

      if (orders.length > 0) {
        qb.orderBy(...orders);
      }

      // Handle the pagination
      // PerPage is set to 10 by default
      qb.limit(args.perPage);

      // If the page is greater than 1 (the default), offset the query
      if (args.page > 1) {
        qb.offset((args.page - 1) * args.perPage);
      }

      // Execute the query
      const results = await qb.execute();

      return results;
    } catch (e) {
      const rawQuery = qb?.toSQL();

      console.error(`Error while querying records.`, `Raw query: ${rawQuery?.sql}`);

      throw e;
    }
  };

  /**
   * Function available to the assistant to generate URLs to patient records.
   */
  const generatePatientsUrls = (args: AssistantGeneratePatientUrlArgsSchemaType) => {
    return args.patientIds.map((patientId) => `${ORIGIN}/admin/patients/${patientId}`);
  };

  /**
   * Function to send an SMS to a patient.
   */
  const sendSms = async (args: AssistantSendSmsArgsSchemaType) => {
    const { message, patientId } = args;

    if (!message || !patientId) {
      throw new Error('Empty message or patient ID.');
    }

    try {
      const response = await fetch('/api/sms/user', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          patientId,
          message,
        }),
      });

      if (!response.ok) {
        const data = await response.json();

        console.error('Error while sending SMS', data);
        throw new Error(data.message);
      }

      return { success: true };
    } catch (e) {
      console.error('Error while sending SMS', e);
      console.error(e);

      throw e;
    }
  };

  // @ts-expect-error - Likely a bug in the type definition from the library
  const collectedDataSchema = toJSONSchema({ schema: CollectorSchema });

  let chatMessages: ChatCompletionMessageParam[] = [
    {
      role: 'system',
      content: ASSISTANT_ROLE_CONTENT,
    },
    {
      role: 'system',
      content: `L'utilisateur actuel s'appelle ${user.firstName} ${user.lastName}. Son ID est ${user.id}. Tu peux utiliser son prénom et son nom pour personnaliser tes réponses, mais ne lui communique pas son ID. Tu peux cependant utiliser son ID pour effectuer des requêtes dans la base de données si nécessaire. La date et l'heure actuelles sont ${new Date().toLocaleString()}. Si on te demande d'envoyer un SMS, tu dois toujours demander une confirmation avec le contenu du message avant de l'envoyer. En plus, tu afficheras un message pour lui indiquer que le SMS est en cours d'envoi, et si l'envoi a réussi tu lui enverras un message de confirmation. Tu dois toujours vérifier que le numéro de téléphone est valide avant d'envoyer un SMS.`,
    },
  ];

  if (validatedData.output.context) {
    chatMessages = [...chatMessages, { role: 'system', content: validatedData.output.context }];
  }

  chatMessages = [
    ...chatMessages,
    ...validatedData.output.messages,
    { role: 'user', content: validatedData.output.content },
  ];

  const stream = locals.openai.beta.chat.completions
    .runTools({
      model: 'gpt-4-turbo',
      max_tokens: MESSAGE_MAX_LENGTH,
      stream: true,
      messages: chatMessages,
      tools: [
        {
          type: 'function',
          function: {
            name: 'queryRecords',
            description: `Fonction pour effectuer une requête dans la base de données en fonction de certains critères. Cette fonction retourne un tableau de résultats. Toutes les propriétés contenues dans "search" sont liées par un "OR" logique. La propriété "data" dans "messages" et "responses" contient le schéma suivant : ${collectedDataSchema}. La propriété "levelImportance" va de 1 à 5, où 1 est le plus bas et 5 est le plus haut.`,
            function: queryRecords,
            parse: parseAssistantQueryRecordsArgs,
            // @ts-expect-error - Likely a bug in the type definition from the library
            parameters: toJSONSchema({ schema: AssistantQueryRecordsArgsSchema }),
          },
        },
        {
          type: 'function',
          function: {
            name: 'generatePatientsUrls',
            description:
              "Fonction pour générer les URLs absolues vers les fiches des patients en fonction de leurs identifiants. Cette fonction retourne un tableau d'URLs, dans le même ordre que les identifiants des patients fournis. Les identifiants des patients sont contenus dans la propriété 'id' de la table 'patients'.",
            function: generatePatientsUrls,
            parse: parseAssistantGeneratePatientUrlArgs,
            // @ts-expect-error - Likely a bug in the type definition from the library
            parameters: toJSONSchema({ schema: AssistantGeneratePatientUrlArgsSchema }),
          },
        },
        {
          type: 'function',
          function: {
            name: 'sendSms',
            description: `Fonction pour envoyer un SMS à un patient. Cette fonction prend en paramètre le contenu du message à envoyer, et l'identifiant du patient à contacter. Elle retourne un objet avec une propriété "success" à "true" si l'envoi a réussi.`,
            function: sendSms,
            parse: parseAssistantSendSmsArgs,
            // @ts-expect-error - Likely a bug in the type definition from the library
            parameters: toJSONSchema({ schema: AssistantSendSmsArgsSchema }),
          },
        },
      ],
    })
    .on('error', (e) => {
      console.error('Error while contacting AI', e);
    });
  return new Response(stream.toReadableStream(), {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
    },
  });
}) satisfies RequestHandler;
