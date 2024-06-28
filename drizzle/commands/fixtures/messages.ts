import { desc, eq } from 'drizzle-orm';

import { db } from '../../../src/lib/server/db';
import { messages } from '../../../src/lib/server/db/schema/messages';
import { patients } from '../../../src/lib/server/db/schema/patients';
import { responses } from '../../../src/lib/server/db/schema/responses';
import { users } from '../../../src/lib/server/db/schema/users';
import { MessageCategory, MessageType } from '../../../src/lib/server/utils/collector';

import type { CollectorSchemaType } from '../../../src/lib/schemas/collector';

type NewAnswer = {
  content: string;
  data: CollectorSchemaType;
  userEmail?: string;
};

type NewMessage = {
  phone: string;
  content: string;
  data: CollectorSchemaType;
  userEmail?: string;
  responses?: NewAnswer[];
};

const newMessages: NewMessage[] = [
  {
    phone: '0608977564',
    content: 'Bonjour, comment allez-vous depuis votre consultation de la semaine dernière ?',
    userEmail: 'michaelscott@calmedica.com',
    data: {
      type: MessageType.Message,
      category: MessageCategory.Normal,
      intent: "Connaitre l'état de santé du patient",
      levelImportance: 2,
      subject: 'Nouvelle consultation',
      information: {
        details: null,
        onset: 'Semaine dernière',
        extraInformation: null,
        symptom: null,
      },
    },
    responses: [
      {
        content: 'Je suis toujours en bonne santé, merci de prendre de mes nouvelles.',
        data: {
          type: MessageType.Response,
          category: MessageCategory.Normal,
          levelImportance: 1,
          subject: 'Etat de santé',
          intent: 'Répondre à la question',
          information: {
            details: null,
            onset: null,
            symptom: null,
            extraInformation: 'Le patient est en bonne santé',
          },
        },
      },
    ],
  },
];

export const seedMessages = async () => {
  console.log('Seeding messages...');

  try {
    await Promise.all(
      newMessages.map(async (newMessage) => {
        const patient = await db.query.patients.findFirst({
          where: eq(patients.phone, newMessage.phone),
        });

        if (!patient) {
          console.log(`Patient with phone ${newMessage.phone} not found.`);

          return;
        }

        let userId: undefined | string = undefined;

        if (newMessage.userEmail) {
          const user = await db.query.users.findFirst({
            where: eq(users.email, newMessage.userEmail),
          });

          if (user) {
            userId = user.id;
          }
        }

        await db.insert(messages).values({
          content: newMessage.content,
          data: newMessage.data,
          patientId: patient.id,
          userId,
        });

        const insertedMessage = await db.query.messages.findFirst({
          where: eq(messages.patientId, patient.id),
          orderBy: [desc(messages.createdAt)],
        });

        if (!insertedMessage) {
          console.log(`Message with content ${newMessage.content} not found.`);

          return;
        }

        if (newMessage.responses) {
          await Promise.all(
            newMessage.responses.map(async (newAnswer) => {
              let responseUserId: undefined | string = undefined;

              if (newAnswer.userEmail) {
                const user = await db.query.users.findFirst({
                  where: eq(users.email, newAnswer.userEmail),
                });

                if (user) {
                  responseUserId = user.id;
                }
              }

              await db.insert(responses).values({
                content: newAnswer.content,
                data: newAnswer.data,
                userId: responseUserId,
                messageId: insertedMessage.id,
              });
            }),
          );
        }
      }),
    );

    console.log(`${newMessages.length} messages created`);
  } catch (error) {
    console.log('Failed to create messages');
    console.error(error);
  }
};
