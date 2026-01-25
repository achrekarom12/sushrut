'use client';

import React, { useRef, useState } from 'react';
import { Paperclip, Send, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/context/AuthContext';

interface ChatInputProps {
    onSendMessage: (text: string) => void;
    onFileUpload: (file: File) => void;
    isUploading: boolean;
    isResponding: boolean;
}

export function ChatInput({ onSendMessage, onFileUpload, isUploading, isResponding }: ChatInputProps) {
    const [message, setMessage] = useState('');
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (message.trim() && !isResponding) {
            onSendMessage(message.trim());
            setMessage('');
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            onFileUpload(file);
        }
    };

    return (
        <div className="p-4 bg-white/50 backdrop-blur-md">
            <form onSubmit={handleSubmit} className="flex items-end gap-3 p-2 bg-white rounded-[1.5rem] border border-slate-200 shadow-xl shadow-slate-200/40 focus-within:border-indigo-600/30 transition-all">
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
                    className="p-3 rounded-xl text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 transition-all disabled:opacity-50 flex-shrink-0"
                >
                    {isUploading ? <Loader2 size={22} className="animate-spin" /> : <Paperclip size={22} />}
                </button>
                <textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyDown={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                            e.preventDefault();
                            handleSubmit(e);
                        }
                    }}
                    placeholder="Ask anything about your health..."
                    className="flex-1 py-3 text-slate-800 placeholder:text-slate-400 text-[15px] leading-relaxed bg-transparent border-none focus:ring-0 resize-none min-h-[44px] max-h-32 transition-all"
                    rows={1}
                    style={{ height: 'auto' }}
                    ref={(el) => {
                        if (el) {
                            el.style.height = 'auto';
                            el.style.height = `${el.scrollHeight}px`;
                        }
                    }}
                />
                <button
                    type="submit"
                    disabled={!message.trim() || isResponding}
                    className="p-3 rounded-xl bg-indigo-600 text-white shadow-lg shadow-indigo-100 hover:bg-indigo-700 disabled:opacity-50 disabled:shadow-none transition-all flex-shrink-0"
                >
                    <Send size={22} />
                </button>
            </form>
            <p className="mt-3 text-center text-[10px] text-slate-400 font-medium uppercase tracking-[0.2em]">
                AI Medical advice should be verified with a professional.
            </p>
        </div>
    );
}
