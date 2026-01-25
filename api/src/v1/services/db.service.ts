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
      languagePreference TEXT DEFAULT 'english',
      createdAt TEXT NOT NULL
    )
  `);

  // Ensure healthMetadata column exists for existing tables
  try {
    await client.execute('ALTER TABLE users ADD COLUMN healthMetadata TEXT');
  } catch (e) {
    // Column might already exist, ignore error
  }

  // Ensure languagePreference column exists for existing tables
  try {
    await client.execute("ALTER TABLE users ADD COLUMN languagePreference TEXT DEFAULT 'english'");
  } catch (e) {
    // Column might already exist, ignore error
  }

  // Initialize voltagent memory tables
  await client.execute(`
    CREATE TABLE IF NOT EXISTS voltagent_memory_conversations (
      id TEXT PRIMARY KEY,
      resource_id TEXT NOT NULL,
      user_id TEXT NOT NULL,
      title TEXT NOT NULL,
      metadata TEXT NOT NULL,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    )
  `);

  await client.execute(`
    CREATE TABLE IF NOT EXISTS voltagent_memory_messages (
      conversation_id TEXT NOT NULL,
      message_id TEXT NOT NULL,
      user_id TEXT NOT NULL,
      role TEXT NOT NULL,
      parts TEXT NOT NULL,
      metadata TEXT,
      format_version INTEGER DEFAULT 2,
      created_at TEXT NOT NULL,
      PRIMARY KEY (conversation_id, message_id)
    )
  `);
};
