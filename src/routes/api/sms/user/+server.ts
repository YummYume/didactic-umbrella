import { error, json } from '@sveltejs/kit';
import { safeParse } from 'valibot';

import { SmsUserSchema } from '$lib/schemas/sms';

import { messages } from '$server/db/schema/messages';
import { responses } from '$server/db/schema/responses';
import { MessageType } from '$server/schemas/collector';
import { collectorRunner } from '$server/utils/collector';

import type { RequestHandler } from './$types';

export const POST = (async ({ request, locals }) => {
  const { db, openai, user } = locals;

  // Get the SMS body
  const data = await request.json();

  // Validate the SMS body
  const validatedData = safeParse(SmsUserSchema, data);

  if (!validatedData.success) {
    error(400, { message: 'Veuillez saisir des données valide.', errors: validatedData.issues });
  }

  const validatedDataAi = await collectorRunner(openai, db, {
    message: validatedData.output.message,
    userId: user?.id,
    patientId: validatedData.output.patientId,
  });

  if (!validatedDataAi?.success) {
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
      userId: user?.id,
    });

    return json(newResponse, { status: 201, statusText: 'Votre réponse à été enregistré' });
  }

  // Save the message
  const newMessage = await db.insert(messages).values({
    data: aiResponse,
    content: validatedData.output.message,
    userId: user?.id,
    patientId: validatedData.output.patientId,
  });

  return json(newMessage, { status: 201, statusText: 'Votre message à été enregistré' });
}) satisfies RequestHandler;
