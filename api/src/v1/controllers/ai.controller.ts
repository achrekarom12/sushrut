import { FastifyReply, FastifyRequest } from "fastify";
import { initializeAgent } from "../services/ai.service";
import { userService } from "../services/user.service";

interface AIChatRequest {
    text: string;
    userId: string;
}

export async function chat(request: FastifyRequest<{ Body: AIChatRequest }>, reply: FastifyReply) {
    const { text, userId } = request.body;
    const threadId = 'chat_' + userId;

    if (!text) {
        return reply.code(400).send({ message: "Text is required" });
    }

    if (!userId) {
        return reply.code(400).send({ message: "UserId is required" });
    }

    try {
        const user = await userService.getById(userId);

        let comorbidities: string[] = [];

        if (user?.healthMetadata) {
            try {
                const metadata = JSON.parse(user.healthMetadata);
                comorbidities = metadata.comorbidities || [];
            } catch (error: any) {
                request.log.error(error, "Error parsing healthMetadata for user " + userId);
            }
        }

        const agent = await initializeAgent(user?.name || "", user?.age || 0, user?.gender || "", comorbidities);
        const result = await agent.generateText(text, {
            userId: userId,
            conversationId: threadId,
        });

        return reply.send({ text: result.text });
    } catch (error) {
        request.log.error(error);
        return reply.code(500).send({ message: "Internal Server Error" });
    }
}
