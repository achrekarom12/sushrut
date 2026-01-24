import { FastifyRequest, FastifyReply } from 'fastify';
import { userService } from '../services/user.service';
import { gcsService } from '../services/gcs.service';
import { CreateUserDTO, UpdateUserDTO, LoginDTO } from '../types/user';

export const getUsers = async (request: FastifyRequest, reply: FastifyReply) => {
    const users = await userService.getAll();
    return users;
};

export const login = async (request: FastifyRequest<{ Body: LoginDTO }>, reply: FastifyReply) => {
    const { phonenumber, password } = request.body;
    const user = await userService.getByPhonenumber(phonenumber);

    if (!user || user.password !== password) {
        return reply.status(401).send({ message: 'Invalid credentials' });
    }

    return user;
};

export const getUserById = async (request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) => {
    const { id } = request.params;
    const user = await userService.getById(id);
    if (!user) {
        return reply.status(404).send({ message: 'User not found' });
    }
    return user;
};

export const createUser = async (request: FastifyRequest<{ Body: CreateUserDTO }>, reply: FastifyReply) => {
    const user = await userService.create(request.body);
    return reply.status(201).send(user);
};

export const updateUser = async (request: FastifyRequest<{ Params: { id: string }; Body: UpdateUserDTO }>, reply: FastifyReply) => {
    const { id } = request.params;
    const user = await userService.update(id, request.body);
    if (!user) {
        return reply.status(404).send({ message: 'User not found' });
    }
    return user;
};

export const deleteUser = async (request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) => {
    const { id } = request.params;
    const deleted = await userService.delete(id);
    if (!deleted) {
        return reply.status(404).send({ message: 'User not found' });
    }
    return reply.status(204).send();
};

export const uploadReport = async (request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) => {
    const { id } = request.params;
    const user = await userService.getById(id);
    if (!user) {
        return reply.status(404).send({ message: 'User not found' });
    }

    const data = await request.file();
    if (!data) {
        return reply.status(400).send({ message: 'No file uploaded' });
    }

    try {
        const buffer = await data.toBuffer();
        const fileName = `${id}/${Date.now()}-${data.filename}`;
        const url = await gcsService.uploadFile(buffer, fileName, data.mimetype);

        const updatedUser = await userService.addReport(id, {
            name: data.filename,
            url: url
        });

        return updatedUser;
    } catch (error) {
        console.error('Upload error:', error);
        return reply.status(500).send({ message: 'Error uploading file' });
    }
};
