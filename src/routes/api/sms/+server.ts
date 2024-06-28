import { toJSONSchema } from '@gcornut/valibot-json-schema';
import { error, json } from '@sveltejs/kit';
import { safeParse } from 'valibot';

import {
  CollectorQueryArgsSchema,
  CollectorSchema,
  parseCollectorQueryArgs,
} from '$lib/schemas/collector';
import { SmsSchema } from '$lib/schemas/sms';

import { type Message, messages } from '$server/db/schema/messages';
import { responses } from '$server/db/schema/responses';
import { MessageCategory, MessageType } from '$server/utils/collector';

import type { RequestHandler } from './$types';

export const POST = (async ({ request, locals }) => {
  const { db, openai } = locals;

  // Get the sms body
  const data = await request.json();

  // Validate the sms body
  const validatedData = safeParse(SmsSchema, data);

  if (!validatedData.success) {
    error(400, { message: 'Veuillez saisir des données valide.', errors: validatedData.issues });
  }

  // Find the patient by phone number
  const patient = await db.query.patients.findFirst({
    where: (patient, { eq }) => eq(patient.phone, validatedData.output.phone),
  });

  if (!patient) {
    error(404, { message: 'Numéro invalide.' });
  }

  const isReladedToAMessage = async (args: { patientId: string }): Promise<Message[]> => {
    const { patientId } = args;

    const patient = await db.query.patients.findFirst({
      where: (patient, { eq }) => eq(patient.id, patientId),
      with: {
        messages: true,
      },
    });

    if (!patient) {
      return [];
    }

    return patient.messages;
  };

  const runner = openai.beta.chat.completions.runTools({
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
          "relatedMessageId": "l'id du message lié, si seulement le message te semble être une réponse à un message précédent"
        }.
        Tu dois respecter le format de la réponse,
        Tu auras l'id du patient pour lequel tu devras analyser le message en plus du message.
        `,
      },
      {
        role: 'user',
        content: JSON.stringify({ message: validatedData.output.message, patientId: patient.id }),
      },
    ],
    tools: [
      {
        type: 'function',
        function: {
          name: 'isReladedToAMessage',
          description: 'Détermine si le message est lié à un message précédent.',
          function: isReladedToAMessage,
          parse: parseCollectorQueryArgs,
          // @ts-expect-error - Likely a bug in the type definition from the library
          parameters: toJSONSchema({ schema: CollectorQueryArgsSchema }),
        },
      },
    ],
  });

  // Get the final content
  const finalContent = await runner.finalContent();

  // Check if the final content is valid
  if (!finalContent) {
    error(500, {
      message: "Une erreur s'est produite, veuillez réessayer.",
    });
  }

  // Check if the final content is an error
  const value: { error: string } = JSON.parse(finalContent);

  if (value.error) {
    error(400, { message: 'Votre message est innaproprié.' });
  }

  // Validate the final content
  const validatedDataAi = safeParse(CollectorSchema, JSON.parse(finalContent));

  if (!validatedDataAi.success) {
    error(500, {
      message: "Une erreur s'est produite, veuillez réessayer.",
    });
  }

  // Get the response
  const aiResponse = validatedDataAi.output;

  // Save the response
  if (aiResponse.type === MessageType.Response && aiResponse.relatedMessageId) {
    const newResponse = await db.insert(responses).values({
      data: aiResponse,
      content: validatedData.output.message,
      messageId: aiResponse.relatedMessageId,
    });

    return json(newResponse, { status: 201, statusText: 'Votre réponse à été enregistré' });
  }

  // Save the message
  const newMessage = await db.insert(messages).values({
    data: aiResponse,
    content: validatedData.output.message,
    patientId: patient.id,
  });

  return json(newMessage, { status: 201, statusText: 'Votre message à été enregistré' });
}) satisfies RequestHandler;
