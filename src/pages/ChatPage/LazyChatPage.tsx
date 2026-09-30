import { lazy, Suspense } from 'react';

// Чат с приёмом и отправкой на экране входа не нужен — грузим отдельным чанком.
const ChatPage = lazy(() => import('./ChatPage').then(({ ChatPage }) => ({ default: ChatPage })));

export const LazyChatPage = () => {
    return (
        <Suspense>
            <ChatPage />
        </Suspense>
    );
};
