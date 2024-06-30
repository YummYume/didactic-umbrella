import { relations } from 'drizzle-orm';
import { json, mysqlTable, text, varchar } from 'drizzle-orm/mysql-core';

import { identifiable } from './extend-schema/identifiable';
import { timestampable } from './extend-schema/timestampable';
import { messages } from './messages';
import { users } from './users';

import type { CollectorSchemaType } from '$server/schemas/collector';

export const responses = mysqlTable('responses', {
  ...identifiable,
  content: text('content').notNull(),
  data: json('data').$type<CollectorSchemaType>().notNull(),
  messageId: varchar('message_id', { length: 255 })
    .notNull()
    .references(() => messages.id),
  userId: varchar('user_id', { length: 255 }).references(() => users.id),
  ...timestampable,
});

export const responsesRelations = relations(responses, ({ one }) => ({
  message: one(messages, {
    fields: [responses.messageId],
    references: [messages.id],
  }),
  user: one(users, {
    fields: [responses.userId],
    references: [users.id],
  }),
}));

export type Response = typeof responses.$inferSelect;
export type NewResponse = typeof responses.$inferInsert;
