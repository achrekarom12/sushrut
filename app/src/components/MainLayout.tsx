'use client';

import React, { useState } from 'react';
import { Sidebar } from '@/components/Sidebar';
import { useSwipe } from '@/hooks/useSwipe';

interface MainLayoutProps {
    children: React.ReactNode;
}

export function MainLayout({ children }: MainLayoutProps) {
    const [sidebarOpen, setSidebarOpen] = useState(false);

    useSwipe({
        onSwipeLeft: () => setSidebarOpen(false),
        onSwipeRight: () => setSidebarOpen(true),
        isOpen: sidebarOpen,
    });

    // We need to pass sidebarOpen and setSidebarOpen to children if they need to trigger it
    // Or we can use a context. Using a context is much cleaner.

    return (
        <div className="flex h-screen bg-transparent overflow-hidden text-slate-900">
            <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
            <main className="flex-1 flex flex-col min-w-0 bg-transparent relative">
                {/* 
                   We need a way for children (pages) to toggle the sidebar.
                   They currently have their own state.
                */}
                {children}
            </main>
        </div>
    );
}
