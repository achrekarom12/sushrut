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
      healthMetadata TEXT,
      createdAt TEXT NOT NULL
    )
  `);

  // Ensure healthMetadata column exists for existing tables
  try {
    await client.execute('ALTER TABLE users ADD COLUMN healthMetadata TEXT');
  } catch (e) {
    // Column might already exist, ignore error
  }
};
