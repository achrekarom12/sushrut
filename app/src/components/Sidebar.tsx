'use client';

import React from 'react';
import { useAuth } from '@/context/AuthContext';
import { cn } from '@/lib/utils';
import {
    User as UserIcon,
    FileText,
    Image as ImageIcon,
    LogOut,
    X,
    ChevronRight,
    Languages,
    Activity,
    Trash2,
    Settings
} from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface SidebarProps {
    isOpen: boolean;
    onClose: () => void;
}

export function Sidebar({ isOpen, onClose }: SidebarProps) {
    const { user, logout, updateUser } = useAuth();
    const pathname = usePathname();

    const metadata = user?.healthMetadata ? JSON.parse(user.healthMetadata) : {};
    const files = metadata.files || [];
    const pdfs = files.filter((f: any) => f.name.toLowerCase().endsWith('.pdf'));
    const images = files.filter((f: any) => /\.(jpg|jpeg|png|gif|webp)$/i.test(f.name));

    const handleLanguageChange = async (lang: string) => {
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
        }
    };

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
