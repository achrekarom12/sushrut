'use client';

import React from 'react';
import { useAuth } from '@/context/AuthContext';
import { cn } from '@/lib/utils';
import {
    User as UserIcon,
    Settings,
    FileText,
    Image as ImageIcon,
    LogOut,
    X,
    ChevronRight,
    Languages,
    Activity
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

                        <div className="pt-6 pb-2">
                            <div className="px-4 text-[10px] font-bold text-slate-300 uppercase tracking-[0.2em] mb-4">Medical Records</div>

                            <div className="space-y-6">
                                <div>
                                    <h4 className="px-4 text-xs font-bold text-slate-900 mb-3 flex items-center gap-2">
                                        <FileText size={14} className="text-indigo-600" />
                                        PDF REPORTS
                                    </h4>
                                    <div className="space-y-1">
                                        {pdfs.length > 0 ? pdfs.map((file: any, i: number) => (
                                            <a
                                                key={i}
                                                href={file.url}
                                                target="_blank"
                                                rel="noreferrer"
                                                className="block px-4 py-2 text-sm text-slate-500 hover:text-indigo-600 hover:bg-slate-50 rounded-xl transition-all truncate font-medium"
                                            >
                                                {file.name}
                                            </a>
                                        )) : (
                                            <p className="px-4 text-[11px] text-slate-400 italic">No reports uploaded</p>
                                        )}
                                    </div>
                                </div>

                                <div>
                                    <h4 className="px-4 text-xs font-bold text-slate-900 mb-3 flex items-center gap-2">
                                        <ImageIcon size={14} className="text-indigo-600" />
                                        VISUALS
                                    </h4>
                                    <div className="space-y-1">
                                        {images.length > 0 ? images.map((file: any, i: number) => (
                                            <a
                                                key={i}
                                                href={file.url}
                                                target="_blank"
                                                rel="noreferrer"
                                                className="block px-4 py-2 text-sm text-slate-500 hover:text-indigo-600 hover:bg-slate-50 rounded-xl transition-all truncate font-medium"
                                            >
                                                {file.name}
                                            </a>
                                        )) : (
                                            <p className="px-4 text-[11px] text-slate-400 italic">No images uploaded</p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </nav>

                    <div className="p-4 bg-slate-50 border-t border-slate-100 space-y-4">
                        <div>
                            <div className="flex items-center gap-2 mb-3 px-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                                <Languages size={12} />
                                Language
                            </div>
                            <div className="flex gap-1 bg-white p-1 rounded-xl border border-slate-200">
                                {['english', 'hindi', 'marathi'].map((lang) => (
                                    <button
                                        key={lang}
                                        onClick={() => handleLanguageChange(lang)}
                                        className={cn(
                                            "flex-1 px-1 py-2 text-[11px] font-bold rounded-lg transition-all capitalize",
                                            user?.languagePreference === lang ? "bg-indigo-600 text-white shadow-sm" : "text-slate-500 hover:text-slate-900"
                                        )}
                                    >
                                        {lang.slice(0, 3)}
                                    </button>
                                ))}
                            </div>
                        </div>

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
