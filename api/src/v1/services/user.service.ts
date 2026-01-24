import { v4 as uuidv4 } from 'uuid';
import { User, CreateUserDTO, UpdateUserDTO } from '../types/user';

class UserService {
    private users: User[] = [];

    async getAll(): Promise<User[]> {
        return this.users;
    }

    async getById(id: string): Promise<User | undefined> {
        return this.users.find(u => u.id === id);
    }

    async create(userData: CreateUserDTO): Promise<User> {
        const newUser: User = {
            id: uuidv4(),
            ...userData,
        };
        this.users.push(newUser);
        return newUser;
    }

    async update(id: string, userData: UpdateUserDTO): Promise<User | undefined> {
        const index = this.users.findIndex(u => u.id === id);
        if (index === -1) return undefined;

        const currentUser = this.users[index];
        if (!currentUser) return undefined;

        const updatedUser: User = {
            id: currentUser.id,
            firstname: userData.firstname ?? currentUser.firstname,
            lastname: userData.lastname ?? currentUser.lastname,
            mobileNumber: userData.mobileNumber ?? currentUser.mobileNumber,
            email: userData.email ?? currentUser.email,
        };
        this.users[index] = updatedUser;
        return updatedUser;
    }

    async delete(id: string): Promise<boolean> {
        const index = this.users.findIndex(u => u.id === id);
        if (index === -1) return false;

        this.users.splice(index, 1);
        return true;
    }
}

export const userService = new UserService();
