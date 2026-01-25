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

        reply.raw.writeHead(200, {
            "Content-Type": "text/plain; charset=utf-8",
            "Transfer-Encoding": "chunked",
            "Cache-Control": "no-cache",
            "Connection": "keep-alive",
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, PATCH, OPTIONS",
            "Access-Control-Allow-Headers": "Content-Type, Authorization",
        });

        try {
            for await (const chunk of result.textStream) {
                if (reply.raw.destroyed) break;
                console.log(chunk);
                reply.raw.write(chunk);
            }
        } catch (streamError: any) {
            // Ignore closed stream errors if we've already started sending data
            if (!streamError.message?.includes("closed") && !streamError.message?.includes("WritableStream")) {
                throw streamError;
            }
            request.log.warn({ err: streamError }, "Stream error ignored");
        }

        if (!reply.raw.writableEnded) {
            reply.raw.end();
        }
        return reply;
    } catch (error) {
        request.log.error(error);
        if (!reply.raw.headersSent) {
            return reply.code(500).send({ message: "Internal Server Error" });
        }
        if (!reply.raw.writableEnded) {
            reply.raw.end();
        }
        return reply;
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
