import { createBrowserRouter, Navigate, type RouteObject } from 'react-router-dom'
import { ChatPage } from '@/pages/chat'
import { LoginPage } from '@/pages/login'
import { GuestOnly, RequireSession } from './guards'

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
        <ChatPage />
      </RequireSession>
    ),
  },
  { path: '*', element: <Navigate to="/" replace /> },
]

export const router = createBrowserRouter(routes, {
  basename: import.meta.env.BASE_URL.replace(/\/$/, '') || '/',
})
