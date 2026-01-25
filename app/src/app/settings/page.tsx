'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Sidebar } from '@/components/Sidebar';
import { Menu, ArrowLeft, Languages, Check, Loader2, Trash2, AlertCircle } from 'lucide-react';
import { Modal } from '@/components/Modal';
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
    const [isDeletingVault, setIsDeletingVault] = useState(false);
    const [modal, setModal] = useState<{
        isOpen: boolean;
        title: string;
        description: string;
        type: 'info' | 'success' | 'warning' | 'error';
        onConfirm?: () => void;
        confirmLabel?: string;
    }>({
        isOpen: false,
        title: '',
        description: '',
        type: 'info'
    });
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

    const handleDeleteVault = async () => {
        setIsDeletingVault(true);
        try {
            const metadata = user?.healthMetadata ? JSON.parse(user.healthMetadata) : {};
            const updatedMetadata = { ...metadata, files: [] };

            const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/users/${user?.id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ healthMetadata: JSON.stringify(updatedMetadata) }),
            });

            if (response.ok) {
                updateUser({ healthMetadata: JSON.stringify(updatedMetadata) });
                setModal({
                    isOpen: true,
                    title: 'Vault Cleared',
                    description: 'All documents and images have been successfully removed from your health vault.',
                    type: 'success'
                });
            } else {
                setModal({
                    isOpen: true,
                    title: 'Action Failed',
                    description: 'We encountered an error while trying to clear your vault. Please try again later.',
                    type: 'error'
                });
            }
        } catch (err) {
            console.error('Delete vault error:', err);
            setModal({
                isOpen: true,
                title: 'Connection Error',
                description: 'Could not connect to the server. Please check your internet connection.',
                type: 'error'
            });
        } finally {
            setIsDeletingVault(false);
        }
    };

    const confirmDeleteVault = () => {
        setModal({
            isOpen: true,
            title: 'Delete All Documents?',
            description: 'This action will permanently remove every file, report, and scan from your health vault. This cannot be undone.',
            type: 'warning',
            confirmLabel: 'Delete Everything',
            onConfirm: () => {
                setModal(prev => ({ ...prev, isOpen: false }));
                handleDeleteVault();
            }
        });
    };

    if (authLoading || !isLoggedIn) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-white">
                <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
            </div>
        );
    }

    return (
        <div className="flex h-screen bg-transparent overflow-hidden text-slate-900">
            <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

            <main className="flex-1 flex flex-col min-w-0 bg-transparent overflow-y-auto">
                <header className="flex items-center justify-between px-6 py-4 bg-white/60 backdrop-blur-xl border-b border-white/20 sticky top-0 z-10">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => setSidebarOpen(true)}
                            className="lg:hidden p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-600 hover:bg-slate-100 transition-colors"
                        >
                            <Menu size={20} />
                        </button>
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
                                                ? "bg-indigo-50/50 backdrop-blur-md border-indigo-200 text-indigo-600 shadow-sm"
                                                : "bg-white/40 backdrop-blur-sm border-white/40 text-slate-500 hover:border-indigo-200 hover:bg-white/60"
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

                    <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-700 delay-200">
                        <div className="px-2">
                            <div className="flex items-center gap-3 mb-1">
                                <div className="p-2 rounded-lg bg-red-50 text-red-600">
                                    <Trash2 size={20} />
                                </div>
                                <h4 className="text-sm font-bold text-slate-900 uppercase tracking-widest">Data Management</h4>
                            </div>
                            <p className="text-sm text-slate-400 font-medium ml-12">Manage your stored images and documents</p>
                        </div>

                        <div className="bg-white/40 backdrop-blur-md border border-red-200/50 rounded-2xl overflow-hidden shadow-sm shadow-red-50/50">
                            <div className="p-6">
                                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                                    <div className="space-y-1">
                                        <h5 className="font-bold text-slate-900">Clear Health Vault</h5>
                                        <p className="text-sm text-slate-500 max-w-md">
                                            This will permanently delete all your uploaded medical reports, prescriptions and scans.
                                            {user?.healthMetadata && JSON.parse(user.healthMetadata).files?.length > 0 && (
                                                <span className="block mt-1 font-bold text-red-500">
                                                    Currently: {JSON.parse(user.healthMetadata).files.length} documents
                                                </span>
                                            )}
                                        </p>
                                    </div>
                                    <button
                                        onClick={confirmDeleteVault}
                                        disabled={isDeletingVault}
                                        className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-red-50 text-red-600 hover:bg-red-600 hover:text-white transition-all duration-300 font-bold text-sm border border-red-100"
                                    >
                                        {isDeletingVault ? (
                                            <>
                                                <Loader2 size={16} className="animate-spin" />
                                                <span>Deleting...</span>
                                            </>
                                        ) : (
                                            <>
                                                <Trash2 size={16} />
                                                <span>Delete Vault</span>
                                            </>
                                        )}
                                    </button>
                                </div>
                            </div>
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

            <Modal
                isOpen={modal.isOpen}
                onClose={() => setModal(prev => ({ ...prev, isOpen: false }))}
                title={modal.title}
                description={modal.description}
                type={modal.type}
                confirmLabel={modal.confirmLabel}
                onConfirm={modal.onConfirm}
                isLoading={isDeletingVault}
            />
        </div>
    );
}
