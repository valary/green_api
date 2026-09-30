import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { App } from '@/app/App'
import { persistChats, store } from '@/app/store'
import { loadStoredSession } from '@/entities/session'
import { restoreSession, startDemo } from '@/features/auth'

const saved = loadStoredSession()
if (saved) {
  // После F5 в демо воркер должен встать раньше первого запроса приёма.
  if (saved.mode === 'demo') await startDemo(saved.scenario ?? 'default')
  restoreSession(store.dispatch, saved)
}

persistChats(store)

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
