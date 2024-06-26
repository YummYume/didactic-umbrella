import { migrate } from 'drizzle-orm/mysql2/migrator';
import { drizzle } from 'drizzle-orm/mysql2';
import mysql from 'mysql2/promise';
import { config } from 'dotenv';
import { loadDrizzleConfig } from '../drizzle-config-loader.ts';

config();

async function runMigrations() {
  const drizzleConfig = await loadDrizzleConfig();

  const connection = await mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
  });

  const db = drizzle(connection);

  if (!drizzleConfig.out) {
    console.error('drizzleConfig.out is undefined.');
    process.exit(1);
  }

  await migrate(db, { migrationsFolder: drizzleConfig.out });

  console.log('Migrations exécutées avec succès');
  await connection.end();
}

runMigrations().catch((err) => {
  console.error("Erreur lors de l'exécution des migrations:", err);
  process.exit(1);
});
