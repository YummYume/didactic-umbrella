import mysql from 'mysql2/promise';

const { MYSQL_SERVICE_URL, MYSQL_DATABASE } = process.env;

if (!MYSQL_SERVICE_URL) {
  throw new Error('Environment variable MYSQL_SERVICE_URL is required.');
}

if (!MYSQL_DATABASE) {
  throw new Error('Environment variable MYSQL_DATABASE is required.');
}

const client = await mysql.createConnection(MYSQL_SERVICE_URL);

await client.query(`CREATE DATABASE IF NOT EXISTS ${MYSQL_DATABASE};`);

console.log('Database created.');

await client.end();

console.log('Connection closed.');

process.exit();
