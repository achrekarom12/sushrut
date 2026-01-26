import { useEffect, useRef } from 'react';

interface SwipeConfig {
    onSwipeLeft?: () => void;
    onSwipeRight?: () => void;
    threshold?: number;
    edgeThreshold?: number;
    isOpen: boolean;
}

export function useSwipe({ onSwipeLeft, onSwipeRight, threshold = 50, edgeThreshold = 40, isOpen }: SwipeConfig) {
    const touchStart = useRef<{ x: number; y: number } | null>(null);
    const touchEnd = useRef<{ x: number; y: number } | null>(null);

    useEffect(() => {
        const onTouchStart = (e: TouchEvent) => {
            touchEnd.current = null;
            touchStart.current = {
                x: e.targetTouches[0].clientX,
                y: e.targetTouches[0].clientY,
            };
        };

        const onTouchMove = (e: TouchEvent) => {
            touchEnd.current = {
                x: e.targetTouches[0].clientX,
                y: e.targetTouches[0].clientY,
            };
        };

        const onTouchEnd = () => {
            if (!touchStart.current || !touchEnd.current) return;

            const xDistance = touchStart.current.x - touchEnd.current.x;
            const yDistance = touchStart.current.y - touchEnd.current.y;

            // Ensure it's more of a horizontal swipe than vertical
            if (Math.abs(xDistance) < Math.abs(yDistance)) return;

            const isLeftSwipe = xDistance > threshold;
            const isRightSwipe = xDistance < -threshold;

            if (isOpen) {
                // When open, allow swiping closed from anywhere
                if (isLeftSwipe && onSwipeLeft) {
                    onSwipeLeft();
                }
            } else {
                // When closed, only allow opening from the edge
                if (isRightSwipe && onSwipeRight && touchStart.current.x <= edgeThreshold) {
                    onSwipeRight();
                }
            }
        };

        window.addEventListener('touchstart', onTouchStart);
        window.addEventListener('touchmove', onTouchMove);
        window.addEventListener('touchend', onTouchEnd);

        return () => {
            window.removeEventListener('touchstart', onTouchStart);
            window.removeEventListener('touchmove', onTouchMove);
            window.removeEventListener('touchend', onTouchEnd);
        };
    }, [onSwipeLeft, onSwipeRight, threshold, edgeThreshold, isOpen]);
}
