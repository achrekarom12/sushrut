import dotenv from 'dotenv';

dotenv.config();

export const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
export const PORT = process.env.PORT;
export const LIBSQL_URL = process.env.LIBSQL_URL!;
export const LIBSQL_AUTH_TOKEN = process.env.LIBSQL_AUTH_TOKEN;
export const GCP_PROJECT_ID = process.env.GCP_PROJECT_ID;
export const GCS_BUCKET_NAME = process.env.GCS_BUCKET_NAME;