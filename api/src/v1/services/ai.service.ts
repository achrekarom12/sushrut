import { Agent, Memory } from "@voltagent/core";
import { getProvider } from "./client.service";
import { LibSQLMemoryAdapter } from "@voltagent/libsql";
import { LIBSQL_URL, LIBSQL_AUTH_TOKEN } from "../../env";

// const memory = new Memory({
//   storage: new LibSQLMemoryAdapter({
//     url: LIBSQL_URL,
//     authToken: LIBSQL_AUTH_TOKEN,
//   }),
// });

export async function initializeAgent() {
    const provider = await getProvider();
    const model = provider("gemini-2.5-flash-lite");

    const agent = new Agent({
        name: "Chief Medical Officer",
        model: model,
        instructions: "You are a Chief Medical Officer. Help users with their medical questions.",
        // memory: memory,
    });
    return agent;
}
