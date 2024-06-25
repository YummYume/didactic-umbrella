import { migrate } from 'drizzle-orm/mysql2/migrator';

import { client, db } from '../../src/lib/server/db';
import drizzleConfig from '../drizzle.config';

if (drizzleConfig.out === undefined) {
  console.log('drizzleConfig.out is undefined.');
  process.exit();
}

await migrate(db, { migrationsFolder: drizzleConfig.out });

console.log('Migration complete.');

await client.end();

console.log('Connection closed.');

process.exit();
