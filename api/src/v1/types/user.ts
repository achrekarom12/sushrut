export interface User {
  id: string;
  firstname: string;
  lastname: string;
  mobileNumber: string;
  email: string;
}

export interface CreateUserDTO {
  firstname: string;
  lastname: string;
  mobileNumber: string;
  email: string;
}

export interface UpdateUserDTO {
  firstname?: string;
  lastname?: string;
  mobileNumber?: string;
  email?: string;
}
