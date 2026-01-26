'use client';

import React from 'react';
import ReactMarkdown from 'react-markdown';
import { cn } from '@/lib/utils';
import { Stethoscope } from 'lucide-react';

interface MessageProps {
    text: string;
    type: 'sent' | 'received';
    timestamp: string;
}

export function Message({ text, type, timestamp }: MessageProps) {
    const isReceived = type === 'received';

    return (
        <div className={cn(
            "flex w-full mb-6 animate-in fade-in slide-in-from-bottom-2",
            isReceived ? "justify-start" : "justify-end"
        )}>
            <div className={cn(
                "flex max-w-[85%] md:max-w-[75%] gap-3",
                !isReceived && "flex-row-reverse"
            )}>
                {isReceived && (
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600 border border-indigo-100/50">
                        <Stethoscope size={16} />
                    </div>
                )}
                <div className="flex flex-col gap-1.5 min-w-0">
                    <div className={cn(
                        "px-5 py-3.5 rounded-[1.5rem] text-[15px] leading-relaxed shadow-sm",
                        isReceived
                            ? "bg-white/60 backdrop-blur-md border border-white/40 text-slate-800 rounded-tl-none shadow-[0_4px_12px_rgba(0,0,0,0.03)]"
                            : "bg-indigo-600/90 backdrop-blur-md text-white rounded-tr-none shadow-[0_4px_12px_rgba(79,70,229,0.3)]"
                    )}>
                        {isReceived ? (
                            <div className="markdown-content prose prose-sm prose-slate prose-p:leading-relaxed prose-headings:text-slate-900 prose-strong:text-slate-900 prose-code:bg-slate-50 prose-code:p-0.5 prose-code:rounded prose-code:before:content-none prose-code:after:content-none">
                                <ReactMarkdown>{text}</ReactMarkdown>
                            </div>
                        ) : (
                            <p className="whitespace-pre-wrap">{text}</p>
                        )}
                    </div>
                    <span className={cn(
                        "text-[10px] text-slate-400 font-bold uppercase tracking-widest px-1",
                        !isReceived && "text-right"
                    )}>
                        {timestamp}
                    </span>
                </div>
            </div>
        </div>
    );
}
