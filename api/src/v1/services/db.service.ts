import { createClient } from '@libsql/client';

const client = createClient({
    url: 'file:local.db',
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
