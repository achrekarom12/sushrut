import { createClient } from '@libsql/client';
import { LIBSQL_URL, LIBSQL_AUTH_TOKEN } from '../../env';
const client = createClient({
    url: LIBSQL_URL,
    authToken: LIBSQL_AUTH_TOKEN,
});

export const db = client;

export const initDb = async () => {
    await client.execute(`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      age INTEGER NOT NULL,
      phonenumber TEXT NOT NULL,
      gender TEXT NOT NULL,
      password TEXT,
      createdAt TEXT NOT NULL
    )
  `);
};
