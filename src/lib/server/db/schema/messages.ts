import { relations } from 'drizzle-orm';
import { json, mysqlTable, text, varchar } from 'drizzle-orm/mysql-core';

import { identifiable } from './extend-schema/identifiable';
import { timestampable } from './extend-schema/timestampable';
import { patients } from './patients';
import { responses } from './responses';
import { users } from './users';

import type { CollectorSchemaType } from '$server/schemas/collector';

export const messages = mysqlTable('messages', {
  ...identifiable,
  content: text('content').notNull(),
  data: json('data').$type<CollectorSchemaType>().notNull(),
  userId: varchar('user_id', { length: 255 }).references(() => users.id),
  patientId: varchar('patient_id', { length: 255 })
    .references(() => patients.id)
    .notNull(),
  ...timestampable,
});

export const messagesRelations = relations(messages, ({ one, many }) => ({
  responses: many(responses),
  patient: one(patients, {
    fields: [messages.patientId],
    references: [patients.id],
  }),
  user: one(users, {
    fields: [messages.userId],
    references: [users.id],
  }),
}));

export type Message = typeof messages.$inferSelect;
export type NewMessage = typeof messages.$inferInsert;
