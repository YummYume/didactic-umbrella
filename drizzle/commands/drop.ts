import { connection } from './connection';

const { MYSQL_DATABASE } = process.env;

if (!MYSQL_DATABASE) {
  throw new Error('Environment variable MYSQL_DATABASE is required.');
}

await connection.query(`DROP DATABASE IF EXISTS ${MYSQL_DATABASE};`);

console.log('Database dropped.');

await connection.end();

console.log('Connection closed.');

process.exit();
