import { createBrowserRouter, Navigate } from 'react-router-dom';
import type { RouteObject } from 'react-router-dom';
import { LoginPage } from '@/pages/LoginPage/LoginPage';
import { GuestOnly, RequireSession } from '@/components/RouteGuards/RouteGuards';
import { LazyChatPage } from '@/pages/ChatPage/LazyChatPage';

// В адресе только chatId: токен в URL приложения не попадает никогда.
export const routes: RouteObject[] = [
    {
        path: '/',
        element: (
            <GuestOnly>
                <LoginPage />
            </GuestOnly>
        ),
    },
    {
        path: '/chat/:chatId?',
        element: (
            <RequireSession>
                <LazyChatPage />
            </RequireSession>
        ),
    },
    { path: '*', element: <Navigate to="/" replace /> },
];

export const router = createBrowserRouter(routes, {
    basename: import.meta.env.BASE_URL.replace(/\/$/, '') || '/',
});
