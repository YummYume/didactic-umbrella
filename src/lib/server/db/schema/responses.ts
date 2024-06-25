import { relations } from 'drizzle-orm';
import { mysqlTable, text, varchar } from 'drizzle-orm/mysql-core';

import { idable } from './extend-schema/idable';
import { timestampable } from './extend-schema/timestampable';
import { messages } from './messages';
import { patients } from './patients';
import { users } from './users';

export const responses = mysqlTable('responses', {
  ...idable,
  content: text('content').notNull(),
  data: text('data').notNull(),
  messageId: varchar('message_id', { length: 255 })
    .notNull()
    .references(() => messages.id),
  userId: varchar('user_id', { length: 255 }).references(() => users.id),
  patientId: varchar('patient_id', { length: 255 }).references(() => patients.id),
  ...timestampable,
});

export const responsesRelations = relations(responses, ({ one }) => ({
  messages: one(messages, {
    fields: [responses.messageId],
    references: [messages.id],
  }),
  patient: one(patients, {
    fields: [responses.patientId],
    references: [patients.id],
  }),
  user: one(users, {
    fields: [responses.userId],
    references: [users.id],
  }),
}));

export type Response = typeof responses.$inferSelect;
export type NewResponse = typeof responses.$inferInsert;
