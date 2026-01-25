# 🏥 Sushrut: AI-Powered Healthcare Assistant

Sushrut is a modern, AI-driven healthcare platform designed to provide accessible medical information 

## Live Demo: [Sushrut AI](https://sushrut-ai.netlify.app/)

## 🌟 Key Features

- **🤖 AI Consultation**: Intelligent chat interface for medical queries powered by Gemini/Google Generative AI.
- **📄 Medical Report Analysis**: Ability to process and understand medical reports/PDFs.
- **📱 PWA First**: A beautiful, mobile-optimized experience that works offline and is installable on any device.
- **🗄️ Secure Health Ledger**: Local and cloud-based storage for health metadata and history using LibSQL.
- **🧬 Knowledge Base**: Integrated medical knowledge retrieval for accurate information.

## 🏗️ Project Structure

The project is split into two main components:

- **[`/api`](./api)**: Fastify-based backend server
  - AI services integration (Gemini)
  - Vector database for RAG (Pinecone)
  - Document processing and ingestion
  - LibSQL database management
- **[`/app`](./app)**: Vanilla JS Progressive Web App
  - Modern Glassmorphism UI
  - Service Worker for offline support
  - Responsive medical chat interface

## 🚀 Getting Started

### Prerequisites

- Node.js (v18+)
- Local LibSQL or Turso account (for API)
- Pinecone DB API Key (for API)
- Google Cloud / Gemini API Key (for API)

### Quick Start

1. **Backend Setup**:
   ```bash
   cd api
   npm install
   npm run dev
   ```

2. **Frontend Setup**:
   ```bash
   cd app
   npm install
   npm run dev
   ```

## 🛠️ Tech Stack

- **Frontend**: Vanilla HTML/CSS/JS, Service Workers, Manifest API
- **Backend**: Fastify, TypeScript, Drizzle ORM, Pinecone
- **AI**: Google Generative AI (Gemini)
- **Database**: LibSQL
