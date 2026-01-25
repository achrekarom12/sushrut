'use client';

import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Loader2, Hospital } from 'lucide-react';

export default function LoginPage() {
    const [mobile, setMobile] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const { login } = useAuth();

    const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        try {
            const response = await fetch(`${API_BASE_URL}/users/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ phonenumber: mobile, password: password }),
            });

            if (response.ok) {
                const userData = await response.json();
                login(userData);
            } else {
                const errorData = await response.json();
                setError(errorData.message || 'Login failed! Please check your credentials.');
            }
        } catch (err) {
            console.error('Login error:', err);
            setError('Unable to connect to the server. Please try again later.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-transparent px-4">
            <div className="w-full max-w-[400px] space-y-8">
                <div className="text-center space-y-2">
                    <div className="mx-auto h-16 w-16 flex items-center justify-center rounded-2xl bg-indigo-600 text-white shadow-lg shadow-indigo-200">
                        <Hospital size={32} />
                    </div>
                    <h1 className="text-3xl font-bold tracking-tight text-slate-900">Sushrut</h1>
                    <p className="text-slate-500 font-medium">Your AI Chief Medical Officer</p>
                </div>

                <div className="bg-white/60 backdrop-blur-xl rounded-[2.5rem] border border-white/40 p-10 shadow-[0_20px_50px_rgba(0,0,0,0.05)]">
                    <form className="space-y-6" onSubmit={handleLogin}>
                        <div className="space-y-2">
                            <label htmlFor="mobile" className="block text-sm font-semibold text-slate-700 ml-1">
                                Mobile Number
                            </label>
                            <input
                                id="mobile"
                                type="tel"
                                required
                                value={mobile}
                                onChange={(e) => setMobile(e.target.value.replace(/[^0-9]/g, '').slice(0, 10))}
                                placeholder="Enter 10-digit number"
                                className="block w-full rounded-2xl border border-white/40 bg-white/40 px-4 py-3.5 text-slate-900 placeholder:text-slate-400 focus:border-indigo-600 focus:bg-white/60 focus:ring-4 focus:ring-indigo-50/50 transition-all outline-none"
                            />
                        </div>

                        <div className="space-y-2">
                            <label htmlFor="password" title="Password" className="block text-sm font-semibold text-slate-700 ml-1">
                                Password
                            </label>
                            <input
                                id="password"
                                type="password"
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="••••••••"
                                className="block w-full rounded-2xl border border-white/40 bg-white/40 px-4 py-3.5 text-slate-900 placeholder:text-slate-400 focus:border-indigo-600 focus:bg-white/60 focus:ring-4 focus:ring-indigo-50/50 transition-all outline-none"
                            />
                        </div>

                        {error && (
                            <div className="rounded-xl bg-red-50 p-3 text-sm text-red-600 border border-red-100 flex items-center justify-center">
                                {error}
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="flex w-full justify-center rounded-2xl bg-indigo-600 px-4 py-4 text-sm font-bold text-white hover:bg-indigo-700 focus:ring-4 focus:ring-indigo-100 transition-all shadow-lg shadow-indigo-200 disabled:opacity-70"
                        >
                            {isLoading ? (
                                <Loader2 className="h-5 w-5 animate-spin" />
                            ) : (
                                'Sign in'
                            )}
                        </button>
                    </form>

                    <div className="mt-8 text-center">
                        <p className="text-xs text-slate-400 font-medium italic">
                            Personalized Health Assistant for everyone...
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
