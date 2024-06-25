import { relations } from 'drizzle-orm';
import { mysqlTable, text } from 'drizzle-orm/mysql-core';

import { idable } from './extend-schema/idable';
import { timestampable } from './extend-schema/timestampable';
import { messages } from './messages';
import { responses } from './responses';

export const patients = mysqlTable('patients', {
  ...idable,
  phone: text('phone').notNull(),
  ...timestampable,
});

export const patientsRelations = relations(patients, ({ many }) => ({
  messages: many(messages),
  responses: many(responses),
}));

export type Patient = typeof patients.$inferSelect;
export type NewPatient = typeof patients.$inferInsert;
