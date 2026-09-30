import { chatsRestored, loadChats } from '@/entities/chat';
import { sessionStarted, storeSession, type StoredSession } from '@/entities/session';
import { clearCredentials, greenApi, notAuthorizedText, setCredentials, toApiError } from '@/shared/api';
import { createAppAsyncThunk } from '@/shared/lib/redux';
import type { AppDispatch } from '@/app/store';
import { checkSettings } from './checkSettings';

export function restoreSession(
    dispatch: AppDispatch,
    { credentials, mode, remember, scenario }: StoredSession,
) {
    setCredentials(credentials);
    dispatch(sessionStarted({ idInstance: credentials.idInstance, mode, remember, scenario }));
    const saved = loadChats(credentials.idInstance, remember);
    if (saved) dispatch(chatsRestored(saved));
}

export const signIn = createAppAsyncThunk(
    'auth/signIn',
    async (session: StoredSession, { dispatch, rejectWithValue }) => {
        setCredentials(session.credentials);
        try {
            const state = await greenApi.getStateInstance();
            if (state !== 'authorized') {
                clearCredentials();
                return rejectWithValue({ kind: 'notAuthorized', message: notAuthorizedText(state) });
            }
        } catch (e) {
            clearCredentials();
            return rejectWithValue(toApiError(e));
        }

        storeSession(session);
        restoreSession(dispatch, session);
        void dispatch(checkSettings());
    },
);
