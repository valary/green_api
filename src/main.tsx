import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { App } from './app/App';
import { persistChats } from './app/store/persistChats';
import { store } from './app/store/store';
import { loadStoredSession } from './shared/utils/sessionStorage';
import { restoreSession, startDemo } from './app/store/slices/session/thunks';

const saved = loadStoredSession();
if (saved) {
    // После F5 в демо воркер должен встать раньше первого запроса приёма.
    if (saved.mode === 'demo') await startDemo(saved.scenario ?? 'default');
    restoreSession(store.dispatch, saved);
}

persistChats(store);

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <App />
    </StrictMode>,
);
