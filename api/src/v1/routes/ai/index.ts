import { FastifyInstance } from 'fastify';
import * as aiController from '../../controllers/ai.controller';
import S from 'fluent-json-schema';

export default async function (fastify: FastifyInstance) {
    fastify.post('/', {
        schema: {
            description: 'Chat with AI',
            tags: ['AI'],
            body: S.object().prop('text', S.string().required()).valueOf(),
            response: {
                200: S.object().prop('text', S.string()).valueOf(),
            },
        },
    }, aiController.chat);
}
