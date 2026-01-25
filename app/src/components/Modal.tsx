'use client';

import React, { useEffect } from 'react';
import { X, AlertCircle, CheckCircle2, AlertTriangle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    description?: string;
    children?: React.ReactNode;
    type?: 'info' | 'success' | 'warning' | 'error';
    confirmLabel?: string;
    cancelLabel?: string;
    onConfirm?: () => void;
    isLoading?: boolean;
}

export function Modal({
    isOpen,
    onClose,
    title,
    description,
    children,
    type = 'info',
    confirmLabel = 'Confirm',
    cancelLabel = 'Cancel',
    onConfirm,
    isLoading = false,
}: ModalProps) {
    useEffect(() => {
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose();
        };
        if (isOpen) {
            document.body.style.overflow = 'hidden';
            window.addEventListener('keydown', handleEscape);
        }
        return () => {
            document.body.style.overflow = 'unset';
            window.removeEventListener('keydown', handleEscape);
        };
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    const icons = {
        info: <AlertCircle className="text-indigo-600" size={24} />,
        success: <CheckCircle2 className="text-emerald-600" size={24} />,
        warning: <AlertTriangle className="text-amber-600" size={24} />,
        error: <AlertTriangle className="text-red-600" size={24} />,
    };

    const bgColors = {
        info: 'bg-indigo-50',
        success: 'bg-emerald-50',
        warning: 'bg-amber-50',
        error: 'bg-red-50',
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
            <div
                className="absolute inset-0 bg-slate-900/40 backdrop-blur-md transition-opacity animate-in fade-in duration-300"
                onClick={onClose}
            />

            <div className="relative w-full max-w-md bg-white/70 backdrop-blur-xl rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.1)] border border-white/40 overflow-hidden animate-in zoom-in-95 slide-in-from-bottom-4 duration-300">
                <div className="p-6 sm:p-8">
                    <div className="flex items-start justify-between mb-6">
                        <div className={cn("p-3 rounded-2xl", bgColors[type])}>
                            {icons[type]}
                        </div>
                        <button
                            onClick={onClose}
                            className="p-2 rounded-xl hover:bg-slate-50 text-slate-400 transition-colors"
                        >
                            <X size={20} />
                        </button>
                    </div>

                    <div className="space-y-2">
                        <h3 className="text-xl font-bold text-slate-900 leading-tight">
                            {title}
                        </h3>
                        {description && (
                            <p className="text-slate-500 text-sm font-medium leading-relaxed">
                                {description}
                            </p>
                        )}
                    </div>

                    {children && <div className="mt-6">{children}</div>}

                    <div className="mt-8 flex flex-col sm:flex-row gap-3">
                        {onConfirm && (
                            <button
                                onClick={onConfirm}
                                disabled={isLoading}
                                className={cn(
                                    "flex-1 px-6 py-3.5 rounded-2xl font-bold text-sm transition-all duration-200 active:scale-95 flex items-center justify-center gap-2",
                                    type === 'error'
                                        ? "bg-red-600 text-white hover:bg-red-700 shadow-lg shadow-red-100"
                                        : "bg-indigo-600 text-white hover:bg-indigo-700 shadow-lg shadow-indigo-100",
                                    isLoading && "opacity-70 cursor-not-allowed"
                                )}
                            >
                                {isLoading ? (
                                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                ) : confirmLabel}
                            </button>
                        )}
                        <button
                            onClick={onClose}
                            className="flex-1 px-6 py-3.5 rounded-2xl bg-slate-50 text-slate-600 font-bold text-sm hover:bg-slate-100 transition-all active:scale-95 border border-slate-100"
                        >
                            {cancelLabel}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
