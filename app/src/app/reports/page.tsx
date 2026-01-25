'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Sidebar } from '@/components/Sidebar';
import { Menu, Loader2, ArrowLeft, FileText, Image as ImageIcon, Trash2, AlertCircle } from 'lucide-react';
import { Modal } from '@/components/Modal';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { cn } from '@/lib/utils';

export default function ReportsPage() {
    const { user, isLoggedIn, isLoading: authLoading, updateUser } = useAuth();
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [isDeleting, setIsDeleting] = useState<string | null>(null);
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

    const metadata = user?.healthMetadata ? JSON.parse(user.healthMetadata) : {};
    const files = metadata.files || [];
    const pdfs = files.filter((f: any) => f.name.toLowerCase().endsWith('.pdf'));
    const images = files.filter((f: any) => /\.(jpg|jpeg|png|gif|webp)$/i.test(f.name));

    const performDeleteFile = async (fileUrl: string) => {
        setIsDeleting(fileUrl);
        try {
            const updatedFiles = files.filter((f: any) => f.url !== fileUrl);
            const updatedMetadata = { ...metadata, files: updatedFiles };

            const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/users/${user?.id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ healthMetadata: JSON.stringify(updatedMetadata) }),
            });

            if (response.ok) {
                updateUser({ healthMetadata: JSON.stringify(updatedMetadata) });
            } else {
                setModal({
                    isOpen: true,
                    title: 'Delete Failed',
                    description: 'Could not delete the report. Please try again.',
                    type: 'error'
                });
            }
        } catch (err) {
            console.error('Delete report error:', err);
            setModal({
                isOpen: true,
                title: 'Error',
                description: 'An error occurred while deleting the report.',
                type: 'error'
            });
        } finally {
            setIsDeleting(null);
            setModal(prev => ({ ...prev, isOpen: false }));
        }
    };

    const handleDeleteFile = (fileUrl: string) => {
        setModal({
            isOpen: true,
            title: 'Delete Report?',
            description: 'Are you sure you want to delete this medical document? This action cannot be reversed.',
            type: 'warning',
            confirmLabel: 'Delete',
            onConfirm: () => performDeleteFile(fileUrl)
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
                        <h2 className="text-lg font-bold">Medical Reports</h2>
                    </div>
                </header>

                <div className="flex-1 max-w-3xl w-full mx-auto p-6 md:p-12 space-y-10">
                    <div className="relative overflow-hidden p-8 rounded-[2.5rem] bg-emerald-600 text-white shadow-2xl shadow-emerald-100 animate-in zoom-in duration-500">
                        <div className="relative z-10">
                            <div className="flex items-center gap-4 mb-6">
                                <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-white text-2xl font-bold border border-white/20">
                                    <FileText size={32} />
                                </div>
                                <div>
                                    <h3 className="text-2xl font-bold">Health Vault</h3>
                                    <p className="text-emerald-500 font-medium bg-white/90 px-3 py-1 rounded-full inline-block text-[11px] uppercase tracking-wider mt-1">
                                        {files.length} Secure Documents
                                    </p>
                                </div>
                            </div>
                            <p className="text-emerald-50 text-sm leading-relaxed max-w-md">
                                Access and manage your verified medical records, diagnostic reports, and clinical images in one secure location.
                            </p>
                        </div>
                        <div className="absolute -right-10 -top-10 w-40 h-40 bg-white/5 rounded-full blur-2xl"></div>
                        <div className="absolute -left-10 -bottom-10 w-40 h-40 bg-black/5 rounded-full blur-2xl"></div>
                    </div>

                    {/* PDF Section */}
                    <section className="space-y-6 animate-in slide-in-from-bottom-4 duration-700">
                        <div className="px-2 flex items-center justify-between">
                            <div>
                                <h4 className="text-sm font-bold text-slate-900 uppercase tracking-widest mb-1">PDF Reports</h4>
                                <p className="text-sm text-slate-400 font-medium">Documents and Lab Results</p>
                            </div>
                            <span className="text-[10px] bg-slate-100 text-slate-500 px-3 py-1 rounded-full font-bold uppercase tracking-wider">
                                {pdfs.length} Files
                            </span>
                        </div>

                        <div className="grid grid-cols-1 gap-3">
                            {pdfs.length > 0 ? pdfs.map((file: any, i: number) => (
                                <div
                                    key={i}
                                    className="group flex items-center justify-between p-4 rounded-2xl border border-slate-100 bg-white hover:border-indigo-200 hover:shadow-lg hover:shadow-indigo-50/50 transition-all duration-300"
                                >
                                    <div className="flex items-center gap-4 min-w-0">
                                        <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600">
                                            <FileText size={20} />
                                        </div>
                                        <div className="min-w-0">
                                            <h5 className="font-bold text-sm text-slate-900 truncate pr-4">{file.name}</h5>
                                            <p className="text-[10px] text-slate-400 font-medium uppercase tracking-wider">
                                                {file.uploadedAt ? new Date(file.uploadedAt).toLocaleDateString() : 'Recently uploaded'}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">

                                        <button
                                            onClick={() => handleDeleteFile(file.url)}
                                            disabled={isDeleting === file.url}
                                            className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                                            title="Delete report"
                                        >
                                            {isDeleting === file.url ? <Loader2 size={18} className="animate-spin" /> : <Trash2 size={18} />}
                                        </button>
                                    </div>
                                </div>
                            )) : (
                                <div className="p-8 rounded-3xl border border-dashed border-slate-200 text-center">
                                    <p className="text-sm text-slate-400 italic">No PDF reports uploaded yet.</p>
                                </div>
                            )}
                        </div>
                    </section>

                    {/* Images Section */}
                    <section className="space-y-6 animate-in slide-in-from-bottom-4 duration-700 delay-150">
                        <div className="px-2 flex items-center justify-between">
                            <div>
                                <h4 className="text-sm font-bold text-slate-900 uppercase tracking-widest mb-1">Visuals & Scans</h4>
                                <p className="text-sm text-slate-400 font-medium">X-Rays, MRIs, and medical photos</p>
                            </div>
                            <span className="text-[10px] bg-slate-100 text-slate-500 px-3 py-1 rounded-full font-bold uppercase tracking-wider">
                                {images.length} Files
                            </span>
                        </div>

                        <div className="grid grid-cols-1 gap-3">
                            {images.length > 0 ? images.map((file: any, i: number) => (
                                <div
                                    key={i}
                                    className="group flex items-center justify-between p-4 rounded-2xl border border-slate-100 bg-white hover:border-indigo-200 hover:shadow-lg hover:shadow-indigo-50/50 transition-all duration-300"
                                >
                                    <div className="flex items-center gap-4 min-w-0">
                                        <div className="w-10 h-10 rounded-xl bg-orange-50 flex items-center justify-center text-orange-600">
                                            <ImageIcon size={20} />
                                        </div>
                                        <div className="min-w-0">
                                            <h5 className="font-bold text-sm text-slate-900 truncate pr-4">{file.name}</h5>
                                            <p className="text-[10px] text-slate-400 font-medium uppercase tracking-wider">
                                                {file.uploadedAt ? new Date(file.uploadedAt).toLocaleDateString() : 'Image'}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <button
                                            onClick={() => handleDeleteFile(file.url)}
                                            disabled={isDeleting === file.url}
                                            className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                                            title="Delete image"
                                        >
                                            {isDeleting === file.url ? <Loader2 size={18} className="animate-spin" /> : <Trash2 size={18} />}
                                        </button>
                                    </div>
                                </div>
                            )) : (
                                <div className="col-span-full p-8 rounded-3xl border border-dashed border-slate-200 text-center">
                                    <p className="text-sm text-slate-400 italic">No visuals uploaded yet.</p>
                                </div>
                            )}
                        </div>
                    </section>
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
                isLoading={!!isDeleting}
            />
        </div>
    );
}
