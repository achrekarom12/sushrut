'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Sidebar } from '@/components/Sidebar';
import { Menu, Save, Loader2, ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function SettingsPage() {
    const { user, isLoggedIn, isLoading: authLoading, updateUser } = useAuth();
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        age: '',
        gender: ''
    });
    const router = useRouter();

    useEffect(() => {
        if (!authLoading && !isLoggedIn) {
            router.push('/login');
        }
    }, [isLoggedIn, authLoading, router]);

    useEffect(() => {
        if (user) {
            setFormData({
                name: user.name || '',
                age: user.age?.toString() || '',
                gender: user.gender || ''
            });
        }
    }, [user]);

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);

        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/users/${user?.id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: formData.name,
                    age: parseInt(formData.age),
                    gender: formData.gender
                })
            });

            if (response.ok) {
                const updatedUser = await response.json();
                updateUser(updatedUser);
                alert('Settings saved successfully!');
            } else {
                alert('Failed to save settings.');
            }
        } catch (err) {
            console.error('Save error:', err);
            alert('Unable to connect to the server.');
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

                <div className="flex-1 max-w-2xl w-full mx-auto p-6 md:p-12">
                    <div className="bg-[#f8fafc] rounded-[2.5rem] border border-slate-100 p-8 md:p-12 shadow-inner">
                        <form onSubmit={handleSave} className="space-y-8 animate-in fade-in slide-in-from-bottom-4">
                            <div className="space-y-6">
                                <div className="space-y-2">
                                    <label className="block text-sm font-bold text-slate-700 ml-1">FULL NAME</label>
                                    <input
                                        type="text"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        placeholder="Enter your name"
                                        required
                                        className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-4 outline-none focus:border-indigo-600 focus:ring-4 focus:ring-indigo-50 transition-all font-medium"
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label className="block text-sm font-bold text-slate-700 ml-1">AGE</label>
                                        <input
                                            type="number"
                                            value={formData.age}
                                            onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                                            placeholder="25"
                                            min="1"
                                            max="120"
                                            required
                                            className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-4 outline-none focus:border-indigo-600 focus:ring-4 focus:ring-indigo-50 transition-all font-medium"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="block text-sm font-bold text-slate-700 ml-1">GENDER</label>
                                        <select
                                            value={formData.gender}
                                            onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                                            required
                                            className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-4 outline-none focus:border-indigo-600 focus:ring-4 focus:ring-indigo-50 transition-all font-medium appearance-none"
                                        >
                                            <option value="">Select</option>
                                            <option value="male">Male</option>
                                            <option value="female">Female</option>
                                            <option value="other">Other</option>
                                            <option value="prefer-not-to-say">Prefer not to say</option>
                                        </select>
                                    </div>
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={isSaving}
                                className="flex items-center justify-center gap-2 w-full px-8 py-4 rounded-2xl bg-indigo-600 text-white font-bold shadow-lg shadow-indigo-100 hover:bg-indigo-700 transition-all disabled:opacity-50"
                            >
                                {isSaving ? <Loader2 size={20} className="animate-spin" /> : <Save size={20} />}
                                Save Profile Changes
                            </button>
                        </form>
                    </div>
                </div>
            </main>
        </div>
    );
}
