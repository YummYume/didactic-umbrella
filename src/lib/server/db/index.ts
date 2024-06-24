import { drizzle } from 'drizzle-orm/mysql2';
import mysql from 'mysql2/promise';

import { env } from '$env/dynamic/private';

const client = await mysql.createConnection(env.DATABASE_URL);

export const db = drizzle(client);
