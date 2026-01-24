import dotenv from 'dotenv';

dotenv.config();

export const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
export const PORT = process.env.PORT;
export const LIBSQL_URL = process.env.LIBSQL_URL!;
export const LIBSQL_AUTH_TOKEN = process.env.LIBSQL_AUTH_TOKEN;