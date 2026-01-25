import { FastifyReply, FastifyRequest } from "fastify";
import { initializeAgent } from "../services/ai.service";
import { userService } from "../services/user.service";
import { db } from "../services/db.service";

interface AIChatRequest {
    text: string;
    userId: string;
    chatId: string;
}

export async function chat(request: FastifyRequest<{ Body: AIChatRequest }>, reply: FastifyReply) {
    const { text, userId, chatId } = request.body;

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

        const agent = await initializeAgent(user?.name || "", user?.age || 0, user?.gender || "", user?.languagePreference || "", comorbidities);
        const result = await agent.streamText(text, {
            userId: userId,
            conversationId: chatId,
        });

        let response = "";

        for await (const chunk of result.textStream) {
            response += chunk;
        }

        return reply.send({ text: response });
    } catch (error) {
        request.log.error(error);
        return reply.code(500).send({ message: "Internal Server Error" });
    }
}

export async function getConversations(request: FastifyRequest<{ Params: { userId: string } }>, reply: FastifyReply) {
    const { userId } = request.params;

    try {
        const result = await db.execute({
            sql: "SELECT * FROM voltagent_memory_conversations WHERE user_id = ? ORDER BY created_at DESC",
            args: [userId]
        });

        return reply.send(result.rows);
    } catch (error) {
        request.log.error(error);
        return reply.code(500).send({ message: "Internal Server Error" });
    }
}

export async function getMessages(request: FastifyRequest<{ Params: { chatId: string } }>, reply: FastifyReply) {
    const { chatId } = request.params;

    try {
        const result = await db.execute({
            sql: "SELECT * FROM voltagent_memory_messages WHERE conversation_id = ? ORDER BY created_at ASC",
            args: [chatId]
        });

        // Map parts to text for simple frontend consumption if needed, 
        // but Voltagent messages store content in 'parts' as JSON
        const messages = result.rows.map(row => {
            let text = "";
            try {
                const parts = JSON.parse(row.parts as string);
                if (Array.isArray(parts)) {
                    text = parts.map(p => p.text || "").join("");
                }
            } catch (e) {
                text = row.parts as string;
            }
            return {
                ...row,
                text
            };
        });

        return reply.send(messages);
    } catch (error) {
        request.log.error(error);
        return reply.code(500).send({ message: "Internal Server Error" });
    }
}
