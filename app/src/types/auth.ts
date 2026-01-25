export interface User {
    id: string | number;
    user_id?: string | number;
    name?: string;
    age?: number;
    gender?: string;
    phonenumber: string;
    healthMetadata?: string; // JSON string
    languagePreference?: string;
}

export interface AuthState {
    user: User | null;
    isLoggedIn: boolean;
    isLoading: boolean;
}
