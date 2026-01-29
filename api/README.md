# Sushrut API

The backend API for **Sushrut**, a high-performance medical assistant platform built with Fastify, TypeScript, and Google Gemini AI.

## 🚀 Features

- **AI-Powered Diagnostics**: leverage Google Gemini AI for medical report analysis and assistant interactions.
- **Vector Search**: Integrated Pinecone vector database for high-performance medical knowledge retrieval (RAG).
- **Secure File Handling**: Multipart support for PDF uploads with automated text extraction and vector ingestion.
- **Robust Storage**: Google Cloud Storage integration for secure medical record management.
- **Type-Safe**: Built with TypeScript and Zod for comprehensive schema validation.
- **Modern Architecture**: Fastify-based plugin system with automated route loading.

## 🛠️ Tech Stack

- **Framework**: [Fastify](https://www.fastify.io/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **AI Engine**: [Google Gemini AI](https://ai.google.dev/)
- **Vector Database**: [Pinecone](https://www.pinecone.io/)
- **Database**: [LibSQL](https://turso.tech/libsql) (compatible with SQLite)
- **Object Storage**: [Google Cloud Storage](https://cloud.google.com/storage)
- **Validation**: [Zod](https://zod.dev/) & [Fluent-JSON-Schema](https://github.com/fastify/fluent-json-schema)

## 📋 Prerequisites

- **Node.js**: `^20.x`
- **npm** or **pnpm**
- **Pinecone Account** & Index
- **Google Cloud Project** (for Gemini & GCS)
- **LibSQL/Turso Database**

## ⚙️ Installation

1. **Clone the repository**:
   ```bash
   git clone <repository-url>
   cd api
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Environment Setup**:
   Create a `.env` file in the `api` root:
   ```env
   PORT=4000
   GEMINI_API_KEY=your_gemini_api_key
   LIBSQL_URL=your_libsql_url
   LIBSQL_AUTH_TOKEN=your_libsql_token
   GCP_PROJECT_ID=your_gcp_project_id
   GCS_BUCKET_NAME=your_gcs_bucket_name
   PINECONE_API_KEY=your_pinecone_api_key
   PINECONE_INDEX_NAME=your_pinecone_index_name
   PINECONE_INDEX_HOST=your_pinecone_index_host
   ```

## 📖 Available Scripts

| Script | Description |
| :--- | :--- |
| `npm run dev` | Starts the development server with `ts-node` |
| `npm run build` | Compiles TypeScript to JavaScript in `dist/` |
| `npm run start` | Runs the compiled server from `dist/` |
| `npm run ingest` | Runs the PDF ingestion service to populate Pinecone |
| `npm run clean` | Deletes the `dist/` folder |

## 🛣️ API Endpoints

The API is versioned under `/v1`. Documentation is automatically generated and available at:
`http://localhost:4000/docs`

### Key Modules:
- `/v1/ai`: Endpoints for chat, report analysis, and medical assistant logic.
- `/v1/users`: User profile, authentication, and medical record management.

## 📂 Project Structure

```
api/
├── src/
│   ├── app.ts            # Fastify application setup
│   ├── index.ts          # Server entry point
│   ├── v1/
│   │   ├── routes/       # API route definitions
│   │   ├── controllers/  # Request handlers
│   │   ├── services/     # Business logic & integrations
│   │   ├── schemas/      # Zod/JSON schemas
│   │   └── types/        # TypeScript interfaces
├── data/                 # Local data storage/cache
└── dist/                 # Compiled output
```

## 🐳 Docker Support

A `Dockerfile` is provided for containerized deployment.

```bash
docker build -t sushrut-api .
docker run -p 4000:4000 --env-file .env sushrut-api
```

## 📄 License

This project is licensed under the MIT License.
