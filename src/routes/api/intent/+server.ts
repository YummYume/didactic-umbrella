import { error } from '@sveltejs/kit';
import { safeParse } from 'valibot';

import { AssistantMessageSchema } from '$lib/schemas/assistant';
import { IntentSchema } from '$lib/schemas/intent';

import type { ChatCompletionMessageParam } from 'openai/resources/index.mjs';
import type { RequestHandler } from './$types';

const DATA = [
  {
    id: 1,
    name: 'John Doe',
    phone: '0606123456',
    lastProcessedAt: '2021-01-01',
    data: {},
  },
  {
    id: 2,
    name: 'Jane Doe',
    phone: '0606123457',
    lastProcessedAt: '2021-01-02',
    data: {},
  },
  {
    id: 3,
    name: 'John Smith',
    phone: '0706123458',
    lastProcessedAt: new Date().toISOString().split('T')[0],
    data: {},
  },
];

export const GET = (async ({ request, locals }) => {
  const data = await request.json();
  const validatedData = safeParse(AssistantMessageSchema, data);

  if (!validatedData.success) {
    throw error(400, validatedData.issues.join(', '));
  }

  const response = await locals.openai.chat.completions.create({
    model: 'gpt-4-turbo',
    response_format: {
      type: 'json_object',
    },
    messages: [
      {
        role: 'system',
        content: `Tu es responsable de trouver l'intention de la demande de l'utilisateur. Tu dois répondre dans un format JSON, indiquant les bonnes clés en fonction du schéma TypeScript suivant : { search: "clients|client|null", property?: "phone|name|undetermined", query?: "string", startDate?: "string", endDate?: "string" }. La seule clé obligatoire est "search". Elle peut être nulle si l'utilisateur n'a pas fait de demande spécifique. La clé "property" est facultative et peut représenter une propriété que l'utilisateur a utilisée pour rechercher un client. Elle peut également être "undetermined" pour spécifier que tous les champs doivent être vérifiés. La clé "query" doit être spécifiée pour nous informer de ce que l'on recherche sur la propriété donnée. Elle peut également ne pas être présente si elle n'est pas pertinente pour la demande de l'utilisateur. Les clés "startDate" et "endDate" sont toutes deux facultatives et peuvent représenter une date à laquelle l'utilisateur souhaite rechercher. Elles peuvent également représenter une plage entre la date de début et la date de fin. La date d'aujourd'hui est ${new Date().toISOString().split('T')[0]}. Tu ne dois pas ajouter de clés autres. Exemple : { search: "clients", property: "phone", query: "0706", startDate: "2021-01-01", endDate: "2021-01-31" }.`,
      },
      { role: 'user', content: validatedData.output.content },
    ],
  });
  const choices = response.choices;
  const choice = choices.at(-1);

  let foundData: string | null = null;

  if (choice && choice.message.content) {
    const intent = safeParse(IntentSchema, JSON.parse(choice.message.content));

    if (intent && intent.success) {
      const { search, property, query, startDate, endDate } = intent.output;

      // TODO real search

      foundData = DATA.reduce((acc, item) => `${acc} ${JSON.stringify(item)}`, '');
    }
  }

  const messages: ChatCompletionMessageParam[] = [
    {
      role: 'system',
      content: `Tu es un assistant médical pour le personel médical. Tu dois essayer de répondre au mieux possible à la requête du personnel. Dans certains cas, tu obtienderas des informations supplémentaires que nous te donnerons après analyse de la requête de l'utilisateur. Tu pourras alors les utiliser pour répondre à la demande de l'utilisateur.`,
    },
    ...validatedData.output.messages,
    { role: 'user', content: validatedData.output.content },
  ];

  if (foundData) {
    messages.push({
      role: 'system',
      content: `Voici les données trouvées qui pourraient correspondre à la demande de l'utilisateur : ${foundData}`,
    });
  }

  const stream = await locals.openai.chat.completions.create({
    model: 'gpt-4',
    messages,
    stream: true,
  });

  return new Response(stream.toReadableStream(), {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
    },
  });
}) satisfies RequestHandler;
