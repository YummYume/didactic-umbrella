import { error, json } from '@sveltejs/kit';
import { safeParse } from 'valibot';

import { CollectorSchema } from '$lib/schemas/collector';
import { SmsUserSchema } from '$lib/schemas/sms';

import { messages } from '$server/db/schema/messages';
import { responses } from '$server/db/schema/responses';
import { collectorRunner, MessageType } from '$server/utils/collector';

import type { RequestHandler } from './$types';

export const POST = (async ({ request, locals }) => {
  const { db, openai, user } = locals;

  // Get the sms body
  const data = await request.json();

  // Validate the sms body
  const validatedData = safeParse(SmsUserSchema, data);

  if (!validatedData.success) {
    error(400, { message: 'Veuillez saisir des données valide.', errors: validatedData.issues });
  }

  const runner = collectorRunner(
    openai,
    {
      message: validatedData.output.message,
      userId: user?.id,
      patientId: validatedData.output.patientId,
    },
    async (args: { userId?: string; patientId: string }) => {
      const { userId, patientId } = args;

      const messages = await db.query.messages.findMany({
        where: (message, { eq, isNull, and }) =>
          and(
            userId ? eq(message.userId, userId) : isNull(message.userId),
            eq(message.patientId, patientId),
          ),
      });

      return messages;
    },
  );

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
