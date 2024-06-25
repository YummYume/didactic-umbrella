import { timestamp } from 'drizzle-orm/mysql-core';

export const timestampable = {
  createdAt: timestamp('created_at', {
    mode: 'date',
  })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp('updated_at', {
    mode: 'date',
  })
    .defaultNow()
    .notNull(),
};
