'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Sidebar } from '@/components/Sidebar';
import { Menu, MessageSquare, Trash2, Calendar, Clock, ChevronRight, Loader2, Hospital } from 'lucide-react';
import { Modal } from '@/components/Modal';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { cn } from '@/lib/utils';

function HistoryContent() {
    const { user, isLoggedIn, isLoading: authLoading } = useAuth();
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [conversations, setConversations] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [chatToDelete, setChatToDelete] = useState<string | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);
    const router = useRouter();

    useEffect(() => {
        if (!authLoading && !isLoggedIn) {
            router.push('/login');
        }
    }, [isLoggedIn, authLoading, router]);

    useEffect(() => {
        if (user?.id || user?.user_id) {
            fetchConversations();
        }
    }, [user]);

    const fetchConversations = async () => {
        try {
            const userId = user?.id || user?.user_id;
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/ai/conversations/${userId}`);
            if (response.ok) {
                const data = await response.json();
                setConversations(data);
            }
        } catch (err) {
            console.error('Error fetching conversations:', err);
        } finally {
            setIsLoading(false);
        }
    };

    const handleDeleteClick = (e: React.MouseEvent, chatId: string) => {
        e.preventDefault();
        e.stopPropagation();
        setChatToDelete(chatId);
    };

    const confirmDelete = async () => {
        if (!chatToDelete) return;

        setIsDeleting(true);
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/ai/conversations/${chatToDelete}`, {
                method: 'DELETE',
            });

            if (response.ok) {
                setConversations(prev => prev.filter(chat => chat.id !== chatToDelete));
                setChatToDelete(null);
            } else {
                alert('Failed to delete conversation');
            }
        } catch (err) {
            console.error('Error deleting conversation:', err);
            alert('Error deleting conversation');
        } finally {
            setIsDeleting(false);
        }
    };

    const formatDate = (dateStr: string) => {
        const date = new Date(dateStr);
        return date.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        });
    };

    const formatTime = (dateStr: string) => {
        const date = new Date(dateStr);
        return date.toLocaleTimeString('en-US', {
            hour: 'numeric',
            minute: '2-digit',
            hour12: true
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

            <main className="flex-1 flex flex-col min-w-0 bg-transparent overflow-hidden">
                <header className="flex items-center justify-between px-6 py-4 bg-white/60 backdrop-blur-xl border-b border-white/20 sticky top-0 z-10">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => setSidebarOpen(true)}
                            className="lg:hidden p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-600 hover:bg-slate-100 transition-colors"
                        >
                            <Menu size={20} />
                        </button>
                        <div className="flex items-center gap-3">
                            <div>
                                <h2 className="text-lg font-bold leading-tight">Chat History</h2>
                            </div>
                        </div>
                    </div>
                </header>

                <div className="flex-1 overflow-y-auto p-6 md:p-12">
                    <div className="max-w-4xl mx-auto space-y-8">
                        {isLoading ? (
                            <div className="flex flex-col items-center justify-center py-20 gap-4">
                                <Loader2 className="h-8 w-8 animate-spin text-indigo-600 opacity-20" />
                                <p className="text-sm text-slate-400 font-medium">Loading your conversations...</p>
                            </div>
                        ) : conversations.length === 0 ? (
                            <div className="text-center py-20 px-8 rounded-[2.5rem] bg-slate-50 border-2 border-dashed border-slate-100">
                                <div className="w-16 h-16 rounded-2xl bg-white flex items-center justify-center text-slate-300 mx-auto mb-6 shadow-sm">
                                    <MessageSquare size={32} />
                                </div>
                                <h3 className="text-xl font-bold text-slate-900 mb-2">No conversations yet</h3>
                                <p className="text-slate-500 text-sm max-w-xs mx-auto mb-8">
                                    Start a new conversation with Sushrut AI to get medical advice and insights.
                                </p>
                                <Link
                                    href="/"
                                    className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-indigo-600 text-white font-bold text-sm hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100"
                                >
                                    Start New Chat
                                </Link>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {conversations.map((chat, idx) => (
                                    <div
                                        key={chat.id}
                                        className="group relative flex flex-col p-6 rounded-[2.5rem] bg-white/60 backdrop-blur-md border border-white/40 hover:border-indigo-200/50 hover:shadow-2xl hover:shadow-indigo-500/10 transition-all duration-300 animate-in slide-in-from-bottom-4"
                                        style={{ animationDelay: `${idx * 50}ms` }}
                                    >
                                        <Link
                                            href={`/?chatId=${chat.id}`}
                                            className="flex-1 mb-6"
                                        >
                                            <div className="flex items-start justify-between mb-4">
                                                <div className="p-2.5 rounded-xl bg-indigo-50 text-indigo-600">
                                                    <MessageSquare size={18} />
                                                </div>
                                                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-50 border border-slate-100 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                                                    <Calendar size={10} />
                                                    {formatDate(chat.created_at)}
                                                </div>
                                            </div>
                                            <h3 className="text-base font-bold text-slate-900 mb-2 line-clamp-1 group-hover:text-indigo-600 transition-colors">
                                                {chat.title || 'New Conversation'}
                                            </h3>
                                            <div className="flex items-center gap-3 text-xs text-slate-400 font-medium">
                                                <div className="flex items-center gap-1">
                                                    <Clock size={12} />
                                                    {formatTime(chat.created_at)}
                                                </div>
                                            </div>
                                        </Link>

                                        <div className="flex items-center gap-2 pt-4 border-t border-slate-50">
                                            <Link
                                                href={`/?chatId=${chat.id}`}
                                                className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-slate-900 text-white text-xs font-bold hover:bg-slate-800 transition-all"
                                            >
                                                Open Chat
                                                <ChevronRight size={14} />
                                            </Link>
                                            <button
                                                onClick={(e) => handleDeleteClick(e, chat.id)}
                                                className="p-3 rounded-xl bg-red-50 text-red-500 hover:bg-red-100 transition-all active:scale-95"
                                                title="Delete Conversation"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </main>

            <Modal
                isOpen={!!chatToDelete}
                onClose={() => setChatToDelete(null)}
                title="Delete Chat History?"
                description="This will permanently delete this conversation and all its messages. This action cannot be undone."
                type="error"
                confirmLabel="Delete Chat"
                onConfirm={confirmDelete}
                isLoading={isDeleting}
            />
        </div>
    );
}

export default function HistoryPage() {
    return (
        <Suspense fallback={
            <div className="flex min-h-screen items-center justify-center bg-white">
                <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
            </div>
        }>
            <HistoryContent />
        </Suspense>
    );
}
