import { relations } from 'drizzle-orm';
import { mysqlTable, varchar } from 'drizzle-orm/mysql-core';

import { identifiable } from './extend-schema/identifiable';
import { timestampable } from './extend-schema/timestampable';
import { messages } from './messages';
import { responses } from './responses';

export const patients = mysqlTable('patients', {
  ...identifiable,
  phone: varchar('phone', { length: 10 }).unique().notNull(),
  ...timestampable,
});

export const patientsRelations = relations(patients, ({ many }) => ({
  messages: many(messages),
  responses: many(responses),
}));

export type Patient = typeof patients.$inferSelect;
export type NewPatient = typeof patients.$inferInsert;
