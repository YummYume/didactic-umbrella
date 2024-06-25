import { relations } from 'drizzle-orm';
import { mysqlTable, varchar } from 'drizzle-orm/mysql-core';

import { idable } from './extend-schema/idable';
import { timestampable } from './extend-schema/timestampable';
import { messages } from './messages';
import { responses } from './responses';
import { sessions } from './sessions';

export const users = mysqlTable('users', {
  ...idable,
  email: varchar('email', { length: 255 }).unique().notNull(),
  password: varchar('password', { length: 255 }).notNull(),
  firstName: varchar('first_name', { length: 255 }).notNull(),
  lastName: varchar('last_name', { length: 255 }).notNull(),
  ...timestampable,
});

export const usersRelations = relations(users, ({ many }) => ({
  sessions: many(sessions),
  messages: many(messages),
  responses: many(responses),
}));

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
