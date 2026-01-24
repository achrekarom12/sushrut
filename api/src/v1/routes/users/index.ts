import { FastifyInstance } from 'fastify';
import * as userController from '../../controllers/user.controller';
import { CreateUserSchema, UpdateUserSchema, UserIdParamSchema, UserSchema, LoginSchema } from '../../schemas/user.schema';

export default async function (fastify: FastifyInstance) {
    fastify.post('/login', {
        schema: {
            description: 'Login user',
            tags: ['Users'],
            body: LoginSchema.valueOf(),
            response: {
                200: UserSchema.valueOf(),
                401: {
                    type: 'object',
                    properties: {
                        message: { type: 'string' },
                    },
                },
            },
        },
    }, userController.login);

    fastify.get('/', {
        schema: {
            description: 'Get all users',
            tags: ['Users'],
            response: {
                200: {
                    type: 'array',
                    items: UserSchema.valueOf(),
                },
            },
        },
    }, userController.getUsers);

    fastify.get('/:id', {
        schema: {
            description: 'Get user by id',
            tags: ['Users'],
            params: UserIdParamSchema.valueOf(),
            response: {
                200: UserSchema.valueOf(),
                404: {
                    type: 'object',
                    properties: {
                        message: { type: 'string' },
                    },
                },
            },
        },
    }, userController.getUserById);

    fastify.post('/', {
        schema: {
            description: 'Create a new user',
            tags: ['Users'],
            body: CreateUserSchema.valueOf(),
            response: {
                201: UserSchema.valueOf(),
            },
        },
    }, userController.createUser);

    fastify.patch('/:id', {
        schema: {
            description: 'Update user details',
            tags: ['Users'],
            params: UserIdParamSchema.valueOf(),
            body: UpdateUserSchema.valueOf(),
            response: {
                200: UserSchema.valueOf(),
                404: {
                    type: 'object',
                    properties: {
                        message: { type: 'string' },
                    },
                },
            },
        },
    }, userController.updateUser);

    fastify.delete('/:id', {
        schema: {
            description: 'Delete user',
            tags: ['Users'],
            params: UserIdParamSchema.valueOf(),
            response: {
                204: { type: 'null' },
                404: {
                    type: 'object',
                    properties: {
                        message: { type: 'string' },
                    },
                },
            },
        },
    }, userController.deleteUser);
}
