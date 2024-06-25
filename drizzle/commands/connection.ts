import mysql from 'mysql2/promise';

const { MYSQL_SERVICE_URL } = process.env;

if (!MYSQL_SERVICE_URL) {
  throw new Error('Environment variable MYSQL_SERVICE_URL is required.');
}

// Create a connection to the database service for creating and dropping databases.
export const connection = await mysql.createConnection(MYSQL_SERVICE_URL);
