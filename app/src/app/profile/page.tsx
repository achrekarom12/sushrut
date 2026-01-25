'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Sidebar } from '@/components/Sidebar';
import { Menu, Save, Loader2, ArrowLeft, CheckCircle2, AlertCircle } from 'lucide-react';
import { Modal } from '@/components/Modal';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { cn } from '@/lib/utils';

const COMORBIDITIES = [
    { id: 'diabetes', label: 'Diabetes' },
    { id: 'hypertension', label: 'Hypertension' },
    { id: 'heart_disease', label: 'Heart Disease' },
    { id: 'asthma', label: 'Asthma' },
    { id: 'thyroid', label: 'Thyroid' },
    { id: 'kidney_disease', label: 'Kidney Disease' },
];

export default function ProfilePage() {
    const { user, isLoggedIn, isLoading: authLoading, updateUser } = useAuth();
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [selectedComorbidities, setSelectedComorbidities] = useState<string[]>([]);
    const [modal, setModal] = useState<{
        isOpen: boolean;
        title: string;
        description: string;
        type: 'info' | 'success' | 'warning' | 'error';
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

    useEffect(() => {
        if (user?.healthMetadata) {
            try {
                const metadata = JSON.parse(user.healthMetadata);
                setSelectedComorbidities(metadata.comorbidities || []);
            } catch (e) {
                console.error('Error parsing healthMetadata:', e);
            }
        }
    }, [user]);

    const toggleComorbidity = (id: string) => {
        setSelectedComorbidities(prev =>
            prev.includes(id) ? prev.filter(c => c !== id) : [...prev, id]
        );
    };

    const handleUpdate = async () => {
        setIsSaving(true);
        try {
            const existingMetadata = user?.healthMetadata ? JSON.parse(user.healthMetadata) : {};
            const updatedMetadata = JSON.stringify({
                ...existingMetadata,
                comorbidities: selectedComorbidities
            });

            const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/users/${user?.id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ healthMetadata: updatedMetadata })
            });

            if (response.ok) {
                const updatedUser = await response.json();
                updateUser(updatedUser);
                setModal({
                    isOpen: true,
                    title: 'Profile Updated',
                    description: 'Your medical comorbidities and health details have been saved successfully.',
                    type: 'success'
                });
            } else {
                setModal({
                    isOpen: true,
                    title: 'Update Failed',
                    description: 'We could not save your profile changes. Please try again.',
                    type: 'error'
                });
            }
        } catch (err) {
            console.error('Update error:', err);
            setModal({
                isOpen: true,
                title: 'Connection Error',
                description: 'Unable to connect to the server. Please check your network.',
                type: 'error'
            });
        } finally {
            setIsSaving(false);
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
                        <h2 className="text-lg font-bold">Health Profile</h2>
                    </div>
                </header>

                <div className="flex-1 max-w-2xl w-full mx-auto p-6 md:p-12 space-y-10">
                    <div className="relative overflow-hidden p-8 rounded-[2.5rem] bg-indigo-600 text-white shadow-2xl shadow-indigo-200 animate-in zoom-in duration-500">
                        <div className="relative z-10">
                            <div className="flex items-center gap-4 mb-6">
                                <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-white text-2xl font-semibold border border-white/20">
                                    {user?.name?.charAt(0)}
                                </div>
                                <div>
                                    <h3 className="text-2xl font-bold">{user?.name || 'User'}</h3>
                                    <p className="text-indigo-100 font-medium">
                                        {user?.age || '--'} Years • {
                                            user?.gender?.toLowerCase() === 'male' ? 'M' :
                                                user?.gender?.toLowerCase() === 'female' ? 'F' :
                                                    'Not Specified'
                                        }
                                    </p>
                                </div>
                            </div>
                            <div className="text-[11px] font-bold bg-white/10 px-4 py-2 rounded-full border border-white/10 inline-block tracking-widest uppercase">
                                Member ID: {user?.phonenumber}
                            </div>
                        </div>
                        {/* Decorative circles */}
                        <div className="absolute -right-10 -top-10 w-40 h-40 bg-white/5 rounded-full blur-2xl"></div>
                        <div className="absolute -left-10 -bottom-10 w-40 h-40 bg-black/5 rounded-full blur-2xl"></div>
                    </div>

                    <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-700">
                        <div className="px-2">
                            <h4 className="text-sm font-bold text-slate-900 uppercase tracking-wide mb-1">Medical Conditions</h4>
                            <p className="text-sm text-slate-400 font-medium">Select any pre-existing health issues</p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            {COMORBIDITIES.map((c) => {
                                const isSelected = selectedComorbidities.includes(c.id);
                                return (
                                    <button
                                        key={c.id}
                                        onClick={() => toggleComorbidity(c.id)}
                                        className={cn(
                                            "flex items-center justify-between p-5 rounded-2xl border transition-all duration-300 group",
                                            isSelected
                                                ? "bg-indigo-50/50 backdrop-blur-md border-indigo-200 text-indigo-600"
                                                : "bg-white/40 backdrop-blur-sm border-white/40 text-slate-500 hover:border-indigo-200 hover:bg-white/60"
                                        )}
                                    >
                                        <span className="font-bold text-sm tracking-tight">{c.label}</span>
                                        <div className={cn(
                                            "w-6 h-6 rounded-full flex items-center justify-center transition-all",
                                            isSelected ? "bg-indigo-600 text-white" : "bg-slate-50 text-transparent border border-slate-100"
                                        )}>
                                            <CheckCircle2 size={14} />
                                        </div>
                                    </button>
                                );
                            })}
                        </div>

                        <button
                            onClick={handleUpdate}
                            disabled={isSaving}
                            className="flex items-center justify-center gap-2 w-full px-8 py-5 rounded-2xl bg-slate-900 text-white font-bold hover:bg-slate-800 transition-all shadow-xl shadow-slate-200 disabled:opacity-50 mt-4"
                        >
                            {isSaving ? <Loader2 size={20} className="animate-spin" /> : <Save size={20} />}
                            Update Medical Profile
                        </button>
                    </div>
                </div>
            </main>

            <Modal
                isOpen={modal.isOpen}
                onClose={() => setModal(prev => ({ ...prev, isOpen: false }))}
                title={modal.title}
                description={modal.description}
                type={modal.type}
            />
        </div>
    );
}
