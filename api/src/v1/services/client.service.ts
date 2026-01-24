import { google, createGoogleGenerativeAI, GoogleGenerativeAIProvider } from '@ai-sdk/google';
import { GEMINI_API_KEY } from "../../env";
import { EmbeddingAdapterInput } from "@voltagent/core";

type IProvider = GoogleGenerativeAIProvider;

export async function getProvider(): Promise<IProvider> {
    if (!GEMINI_API_KEY) {
        throw new Error("GEMINI_API_KEY is not set");
    }
    return createGoogleGenerativeAI({
        apiKey: GEMINI_API_KEY,
    });
}

export function getEmbeddingModel(): EmbeddingAdapterInput {
    if (!GEMINI_API_KEY) {
        throw new Error("GEMINI_API_KEY is not set");
    }
    const client = createGoogleGenerativeAI({
        apiKey: GEMINI_API_KEY,
    });
    return client.embedding('gemini-embedding-001');
}
