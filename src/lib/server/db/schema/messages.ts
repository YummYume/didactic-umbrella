import { relations } from 'drizzle-orm';
import { mysqlTable, text, varchar } from 'drizzle-orm/mysql-core';

import { idable } from './extend-schema/idable';
import { timestampable } from './extend-schema/timestampable';
import { patients } from './patients';
import { users } from './users';

export const messages = mysqlTable('messages', {
  ...idable,
  content: text('content').notNull(),
  data: text('data').notNull(),
  userId: varchar('user_id', { length: 255 }).references(() => users.id),
  patientId: varchar('patient_id', { length: 255 }).references(() => patients.id),
  ...timestampable,
});

export const messagesRelations = relations(messages, ({ one }) => ({
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
