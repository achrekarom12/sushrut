'use client';

import React from 'react';
import { useSidebar } from '@/context/SidebarContext';
import { useSwipe } from '@/hooks/useSwipe';

export function GestureWrapper({ children }: { children: React.ReactNode }) {
    const { isOpen, open, close } = useSidebar();

    useSwipe({
        onSwipeLeft: close,
        onSwipeRight: open,
        isOpen,
    });

    return <>{children}</>;
}
