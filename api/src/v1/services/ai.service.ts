import { Agent } from "@voltagent/core";
import { getProvider } from "./client.service";


export async function initializeAgent() {
    const provider = await getProvider();
    const model = provider("gemini-2.5-flash-lite");

    const agent = new Agent({
        name: "Chief Medical Officer",
        model: model,
        instructions: "You are a Chief Medical Officer. Help users with their medical questions.",
    });
    return agent;
}
