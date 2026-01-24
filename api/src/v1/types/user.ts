export interface User {
  id: string;
  name: string;
  age: number;
  phonenumber: string;
  gender: string;
  password?: string;
  createdAt: string;
}

export interface CreateUserDTO {
  name: string;
  age: number;
  phonenumber: string;
  gender: string;
  password?: string;
}

export interface UpdateUserDTO {
  name?: string;
  age?: number;
  phonenumber?: string;
  gender?: string;
  password?: string;
}
