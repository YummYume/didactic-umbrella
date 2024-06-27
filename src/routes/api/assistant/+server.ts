import { toJSONSchema } from '@gcornut/valibot-json-schema';
import { error } from '@sveltejs/kit';
import { or } from 'drizzle-orm';
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
  parseAssistantGeneratePatientUrlArgs,
  parseAssistantQueryRecordsArgs,
} from '$server/schemas/assistant';
import { AssistantAllowedFrom, buildOrderBy, buildSearch } from '$server/utils/assistant';

import type { RequestHandler } from './$types';

/**
 * Default role given to the assistant.
 */
const ASSISTANT_ROLE_CONTENT = `Ton nom est Doc. Tu es un assistant médical pour le personel médical. Tu dois essayer de répondre au mieux possible à la requête du personnel médical. Il est important de ne pas donner de faux espoirs ou de fausses informations, et d'orienter le personnel médical du mieux possible. Tu peux et devrais répondre en Markdown pour formater tes réponses. N'oublie pas de rester professionnel et de ne pas donner de conseils médicaux. Le personnel médical n'est pas habitué à l'informatique et aux nouvelles technologies, donc tu dois être patient et clair dans tes réponses. Tu peux aussi demander des informations supplémentaires si tu en as besoin.`;

export const POST = (async ({ request, locals }) => {
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

          break;

        case AssistantAllowedFrom.Messages:
          qb = select.from(messages);

          break;

        case AssistantAllowedFrom.Responses:
          qb = select.from(responses);

          break;

        default:
          throw new Error(`Invalid table to query from: ${args.from}".`);
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
      const rawQuery = qb?.toString();

      console.error(`Error while querying records.`, `Raw query: ${rawQuery}`);

      throw e;
    }
  };

  /**
   * Function available to the assistant to generate a URL to a patient's profile.
   */
  const generatePatientUrl = (args: AssistantGeneratePatientUrlArgsSchemaType) => {
    return `${ORIGIN}/patient/${args.patientId}`;
  };

  const stream = locals.openai.beta.chat.completions.runTools({
    model: 'gpt-4-turbo',
    max_tokens: MESSAGE_MAX_LENGTH,
    stream: true,
    messages: [
      {
        role: 'system',
        content: ASSISTANT_ROLE_CONTENT,
      },
      ...validatedData.output.messages,
      { role: 'user', content: validatedData.output.content },
    ],
    tools: [
      {
        type: 'function',
        function: {
          name: 'queryRecords',
          description:
            'Fonction pour effectuer une requête dans la base de données en fonction de certains critères. Cette fonction retourne un tableau de résultats. Toutes les propriétés contenues dans `search` sont liées par un `OR` logique.',
          function: queryRecords,
          parse: parseAssistantQueryRecordsArgs,
          // @ts-expect-error - Likely a bug in the type definition from the library
          parameters: toJSONSchema({ schema: AssistantQueryRecordsArgsSchema }),
        },
      },
      {
        type: 'function',
        function: {
          name: 'generatePatientUrl',
          description:
            "Fonction pour générer l'URL vers la fiche d'un patient en fonction de son ID. Cette fonction retourne une chaîne de caractères.",
          function: generatePatientUrl,
          parse: parseAssistantGeneratePatientUrlArgs,
          // @ts-expect-error - Likely a bug in the type definition from the library
          parameters: toJSONSchema({ schema: AssistantGeneratePatientUrlArgsSchema }),
        },
      },
    ],
  });

  return new Response(stream.toReadableStream(), {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
    },
  });
}) satisfies RequestHandler;
