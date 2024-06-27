import { db } from '$server/db';

import type { Message } from '$server/db/schema/messages';

/**
 * Determine if the message is related to a previous message
 * @param args
 * @returns
 */
export async function isReladedToAMessage(args: { patientId: string }): Promise<Message[]> {
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
}
