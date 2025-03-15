const { Client } = require('pg');
const dotenv = require('dotenv');

dotenv.config();

const dbClient = new Client({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

const connect = async () => {
  await dbClient.connect();
};

const executeQuery = async (query, params) => {
  const res = await dbClient.query(query, params);
  return res.rows;
};

const disconnect = async () => {
  await dbClient.end();
};

module.exports = { connect, executeQuery, disconnect };