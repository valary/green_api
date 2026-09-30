import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { App } from '@/app/App'
import { store } from '@/app/store'
import { loadStoredSession } from '@/entities/session'
import { restoreSession } from '@/features/auth'

const saved = loadStoredSession()
if (saved) restoreSession(store.dispatch, saved)

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
