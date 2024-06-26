import { error, json } from '@sveltejs/kit';
import { safeParse } from 'valibot';

import { type Message, messages } from '$server/db/schema/messages';
import { responses } from '$server/db/schema/responses';
import { validateSMS } from '$server/validators/sms';

import type { RequestHandler } from './$types';

const SMS_TYPE = {
  responses: 'responses',
  messages: 'messages',
} as const;

type Sms = keyof typeof SMS_TYPE;

type IaResult = {
  messageLinkId?: string; // The id message that supposed to be linked to the response
  data: string; // The data processed by the IA
  type: Sms; // The type of the sms
};

// Simulate IA processing, this should be replaced with the actual IA processing
const iaProcess = async (messages: Message[]): Promise<IaResult> => {
  await new Promise((resolve) => {
    setTimeout(() => {
      resolve('IA response');
    }, 3000);
  });

  return {
    type: messages.length > 0 ? SMS_TYPE.responses : SMS_TYPE.messages,
    data: 'data processed',
    messageLinkId: messages.length > 0 ? messages[0].id : undefined,
  };
};

export const POST: RequestHandler = async ({ request, locals }) => {
  const { db } = locals;

  // Get the sms body
  const values = await request.json();

  // Validate the sms body
  const result = safeParse(validateSMS, values);

  if (!result.success) {
    error(400, { message: 'Bad request', errors: result.issues });
  }

  const { phone, message } = result.output;

  // Find the patient by phone number
  const patient = await db.query.patients.findFirst({
    where: (patient, { eq }) => eq(patient.phone, phone),
    with: {
      messages: true,
    },
  });

  if (!patient) {
    error(404, { message: 'Patient not found' });
  }

  console.log(patient.messages.length);

  const { data, type, messageLinkId } = await iaProcess(patient.messages);

  // Save the response
  if (type === SMS_TYPE.responses && messageLinkId) {
    const newResponse = await db.insert(responses).values({
      data,
      content: message,
      patientId: patient.id,
      messageId: messageLinkId,
    });

    return json(newResponse, { status: 201, statusText: 'Created response' });
  }

  // Save the message
  const newMessage = await db.insert(messages).values({
    data,
    content: message,
    patientId: patient.id,
  });

  return json(newMessage, {
    status: 201,
    statusText: 'Created message',
  });
};
