'use client';

import React, { useRef, useState, useEffect } from 'react';
import { Paperclip, Loader2, ArrowUp } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

interface ChatInputProps {
    onSendMessage: (text: string) => void;
    onFileUpload: (file: File) => void;
    isUploading: boolean;
    isResponding: boolean;
}

export function ChatInput({ onSendMessage, onFileUpload, isUploading, isResponding }: ChatInputProps) {
    const [message, setMessage] = useState('');
    const fileInputRef = useRef<HTMLInputElement>(null);
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    const handleSubmit = (e?: React.FormEvent) => {
        e?.preventDefault();
        if (message.trim() && !isResponding) {
            onSendMessage(message.trim());
            setMessage('');
            if (textareaRef.current) {
                textareaRef.current.style.height = '46px';
            }
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            onFileUpload(file);
        }
    };

    // Auto-resize textarea
    useEffect(() => {
        if (textareaRef.current) {
            textareaRef.current.style.height = '46px';
            const scrollHeight = textareaRef.current.scrollHeight;
            if (scrollHeight > 46) {
                textareaRef.current.style.height = Math.min(scrollHeight, 200) + 'px';
            }
        }
    }, [message]);

    return (
        <div className="px-4 pb-8 pt-2 bg-transparent">
            <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className="relative w-full"
            >
                <form
                    onSubmit={handleSubmit}
                    className={cn(
                        "relative flex items-end gap-2 pl-2 pr-2 py-2 bg-white/80 backdrop-blur-2xl rounded-[28px] border border-slate-200/80 shadow-[0_10px_40px_-10px_rgba(0,0,0,0.08)] transition-all duration-300",
                        "focus-within:border-indigo-500/40 focus-within:shadow-[0_15px_45px_-10px_rgba(79,70,229,0.12)] focus-within:bg-white"
                    )}
                >
                    <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleFileChange}
                        accept="application/pdf,image/*"
                        className="hidden"
                    />

                    <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        disabled={isUploading}
                        className="flex items-center justify-center w-10 h-10 rounded-full text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 transition-all disabled:opacity-50 flex-shrink-0 mb-0.5"
                        title="Upload attachment"
                    >
                        {isUploading ? <Loader2 size={19} className="animate-spin" /> : <Paperclip size={19} />}
                    </button>

                    <textarea
                        ref={textareaRef}
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter' && !e.shiftKey) {
                                e.preventDefault();
                                handleSubmit();
                            }
                        }}
                        placeholder="Ask Sushrut..."
                        className="flex-1 max-h-[200px] min-h-[46px] py-3 text-[15px] text-slate-800 placeholder:text-slate-400 bg-transparent border-none focus:ring-0 resize-none leading-relaxed transition-all"
                        rows={1}
                    />

                    <button
                        type="submit"
                        disabled={!message.trim() || isResponding}
                        className={cn(
                            "flex items-center justify-center w-10 h-10 rounded-full transition-all duration-300 flex-shrink-0 mb-0.5",
                            message.trim() && !isResponding
                                ? "bg-indigo-600 text-white shadow-lg shadow-indigo-200 hover:bg-indigo-700 hover:-translate-y-0.5 active:scale-95"
                                : "bg-slate-100 text-slate-300 cursor-not-allowed shadow-none"
                        )}
                    >
                        {isResponding ? (
                            <Loader2 size={18} className="animate-spin" />
                        ) : (
                            <ArrowUp size={20} className="stroke-[3px]" />
                        )}
                    </button>
                </form>

                <AnimatePresence>
                    {!message.trim() && (
                        <motion.p
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="absolute -bottom-7 left-0 right-0 text-[10px] text-center text-slate-400/80 font-medium tracking-tight pointer-events-none"
                        >
                            Sushrut provides AI-generated guidance. Always verify with a medical professional.
                        </motion.p>
                    )}
                </AnimatePresence>
            </motion.div>
        </div>
    );
}
