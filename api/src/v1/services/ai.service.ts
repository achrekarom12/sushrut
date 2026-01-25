import { Agent, createTool, Memory } from "@voltagent/core";
import { getProvider, getEmbeddingModel } from "./client.service";
import { LibSQLMemoryAdapter, LibSQLVectorAdapter } from "@voltagent/libsql";
import { LIBSQL_URL, LIBSQL_AUTH_TOKEN } from "../../env";
import { BaseRetriever } from "@voltagent/core";
import fs from "fs/promises";
import path from "path";
import { z } from "zod";

const findLabTool = createTool({
  name: "find-lab",
  description: "Finds the nearest lab for a given location.",
  parameters: z.object({
    location: z.string().describe("The city and state, e.g., San Francisco, CA"),
  }),
  execute: async ({ }) => {
    return [{
      name: "Metropolis Labs | Blood Test & Diagnostic Centre",
      address: "Platinum Building, CD Barfiwala Road, Juhu Lane, Andheri West, Mumbai, Maharashtra 400058",
    },
    {
      name: "NURA - Ai Health Screening Center Mumbai",
      address: "254D, Band Box House, Opp Sasmira Institute, Dr Annie Besant Road, Sudam Kalu Ahire Marg, Worli, Mumbai, Maharashtra 400030",
    },
    {
      name: "Clinical health care laboratory",
      address: "Shop no, 11, Road, near Dimond medical, Shastri Nagar, Irla, Vile Parle, Mumbai, Maharashtra 400056",
    },
    ]
  },
});



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
      purpose: `You are a expert and seasoned general physician. 
      Your task is to provide expert advice and information related to general health.
      General health includes normal flu, cold, cough, fever, etc.`,
      model: model,
      instructions: `Your role is to act as a generalist and provide information related to normal flu, cold, cough, fever, etc.`,
    })
  ]
}


export async function initializeAgent(userName: string, age: number, gender: string, languagePreference: string, comorbidities: string[]) {
  const model = await getModel();

  const defaultAgents = await getDefaultAgents();

  const subagents = comorbidities.map(condition => new Agent({
    name: `${condition} Specialist`,
    purpose: `You are a specialist in ${condition}. You have been asked to provide your expert optionon on ${condition} by the CMO. 
    You have access to Standard treatment guides and you have to always site your references from it. Be thorough and provide all the information related to ${condition}.`,
    model: model,
    instructions: `Your task is to assist the main agent to gather specific information related to ${condition}.`,
    retriever: new FileRetriever(`../../data/${condition}-stg.txt`),
  }));

  if (gender == 'female') {
    subagents.push(new Agent({
      name: `Gynecologist`,
      purpose: `You are a gynecologist in womens health. You have been asked to provide your expert optionon on gynecology by the CMO. 
      You have access to Standard treatment guides and you have to always site your references from it. Be thorough and provide all the information related to women health.`,
      model: model,
      instructions: `Your role is to act as a gynecologist and provide information related to gynecology.`,
      retriever: new FileRetriever(`../../data/gynac-stg.txt`),
    }));
  }

  subagents.push(...defaultAgents);

  const agent = new Agent({
    name: "Chief Medical Officer",
    model: model,
    instructions: `You are a Chief Medical Officer dedicatedly deployed to help ${userName}. The user is ${age} years old and is ${gender}. 
        Help users with all their medical questions with the help of subagents you have.
        You have access to specialists for the following conditions: ${comorbidities.join(", ")}. 
        Use the subagents you have if the user's question relates to these conditions.
        Keep your responses short, concise and personalised.
        ALWAYS respond in ${languagePreference} as the user is most familiar with it.`,
    memory: memory,
    subAgents: subagents,
    tools: [findLabTool]
  });
  return agent;
}
