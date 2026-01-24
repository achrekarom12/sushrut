import { v4 as uuidv4 } from 'uuid';
import { User, CreateUserDTO, UpdateUserDTO } from '../types/user';
import { db } from './db.service';

class UserService {
    async getAll(): Promise<User[]> {
        const result = await db.execute('SELECT * FROM users');
        return result.rows as unknown as User[];
    }

    async getById(id: string): Promise<User | undefined> {
        const result = await db.execute({
            sql: 'SELECT * FROM users WHERE id = ?',
            args: [id]
        });
        return result.rows[0] as unknown as User | undefined;
    }

    async create(userData: CreateUserDTO): Promise<User> {
        const id = uuidv4();
        const createdAt = new Date().toISOString();

        await db.execute({
            sql: 'INSERT INTO users (id, name, age, phonenumber, gender, password, createdAt) VALUES (?, ?, ?, ?, ?, ?, ?)',
            args: [
                id,
                userData.name,
                userData.age,
                userData.phonenumber,
                userData.gender,
                userData.password || null,
                createdAt
            ]
        });

        return {
            id,
            ...userData,
            createdAt
        };
    }

    async update(id: string, userData: UpdateUserDTO): Promise<User | undefined> {
        const currentUser = await this.getById(id);
        if (!currentUser) return undefined;

        const updatedUser = {
            name: userData.name ?? currentUser.name,
            age: userData.age ?? currentUser.age,
            phonenumber: userData.phonenumber ?? currentUser.phonenumber,
            gender: userData.gender ?? currentUser.gender,
            password: userData.password ?? currentUser.password,
        };

        await db.execute({
            sql: 'UPDATE users SET name = ?, age = ?, phonenumber = ?, gender = ?, password = ? WHERE id = ?',
            args: [
                updatedUser.name,
                updatedUser.age,
                updatedUser.phonenumber,
                updatedUser.gender,
                updatedUser.password || null,
                id
            ]
        });

        return {
            id,
            ...updatedUser,
            createdAt: currentUser.createdAt
        };
    }

    async delete(id: string): Promise<boolean> {
        const result = await db.execute({
            sql: 'DELETE FROM users WHERE id = ?',
            args: [id]
        });
        return result.rowsAffected > 0;
    }
}

export const userService = new UserService();
