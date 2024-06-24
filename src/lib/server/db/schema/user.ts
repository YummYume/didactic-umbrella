import { int, mysqlTable, serial, text } from 'drizzle-orm/mysql-core';

export const user = mysqlTable('user', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  age: int('age'),
});
