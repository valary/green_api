import type { TextPart } from '@/types/message';

const urlPattern = /https?:\/\/[^\s<>"]+/g;

// Ссылки только http(s): текст режется на куски, HTML не собирается — рендерит React.
export const splitLinks = (text: string): TextPart[] => {
    const parts: TextPart[] = [];
    let cursor = 0;
    for (const match of text.matchAll(urlPattern)) {
        const href = match[0].replace(/[.,!?;:)]+$/, '');
        if (match.index > cursor) parts.push({ text: text.slice(cursor, match.index) });
        parts.push({ text: href, href });
        cursor = match.index + href.length;
    }
    if (cursor < text.length) parts.push({ text: text.slice(cursor) });
    return parts;
};
