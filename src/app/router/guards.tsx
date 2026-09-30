import type { ReactNode } from 'react'
import { Navigate } from 'react-router-dom'
import { selectSession } from '@/entities/session'
import { useAppSelector } from '@/shared/lib/redux'

export function RequireSession({ children }: { children: ReactNode }) {
  const session = useAppSelector(selectSession)
  return session ? children : <Navigate to="/" replace />
}

export function GuestOnly({ children }: { children: ReactNode }) {
  const session = useAppSelector(selectSession)
  return session ? <Navigate to="/chat" replace /> : children
}
