import { error, json } from '@sveltejs/kit';
import { safeParse } from 'valibot';

import { SmsUserSchema } from '$lib/schemas/sms';

import { MercureTopic, type MercureTopicDataMappingWithTopic } from '$utils/mercure-topic';
import { messages } from '$server/db/schema/messages';
import { responses } from '$server/db/schema/responses';
import { MessageType } from '$server/schemas/collector';
import { collectorRunner } from '$server/utils/collector';
import { publishMercureTopic } from '$server/utils/mercure';

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

  // Find the patient by phone number
  const patient = await db.query.patients.findFirst({
    where: (patient, { eq }) => eq(patient.id, validatedData.output.patientId),
  });

  if (!patient) {
    error(404, { message: 'Patient introuvable.' });
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

    // Prepare the Mercure data
    const publishData = {
      patientId: patient.id,
      messageId: aiResponse.relatedMessageId,
      content: validatedData.output.message,
      phone: patient.phone,
      topic: MercureTopic.NewResponse,
      userId: user?.id,
    } satisfies MercureTopicDataMappingWithTopic[MercureTopic.NewResponse];

    // Dispatch to the Mercure hub
    await publishMercureTopic(fetch, {
      topic: MercureTopic.NewResponse,
      data: JSON.stringify(publishData),
    });

    return json(newResponse, { status: 201, statusText: 'Votre réponse à été envoyée.' });
  }

  // Save the message
  const newMessage = await db.insert(messages).values({
    data: aiResponse,
    content: validatedData.output.message,
    userId: user?.id,
    patientId: validatedData.output.patientId,
  });

  // Prepare the Mercure data
  const publishData = {
    patientId: patient.id,
    content: validatedData.output.message,
    phone: patient.phone,
    topic: MercureTopic.NewMessage,
    userId: user?.id,
  } satisfies MercureTopicDataMappingWithTopic[MercureTopic.NewMessage];

  // Dispatch to the Mercure hub
  await publishMercureTopic(fetch, {
    topic: MercureTopic.NewMessage,
    data: JSON.stringify(publishData),
  });

  return json(newMessage, { status: 201, statusText: 'Votre message à été envoyé.' });
}) satisfies RequestHandler;
