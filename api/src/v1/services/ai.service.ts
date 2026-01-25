import { Agent, Memory } from "@voltagent/core";
import { getProvider, getEmbeddingModel } from "./client.service";
import { LibSQLMemoryAdapter, LibSQLVectorAdapter } from "@voltagent/libsql";
import { LIBSQL_URL, LIBSQL_AUTH_TOKEN } from "../../env";
import { BaseRetriever } from "@voltagent/core";
import fs from "fs/promises";
import path from "path";

class FileRetriever extends BaseRetriever {
  constructor(private directoryPath: string) {
    super();
  }

  async retrieve(input: any, options: any) {
    const query = typeof input === "string" ? input : input[input.length - 1].content;
    
    const results = await this.searchFiles(query);
    
    return results.length > 0 
      ? results.join("\n\n---\n\n") 
      : "No relevant documents found.";
  }

  async searchFiles(query: string) {
    const files = await fs.readdir(this.directoryPath);
    const keywords = query.toLowerCase().split(/\s+/);
    let matches = [];

    for (const file of files) {
      if (file.endsWith(".txt") || file.endsWith(".md")) {
        const filePath = path.join(this.directoryPath, file);
        const content = await fs.readFile(filePath, "utf-8");
        console.log(content);
        const lowerContent = content.toLowerCase();

        let score = 0;
        keywords.forEach(word => {
          if (lowerContent.includes(word)) {
            const count = lowerContent.split(word).length - 1;
            score += count;
          }
        });

        if (score > 0) {
          matches.push({
            content: `${content}`,
            score
          });
        }
      }
    }

    return matches
      .sort((a, b) => b.score - a.score)
      .map(m => m.content);
  }
}

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
  // enableCache: true,
  // embedding: getEmbeddingModel(),
});

async function getDefaultAgents() {
  const model = await getModel();
  return [
    new Agent({
      name: `General Physician`,
      purpose: `You are a generalist in general health. Provide expert advice and information related to general health.`,
      model: model,
      instructions: `Your role is to act as a generalist and provide information related to normal flu, cold, cough, fever, etc.`,
    }),
    new Agent({
      name: `Lab Finder`,
      purpose: `You are a lab finder in general health. Provide expert advice and information related to labs in the area.`,
      model: model,
      instructions: `Your role is to act as a lab finder and provide information related to labs in the area.`,
      tools: []
    })
  ]
}


export async function initializeAgent(userName: string, age: number, gender: string, languagePreference: string, comorbidities: string[]) {
  const model = await getModel();

  const defaultAgents = await getDefaultAgents();

  const subagents = comorbidities.map(condition => new Agent({
    name: `${condition} Specialist`,
    purpose: `You are a specialist in ${condition}. Provide expert advice and information related to ${condition}.`,
    model: model,
    instructions: `Your task is to assist the main agent to gather specific information related to ${condition}.`,
    retriever: new FileRetriever(`../../data/${condition}-stg.txt`),
  }));

  if (gender == 'female') {
    subagents.push(new Agent({
      name: `Gynecologist`,
      purpose: `You are a gynecologist in general health. Provide expert advice and information related to gynecology.`,
      model: model,
      instructions: `Your role is to act as a gynecologist and provide information related to gynecology.`,
      retriever: new FileRetriever(`../../data/gynac-stg.txt`),
    }));
  }

  subagents.push(...defaultAgents);

  const agent = new Agent({
    name: "Chief Medical Officer",
    model: model,
    instructions: `You are a Chief Medical Officer dedicated to helping ${userName}. The user is ${age} years old and is ${gender}. 
        Help users with their medical questions. Be concise and short. 
        You have access to specialists for the following conditions: ${comorbidities.join(", ")}. 
        Use them if the user's question relates to these conditions.
        Keep your responses short, concise and personalised.
        ALWAYS respond in transliterated ${languagePreference} as user is most familiar with it.`,
    memory: memory,
    subAgents: subagents
  });
  console.dir(agent, { depth: 2 });
  return agent;
}
