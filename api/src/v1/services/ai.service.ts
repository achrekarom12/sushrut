import { Agent, Memory } from "@voltagent/core";
import { getProvider, getEmbeddingModel } from "./client.service";
import { LibSQLMemoryAdapter, LibSQLVectorAdapter } from "@voltagent/libsql";
import { LIBSQL_URL, LIBSQL_AUTH_TOKEN } from "../../env";

async function getModel() {
  const provider = await getProvider();
  const model = provider('gemini-2.5-flash-lite');
  return model;
}

const memory = new Memory({
  storage: new LibSQLMemoryAdapter({
    url: LIBSQL_URL,
    authToken: LIBSQL_AUTH_TOKEN,
  }),
  workingMemory: {
    enabled: true,
    scope: "user",
  },
  vector: new LibSQLVectorAdapter({
    url: LIBSQL_URL,
    authToken: LIBSQL_AUTH_TOKEN,
  }),
  enableCache: true,
  embedding: getEmbeddingModel(),
});

export async function initializeAgent() {
    const model = await getModel();

    const agent = new Agent({
        name: "Chief Medical Officer",
        model: model,
        instructions: "You are a Chief Medical Officer. Help users with their medical questions. Be concise and short.",
        memory: memory,
    });
    return agent;
}
