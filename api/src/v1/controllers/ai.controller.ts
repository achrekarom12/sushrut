import { FastifyReply, FastifyRequest } from "fastify";
import { initializeAgent } from "../services/ai.service";

interface AIChatRequest {
    text: string;
}

export async function chat(request: FastifyRequest<{ Body: AIChatRequest }>, reply: FastifyReply) {
    const { text } = request.body;

    if (!text) {
        return reply.code(400).send({ message: "Text is required" });
    }

    try {
        const agent = await initializeAgent();
        const result = await agent.generateText(text);

        return reply.send({ text: result.text });
    } catch (error) {
        request.log.error(error);
        return reply.code(500).send({ message: "Internal Server Error" });
    }
}
