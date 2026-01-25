import { FastifyInstance } from 'fastify';
import * as aiController from '../../controllers/ai.controller';
import S from 'fluent-json-schema';

export default async function (fastify: FastifyInstance) {
    fastify.post('/chat', {
        schema: {
            description: 'Chat with AI',
            tags: ['AI'],
            body: S.object()
                .prop('text', S.string().required())
                .prop('userId', S.string().required())
                .prop('chatId', S.string().required())
                .valueOf(),
        },
    }, aiController.chat);

    fastify.get('/conversations/:userId', {
        schema: {
            description: 'Get user conversations',
            tags: ['AI'],
            params: S.object().prop('userId', S.string().required()).valueOf(),
        },
    }, aiController.getConversations);

    fastify.get('/conversations/:chatId/messages', {
        schema: {
            description: 'Get conversation messages',
            tags: ['AI'],
            params: S.object().prop('chatId', S.string().required()).valueOf(),
        },
    }, aiController.getMessages);

    fastify.delete('/conversations/:chatId', {
        schema: {
            description: 'Delete conversation',
            tags: ['AI'],
            params: S.object().prop('chatId', S.string().required()).valueOf(),
        },
    }, aiController.deleteConversation);
}
