import { useLayoutEffect, useRef } from 'react';

export const useScrollToBottom = (itemsCount: number) => {
    const scrollerRef = useRef<HTMLDivElement>(null);

    useLayoutEffect(() => {
        const scroller = scrollerRef.current;
        if (scroller) scroller.scrollTop = scroller.scrollHeight;
    }, [itemsCount]);

    return scrollerRef;
};
