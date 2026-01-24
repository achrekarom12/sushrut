import fp from 'fastify-plugin';
import swagger from '@fastify/swagger';
import apiReference from '@scalar/fastify-api-reference';

export default fp(async (fastify) => {
    await fastify.register(swagger, {
        openapi: {
            info: {
                title: 'User Management API',
                description: 'A production grade Fastify API for user management',
                version: '1.0.0',
            },
            servers: [
                {
                    url: 'http://localhost:3000',
                },
            ],
        },
    });

    await fastify.register(apiReference, {
        routePrefix: '/docs',
    });
});
