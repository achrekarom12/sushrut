import { join } from 'path';
import Fastify, { FastifyInstance } from 'fastify';
import autoload from '@fastify/autoload';
import cors from '@fastify/cors';
import helmet from '@fastify/helmet';
import multipart from '@fastify/multipart';

export const buildApp = async (): Promise<FastifyInstance> => {
    const fastify = Fastify({
        logger: true,
    });

    // Register core security plugins
    await fastify.register(helmet, {
        contentSecurityPolicy: false,
    });
    await fastify.register(cors, {
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    });

    await fastify.register(multipart);

    // Register internal plugins
    await fastify.register(autoload, {
        dir: join(__dirname, 'v1', 'plugins'),
    });

    // Register routes
    await fastify.register(autoload, {
        dir: join(__dirname, 'v1', 'routes'),
        options: { prefix: '/v1' },
    });

    return fastify;
};
