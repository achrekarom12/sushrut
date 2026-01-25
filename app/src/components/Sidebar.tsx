'use client';

import React, { Suspense } from 'react';
import { useAuth } from '@/context/AuthContext';
import { cn, generateChatId } from '@/lib/utils';
import {
    User as UserIcon,
    FileText,
    Image as ImageIcon,
    LogOut,
    X,
    ChevronRight,
    Languages,
    Activity,
    Plus,
    MessageSquare,
    Settings
} from 'lucide-react';
import Link from 'next/link';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useState, useEffect } from 'react';

interface SidebarProps {
    isOpen: boolean;
    onClose: () => void;
}

function SidebarContent({ isOpen, onClose }: SidebarProps) {
    const { user, logout, updateUser } = useAuth();
    const pathname = usePathname();
    const router = useRouter();
    const searchParams = useSearchParams();

    const handleNewChat = () => {
        const newChatId = generateChatId();
        router.push(`/?chatId=${newChatId}`);
        onClose();
    };

    const metadata = user?.healthMetadata ? JSON.parse(user.healthMetadata) : {};
    const files = metadata.files || [];

    return (
        <>
            <div
                className={cn(
                    "fixed inset-0 z-40 bg-slate-900/10 backdrop-blur-sm transition-opacity lg:hidden",
                    isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
                )}
                onClick={onClose}
            />

            <aside
                className={cn(
                    "fixed inset-y-0 left-0 z-50 w-72 bg-white border-r border-slate-100 transform transition-transform duration-300 ease-out lg:relative lg:translate-x-0 shadow-2xl lg:shadow-none",
                    isOpen ? "translate-x-0" : "-translate-x-full"
                )}
            >
                <div className="flex h-full flex-col">
                    <div className="flex items-center justify-between p-6">
                        <div className="flex items-center gap-2.5">
                            <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white">
                                <Activity size={18} />
                            </div>
                            <span className="font-bold text-slate-900">Dashboard</span>
                        </div>
                        <button onClick={onClose} className="lg:hidden p-2 rounded-xl hover:bg-slate-50 text-slate-400">
                            <X size={20} />
                        </button>
                    </div>

                    <nav className="flex-1 overflow-y-auto px-4 space-y-1.5 mt-2">
                        <button
                            onClick={handleNewChat}
                            className="flex w-full items-center gap-3 px-4 py-3.5 rounded-2xl bg-indigo-600 text-white hover:bg-indigo-700 transition-all font-bold text-sm shadow-lg shadow-indigo-100 mb-6 group active:scale-[0.98]"
                        >
                            <div className="w-6 h-6 rounded-lg bg-white/20 flex items-center justify-center group-hover:bg-white/30 transition-colors">
                                <Plus size={16} />
                            </div>
                            <span>Start New Chat</span>
                        </button>

                        <div className="space-y-1.5">
                            <Link
                                href="/profile"
                                className={cn(
                                    "flex items-center gap-3 px-4 py-3 rounded-2xl transition-all font-semibold text-sm",
                                    pathname === '/profile' ? "bg-indigo-50 text-indigo-600 shadow-sm border border-indigo-100" : "text-slate-500 hover:text-slate-900 hover:bg-slate-50"
                                )}
                                onClick={onClose}
                            >
                                <UserIcon size={18} />
                                <span className="flex-1">My Profile</span>
                                <ChevronRight size={14} className="opacity-40" />
                            </Link>

                            <Link
                                href="/reports"
                                className={cn(
                                    "flex items-center gap-3 px-4 py-3 rounded-2xl transition-all font-semibold text-sm",
                                    pathname === '/reports' ? "bg-indigo-50 text-indigo-600 shadow-sm border border-indigo-100" : "text-slate-500 hover:text-slate-900 hover:bg-slate-50"
                                )}
                                onClick={onClose}
                            >
                                <FileText size={18} />
                                <span className="flex-1">My Reports</span>
                                <div className="flex items-center gap-1.5">
                                    {files.length > 0 && (
                                        <span className="flex items-center justify-center w-5 h-5 rounded-full bg-indigo-600 text-[10px] text-white font-bold">
                                            {files.length}
                                        </span>
                                    )}
                                    <ChevronRight size={14} className="opacity-40" />
                                </div>
                            </Link>

                            <Link
                                href="/history"
                                className={cn(
                                    "flex items-center gap-3 px-4 py-3 rounded-2xl transition-all font-semibold text-sm",
                                    pathname === '/history' ? "bg-indigo-50 text-indigo-600 shadow-sm border border-indigo-100" : "text-slate-500 hover:text-slate-900 hover:bg-slate-50"
                                )}
                                onClick={onClose}
                            >
                                <MessageSquare size={18} />
                                <span className="flex-1">Chat History</span>
                                <ChevronRight size={14} className="opacity-40" />
                            </Link>

                            <Link
                                href="/settings"
                                className={cn(
                                    "flex items-center gap-3 px-4 py-3 rounded-2xl transition-all font-semibold text-sm",
                                    pathname === '/settings' ? "bg-indigo-50 text-indigo-600 shadow-sm border border-indigo-100" : "text-slate-500 hover:text-slate-900 hover:bg-slate-50"
                                )}
                                onClick={onClose}
                            >
                                <Settings size={18} />
                                <span className="flex-1">Settings</span>
                                <ChevronRight size={14} className="opacity-40" />
                            </Link>
                        </div>
                    </nav>

                    <div className="p-4 bg-white border-t border-slate-100">
                        <button
                            onClick={logout}
                            className="flex w-full items-center gap-3 px-4 py-3 rounded-2xl text-red-600 hover:bg-red-50 transition-all font-bold text-sm"
                        >
                            <LogOut size={18} />
                            <span>Logout</span>
                        </button>
                    </div>
                </div>
            </aside>
        </>
    );
}

export function Sidebar(props: SidebarProps) {
    return (
        <Suspense fallback={
            <aside className="fixed inset-y-0 left-0 z-50 w-72 bg-white border-r border-slate-100 lg:relative shadow-2xl lg:shadow-none animate-pulse" />
        }>
            <SidebarContent {...props} />
        </Suspense>
    );
}

