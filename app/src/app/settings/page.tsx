'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Sidebar } from '@/components/Sidebar';
import { Menu, ArrowLeft, Languages, Check, Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { cn } from '@/lib/utils';

const LANGUAGES = [
    { id: 'english', label: 'English' },
    { id: 'hindi', label: 'हिन्दी (Hindi)' },
    { id: 'marathi', label: 'मराठी (Marathi)' },
];

export default function SettingsPage() {
    const { user, isLoggedIn, isLoading: authLoading, updateUser } = useAuth();
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [isUpdating, setIsUpdating] = useState(false);
    const router = useRouter();

    useEffect(() => {
        if (!authLoading && !isLoggedIn) {
            router.push('/login');
        }
    }, [isLoggedIn, authLoading, router]);

    const handleLanguageChange = async (lang: string) => {
        if (lang === user?.languagePreference) return;

        setIsUpdating(true);
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/users/${user?.id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ languagePreference: lang }),
            });
            if (response.ok) {
                updateUser({ languagePreference: lang });
            }
        } catch (err) {
            console.error('Language update error:', err);
        } finally {
            setIsUpdating(false);
        }
    };

    if (authLoading || !isLoggedIn) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-white">
                <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
            </div>
        );
    }

    return (
        <div className="flex h-screen bg-[#fcfcfc] overflow-hidden text-slate-900">
            <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

            <main className="flex-1 flex flex-col min-w-0 bg-white overflow-y-auto">
                <header className="flex items-center justify-between px-6 py-4 bg-white/80 backdrop-blur-xl border-b border-slate-100 sticky top-0 z-10">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => setSidebarOpen(true)}
                            className="lg:hidden p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-600 hover:bg-slate-100 transition-colors"
                        >
                            <Menu size={20} />
                        </button>
                        <Link href="/" className="p-2 rounded-xl hover:bg-slate-50 transition-colors text-slate-400 hover:text-indigo-600">
                            <ArrowLeft size={20} />
                        </Link>
                        <h2 className="text-lg font-bold">Settings</h2>
                    </div>
                </header>

                <div className="flex-1 max-w-2xl w-full mx-auto p-6 md:p-12 space-y-10">
                    <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-700">
                        <div className="px-2">
                            <div className="flex items-center gap-3 mb-1">
                                <div className="p-2 rounded-lg bg-indigo-50 text-indigo-600">
                                    <Languages size={20} />
                                </div>
                                <h4 className="text-sm font-bold text-slate-900 uppercase tracking-widest">Language Preference</h4>
                            </div>
                            <p className="text-sm text-slate-400 font-medium ml-12">Choose your preferred language for the application</p>
                        </div>

                        <div className="grid grid-cols-1 gap-3">
                            {LANGUAGES.map((lang) => {
                                const isSelected = user?.languagePreference === lang.id;
                                return (
                                    <button
                                        key={lang.id}
                                        onClick={() => handleLanguageChange(lang.id)}
                                        disabled={isUpdating}
                                        className={cn(
                                            "flex items-center justify-between p-5 rounded-2xl border transition-all duration-300 group",
                                            isSelected
                                                ? "bg-indigo-50 border-indigo-200 text-indigo-600 shadow-sm"
                                                : "bg-white border-slate-100 text-slate-500 hover:border-slate-300 hover:bg-slate-50"
                                        )}
                                    >
                                        <div className="flex items-center gap-4">
                                            <span className="font-bold text-base tracking-tight">{lang.label}</span>
                                        </div>
                                        <div className={cn(
                                            "w-6 h-6 rounded-full flex items-center justify-center transition-all",
                                            isSelected ? "bg-indigo-600 text-white scale-110" : "bg-slate-50 text-transparent border border-slate-100 opacity-0 group-hover:opacity-100"
                                        )}>
                                            {isUpdating && isSelected ? <Loader2 size={14} className="animate-spin" /> : <Check size={14} />}
                                        </div>
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    <div className="px-6 py-8 rounded-3xl bg-slate-50 border border-slate-100">
                        <h5 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">App Information</h5>
                        <div className="space-y-4">
                            <div className="flex justify-between items-center text-sm font-medium">
                                <span className="text-slate-500">Version</span>
                                <span className="text-slate-900">1.0.0</span>
                            </div>
                            <div className="flex justify-between items-center text-sm font-medium pt-4 border-t border-slate-200">
                                <span className="text-slate-500">Last Synced</span>
                                <span className="text-slate-900">{new Date().toLocaleDateString()}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
