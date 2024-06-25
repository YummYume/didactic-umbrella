import { connection } from './connection';

const { MYSQL_DATABASE } = process.env;

if (!MYSQL_DATABASE) {
  throw new Error('Environment variable MYSQL_DATABASE is required.');
}

await connection.query(`CREATE DATABASE IF NOT EXISTS ${MYSQL_DATABASE};`);

console.log('Database created.');

await connection.end();

console.log('Connection closed.');

process.exit();
