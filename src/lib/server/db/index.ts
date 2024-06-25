import { DrizzleMySQLAdapter } from '@lucia-auth/adapter-drizzle';
import { drizzle } from 'drizzle-orm/mysql2';
import mysql from 'mysql2/promise';

import { messages, messagesRelations } from './schema/messages';
import { patients, patientsRelations } from './schema/patients';
import { responses, responsesRelations } from './schema/responses';
import { sessions, sessionsRelations } from './schema/sessions';
import { users, usersRelations } from './schema/users';

if (!process.env.DATABASE_URL) {
  throw new Error('Environment variable DATABASE_URL is required.');
}

export const client = await mysql.createConnection(process.env.DATABASE_URL);

export const db = drizzle(client, {
  schema: {
    sessions,
    sessionsRelations,
    users,
    usersRelations,
    patients,
    patientsRelations,
    messages,
    messagesRelations,
    responses,
    responsesRelations,
  },
  mode: 'default',
});

export const adapter = new DrizzleMySQLAdapter(db, sessions, users);
