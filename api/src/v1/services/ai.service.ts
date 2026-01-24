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
  // vector: new LibSQLVectorAdapter({
  //   url: LIBSQL_URL,
  //   authToken: LIBSQL_AUTH_TOKEN,
  // }),
  enableCache: true,
  embedding: getEmbeddingModel(),
});



export async function initializeAgent(userName: string, age: number, gender: string, comorbidities: string[]) {
  const model = await getModel();

  const subagents = comorbidities.map(condition => new Agent({
    name: `${condition} Specialist`,
    purpose: `You are a specialist in ${condition}. Provide expert advice and information related to ${condition}.`,
    model: model,
    instructions: `Your task is to assist the main agent to gather specific information related to ${condition}.`
  }));

  const agent = new Agent({
    name: "Chief Medical Officer",
    model: model,
    instructions: `You are a Chief Medical Officer dedicated to helping ${userName}. The user is ${age} years old and is ${gender}. Help users with their medical questions. Be concise and short. 
        You have access to specialists for the following conditions: ${comorbidities.join(", ")}. 
        Use them if the user's question relates to these conditions.
        Keep your responses short, concise and personalised.`,
    memory: memory,
    subAgents: subagents,
  });
  return agent;
}
