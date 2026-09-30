import { useEffect, useRef } from 'react';
import type { KeyboardEvent } from 'react';

const focusable = 'button:not(:disabled), input:not(:disabled), textarea:not(:disabled), [href]';

export const useFocusTrap = (onClose: () => void) => {
    const containerRef = useRef<HTMLElement>(null);

    // Когда модалка закроется, фокус вернётся туда, откуда её открыли.
    useEffect(() => {
        const opener = document.activeElement;
        return () => {
            if (opener instanceof HTMLElement) opener.focus();
        };
    }, []);

    const onKeyDown = (event: KeyboardEvent) => {
        if (event.key === 'Escape') return onClose();
        if (event.key !== 'Tab' || !containerRef.current) return;

        const items = [...containerRef.current.querySelectorAll<HTMLElement>(focusable)];
        const first = items[0];
        const last = items.at(-1);
        if (event.shiftKey && document.activeElement === first) {
            event.preventDefault();
            last?.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
            event.preventDefault();
            first?.focus();
        }
    };

    return { containerRef, onKeyDown };
};
