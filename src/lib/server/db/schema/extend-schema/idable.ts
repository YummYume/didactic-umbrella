import { randomUUID } from 'crypto';
import { varchar } from 'drizzle-orm/mysql-core';

export const idable = {
  id: varchar('id', { length: 255 })
    .$defaultFn(() => randomUUID())
    .primaryKey(),
};
