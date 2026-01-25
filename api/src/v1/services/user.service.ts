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

    async getByPhonenumber(phonenumber: string): Promise<User | undefined> {
        const result = await db.execute({
            sql: 'SELECT * FROM users WHERE phonenumber = ?',
            args: [phonenumber]
        });
        return result.rows[0] as unknown as User | undefined;
    }

    async create(userData: CreateUserDTO): Promise<User> {
        const id = uuidv4();
        const createdAt = new Date().toISOString();
        const languagePreference = userData.languagePreference || 'english';

        await db.execute({
            sql: 'INSERT INTO users (id, name, age, phonenumber, gender, password, healthMetadata, languagePreference, createdAt) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
            args: [
                id,
                userData.name,
                userData.age,
                userData.phonenumber,
                userData.gender,
                userData.password || null,
                userData.healthMetadata || null,
                languagePreference,
                createdAt
            ]
        });

        return {
            id,
            ...userData,
            languagePreference,
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
            healthMetadata: userData.healthMetadata ?? currentUser.healthMetadata,
            languagePreference: userData.languagePreference ?? currentUser.languagePreference,
        };

        await db.execute({
            sql: 'UPDATE users SET name = ?, age = ?, phonenumber = ?, gender = ?, password = ?, healthMetadata = ?, languagePreference = ? WHERE id = ?',
            args: [
                updatedUser.name,
                updatedUser.age,
                updatedUser.phonenumber,
                updatedUser.gender,
                updatedUser.password || null,
                updatedUser.healthMetadata || null,
                updatedUser.languagePreference || 'english',
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

    async addReport(id: string, report: { name: string; url: string }): Promise<User | undefined> {
        const currentUser = await this.getById(id);
        if (!currentUser) return undefined;

        let metadata: any = {};
        if (currentUser.healthMetadata) {
            try {
                metadata = JSON.parse(currentUser.healthMetadata);
            } catch (e) {
                console.error('Error parsing healthMetadata:', e);
            }
        }

        if (!metadata.files) {
            metadata.files = [];
        }

        metadata.files.push({
            ...report,
            uploadedAt: new Date().toISOString()
        });

        return this.update(id, {
            healthMetadata: JSON.stringify(metadata)
        });
    }
}

export const userService = new UserService();
