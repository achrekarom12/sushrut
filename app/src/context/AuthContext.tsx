'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, AuthState } from '@/types/auth';
import { useRouter } from 'next/navigation';

interface AuthContextType extends AuthState {
    login: (userData: User) => void;
    logout: () => void;
    updateUser: (userData: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const STORAGE_KEYS = {
    USER_DATA: 'sushrut_user_data',
    IS_LOGGED_IN: 'sushrut_logged_in'
};

export function AuthProvider({ children }: { children: ReactNode }) {
    const [state, setState] = useState<AuthState>({
        user: null,
        isLoggedIn: false,
        isLoading: true,
    });
    const router = useRouter();

    useEffect(() => {
        const storedUser = localStorage.getItem(STORAGE_KEYS.USER_DATA);
        const isLoggedIn = localStorage.getItem(STORAGE_KEYS.IS_LOGGED_IN) === 'true';

        if (storedUser && isLoggedIn) {
            try {
                setState({
                    user: JSON.parse(storedUser),
                    isLoggedIn: true,
                    isLoading: false,
                });
            } catch (e) {
                console.error('Failed to parse stored user:', e);
                setState(prev => ({ ...prev, isLoading: false }));
            }
        } else {
            setState(prev => ({ ...prev, isLoading: false }));
        }
    }, []);

    const login = (userData: User) => {
        localStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(userData));
        localStorage.setItem(STORAGE_KEYS.IS_LOGGED_IN, 'true');
        setState({
            user: userData,
            isLoggedIn: true,
            isLoading: false,
        });
        router.push('/');
    };

    const logout = () => {
        localStorage.removeItem(STORAGE_KEYS.USER_DATA);
        localStorage.removeItem(STORAGE_KEYS.IS_LOGGED_IN);
        setState({
            user: null,
            isLoggedIn: false,
            isLoading: false,
        });
        router.push('/login');
    };

    const updateUser = (userData: Partial<User>) => {
        if (!state.user) return;
        const newUser = { ...state.user, ...userData };
        localStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(newUser));
        setState(prev => ({ ...prev, user: newUser }));
    };

    return (
        <AuthContext.Provider value={{ ...state, login, logout, updateUser }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}
