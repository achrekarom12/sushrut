export interface User {
  id: string;
  name: string;
  age: number;
  phonenumber: string;
  gender: string;
  password?: string;
  healthMetadata?: string;
  languagePreference?: string;
  locationConsent?: boolean;
  latitude?: number;
  longitude?: number;
  createdAt: string;
}

export interface CreateUserDTO {
  name: string;
  age: number;
  phonenumber: string;
  gender: string;
  password?: string;
  healthMetadata?: string;
  languagePreference?: string;
  locationConsent?: boolean;
  latitude?: number;
  longitude?: number;
}

export interface UpdateUserDTO {
  name?: string;
  age?: number;
  phonenumber?: string;
  gender?: string;
  password?: string;
  healthMetadata?: string;
  languagePreference?: string;
  locationConsent?: boolean;
  latitude?: number;
  longitude?: number;
}

export interface LoginDTO {
  phonenumber: string;
  password?: string;
}
